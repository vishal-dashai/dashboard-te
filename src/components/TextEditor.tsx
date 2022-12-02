import React, {Dispatch, SetStateAction, useCallback, useMemo} from 'react'
import isHotkey from 'is-hotkey'
import {Editable, Slate, useSlate, withReact} from 'slate-react'
import {BaseEditor, createEditor, Editor, Element as SlateElement, Transforms,} from 'slate'
import {withHistory} from 'slate-history'
import {Button} from "react-bootstrap";
import {BoldIcon, Icon, ItalicIcon, ListIcon, NumberedListIcon, UnderlineIcon} from "evergreen-ui";
import {Toolbar} from "@mui/material";
import ToggleButton from "./elements/ToggleButton";

const HOTKEYS = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underline',
	'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const TextEditor = ({value, setValue}: { value: string, setValue: Dispatch<SetStateAction<string>> }) => {
	const renderElement = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; element: any }) =>
		<Element {...props} />, [])
	const renderLeaf = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; leaf: any }) =>
		<Leaf {...props} />, [])
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])

	return (
		<Slate
			editor={editor}
			value={initialValue}
			// @ts-ignore
			onChange={va => {
				const isAstChange = editor.operations.some((op: { type: string }) => 'set_selection' !== op.type)
				if (isAstChange) {
					setValue(JSON.stringify(va))
				}
			}}
		>
			<Toolbar>
				<MarkButton format="bold" icon={BoldIcon}/>
				<MarkButton format="italic" icon={ItalicIcon}/>
				<MarkButton format="underline" icon={UnderlineIcon}/>
				<BlockButton format="numbered-list" icon={NumberedListIcon}/>
				<BlockButton format="bulleted-list" icon={ListIcon}/>
			</Toolbar>
			<Editable
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				placeholder="Enter your content here."
				spellCheck
				autoFocus
				onKeyDown={(event: { preventDefault: () => void }) => {
					for (const hotkey in HOTKEYS) {
						if (isHotkey(hotkey, event as any)) {
							event.preventDefault()
							// @ts-ignore
							const mark = HOTKEYS[hotkey]
							toggleMark(editor, mark)
						}
					}
				}}
			/>
		</Slate>
	)
}

const toggleBlock = (editor: BaseEditor, format: string) => {
	const isActive = isBlockActive(
		editor,
		format,
		TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
	)
	const isList = LIST_TYPES.includes(format)

	Transforms.unwrapNodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			// @ts-ignore
			LIST_TYPES.includes(n.type) &&
			!TEXT_ALIGN_TYPES.includes(format),
		split: true,
	})
	let newProperties: Partial<SlateElement>
	if (TEXT_ALIGN_TYPES.includes(format)) {
		// @ts-ignore
		newProperties = {
			// @ts-ignore
			align: isActive ? undefined : format,
		}
	} else {
		// @ts-ignore
		newProperties = {
			// @ts-ignore
			type: isActive ? 'paragraph' : isList ? 'list-item' : format,
		}
	}
	Transforms.setNodes<SlateElement>(editor, newProperties)

	if (!isActive && isList) {
		// @ts-ignore
		const block = {type: format, children: []}
		Transforms.wrapNodes(editor, block)
	}
}

const toggleMark = (editor: BaseEditor, format: string) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

const isBlockActive = (editor: BaseEditor, format: string, blockType = 'type') => {
	const {selection} = editor
	if (!selection) return false

	// @ts-ignore
	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: n =>
				!Editor.isEditor(n) &&
				SlateElement.isElement(n) &&
				// @ts-ignore
				n[blockType] === format,
		})
	)

	return !!match
}

const isMarkActive = (editor: BaseEditor, format: string) => {
	const marks = Editor.marks(editor)
	// @ts-ignore
	return marks ? marks[format] === true : false
}

const Element = ({attributes, children, element}: { attributes: any, children: any, element: any }) => {
	const style = {textAlign: element.align}
	switch (element.type) {
		case 'block-quote':
			return (
				<blockquote style={style} {...attributes}>
					{children}
				</blockquote>
			)
		case 'bulleted-list':
			return (
				<ul style={style} {...attributes}>
					{children}
				</ul>
			)
		case 'heading-one':
			return (
				<h1 style={style} {...attributes}>
					{children}
				</h1>
			)
		case 'heading-two':
			return (
				<h2 style={style} {...attributes}>
					{children}
				</h2>
			)
		case 'list-item':
			return (
				<li style={style} {...attributes}>
					{children}
				</li>
			)
		case 'numbered-list':
			return (
				<ol style={style} {...attributes}>
					{children}
				</ol>
			)
		default:
			return (
				<p style={style} {...attributes}>
					{children}
				</p>
			)
	}
}

const Leaf = ({attributes, children, leaf}: { attributes: any, children: any, leaf: any }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.code) {
		children = <code>{children}</code>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	return <span {...attributes}>{children}</span>
}

const BlockButton = ({format, icon}: { format: any, icon: any }) => {
	const editor = useSlate()
	return (
		<ToggleButton
			active={isBlockActive(
				editor,
				format,
				TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
			)}
			onClick={() => {
				toggleBlock(editor, format)
			}}
/*			onMouseDown={event => {
				event.preventDefault()
				toggleBlock(editor, format)
			}}*/
		>
			<Icon icon={icon}/>
		</ToggleButton>
	)
}

const MarkButton = ({format, icon}: { format: any, icon: any }) => {
	const editor = useSlate()
	return (

		/*
				<button onMouseDown={event => {
			event.preventDefault()
			toggleMark(editor, format)
		}}>
			<Icon icon={icon}/>
		</button>

		 */
		<Button
			active={isMarkActive(editor, format)}
			onMouseDown={event => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			<Icon icon={icon}/>
		</Button>
	)
}

const initialValue = [
	{
		type: 'paragraph',
		align: 'left',
		children: [
			{text: 'This is editable '},
			{text: 'rich', bold: true},
			{text: ' text, '},
			{text: 'much', italic: true},
			{text: ' better than a '},
			{text: '!'},
		],
	}
]

export default TextEditor
