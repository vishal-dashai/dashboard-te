import React from "react";
import './editable_list.scss';
import {AddIcon, CrossIcon, Icon} from "evergreen-ui";

export default function EditableList({setSelectedID, selectedID, list, setList, quizName, setQuizName}) {
	return (
		<div className="questionBox">
			<textarea className={"quizNameEditor"} placeholder={"Enter quiz name here."}
					  value={quizName} onChange={(event) => {
				setQuizName(event.target.value)
			}}/>
			<div style={{
				overflowY: 'auto',
				flex: 1,
			}}>
				{list.map((ele, inx) => (
					<div className="box" key={inx} onClick={() => {
						setSelectedID(inx);
					}} style={{
						border: (selectedID === inx ? '2px solid #44A8FF' : 'none'),
					}}>
						<div className="questionArea">
							<p className="questionNumber">Q {inx + 1}.</p>
							<p className="questionPreview">{ele.title}</p>
						</div>
						<div>
							<Icon icon={CrossIcon}onClick={() => {
								setList((q) => q.filter((b, i) => i !== inx))
							}}/>
						</div>
					</div>
				))}
				<button className="addButtonArea" onClick={() => {
					setList(r => [...r, {title: "", choices: []}])
				}}>
					<Icon icon={AddIcon}/>
					New Question
				</button>
			</div>
		</div>
	)
}
