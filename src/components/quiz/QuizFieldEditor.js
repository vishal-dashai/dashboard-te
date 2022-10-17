import React, {useState} from "react";
import './quiz_field_editor.scss';
import {AddIcon, Button, ChevronLeftIcon, ChevronRightIcon, CrossIcon, Icon, TickIcon} from "evergreen-ui";
import Bubble from "../elements/Bubble";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function Choices({choices, setChoices}) {
	const [nextID, setNextID] = useState(0)

	return (
		<div className="choicesDiv">
			{choices.map((ele, idx) => {
				return (
					<div key={idx} style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '90px',
					}}>
						<div className="pill">
							<Bubble text={alphabet[idx]}/>
							<textarea wrap={"off"} placeholder={"Enter answer here"} className={"choiceEdit"}
									  value={ele.text} onChange={(event) => {
								setChoices(b => {
									return b.map((n) => {
										if (n.choiceID === ele.choiceID) {
											return {...n, text: event.target.value}
										}
										return n;
									})
								})
							}}/>
							<Icon icon={CrossIcon} onClick={() => {
								setChoices((q) => q.filter(b => b.choiceID !== q[idx].choiceID))
							}}/>
						</div>

						<div className="checkArea" onClick={() => {
							setChoices(b => {
								return b.map((n) => {
									return {...n, isCorrect: n.choiceID === ele.choiceID};
								})
							})
						}}>
							{ele.isCorrect && <Icon icon={TickIcon} style={{
								color: 'white',
								backgroundColor: '#4CC0B2',
								border: '7px solid white',
								borderRadius: 30,
							}}/>}
						</div>
					</div>
				)
			})}
			<Button className="addChoiceArea"
					appearance='minimal'
					iconBefore={AddIcon}
					onClick={() => {
						setChoices(r => {
							setNextID(a => a + 1)
							return [...r, {text: "", choiceID: nextID}]
						})
					}}
					size={'large'}
			>
				Add new choice
			</Button>
		</div>
	);
}

export default function QuizFieldEditor({selectedID, setSelectedID, list, setList}) {

	function setChoices(c) {
		let r = c(list[selectedID].choices);

		setList(b => {
			return b.map((n, idx) => {
				if (idx === selectedID) {
					return {...n, choices: r}
				}
				return n;
			})
		})
	}

	return (
		<div>
			{(selectedID < list.length && list.length !== 0) &&
				<div style={{
					marginLeft: 20,
					display: 'flex',
					flexDirection: 'column'
				}}>
					{/*<Bubble text={selectedID} scale={50}/>*/}
					<textarea className={"titleEdit"} placeholder={"Enter question here."}
							  value={list[selectedID].title} onChange={(event) => {
						setList(b => {
							return b.map((n, idx) => {
								if (idx === selectedID) return {...n, title: event.target.value}
								return n;
							})
						})
					}}/>
					<hr className="solid"/>

					<div style={{
						display: 'flex',
						flexDirection: 'row',
						marginTop: 30,
						gap: '250px'
					}}>
						<p className={"headerText"}>Choices</p>
						<p className={"headerText"}>Correct Answer</p>
					</div>

					<Choices choices={list[selectedID].choices} setChoices={setChoices}/>

					<div style={{
						marginTop: 'auto',
						display: 'flex',
						flexDirection: 'row',
						gap: '20px',
					}}>
						<Button iconBefore={ChevronLeftIcon} className="prevButton" onClick={() => {
							setSelectedID(r => {
								if (r === 0) return 0;
								return r - 1;
							});
						}
						} disabled={selectedID <= 0}>Prev. Question</Button>
						<Button iconAfter={ChevronRightIcon}
								className="nextButton"
								onClick={() => {
									if (selectedID === list.length - 1) {
										setList(r => [...r, {title: "", choices: []}])
										setSelectedID(r => r + 1);
									} else {
										setSelectedID(r => r + 1);
									}
								}}
						>{selectedID === list.length - 1 ? 'New Question' : 'Next Question'}</Button>
					</div>
				</div>
			}
		</div>
	)
}
