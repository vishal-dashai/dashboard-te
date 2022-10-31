import React, {Dispatch, SetStateAction, useState} from "react";
import './quiz_field_editor.scss';
import {AddIcon, Button, ChevronLeftIcon, ChevronRightIcon, CrossIcon, Icon, TickIcon} from "evergreen-ui";
import Bubble from "../elements/Bubble";
import {IQuiz, Quiz} from "../../api/quiz/Quiz";

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type ChoicesProps = {
	quiz: Quiz;
	selectedId: number;
};

type QuizFieldEditProps = {
	quiz: Quiz;
	selectedId: number;
	setSelectId: Dispatch<SetStateAction<number>>;
};

function Choices({quiz, selectedId}: ChoicesProps) {
	const [nextID, setNextID] = useState(0)

	return (
		<div className="choicesDiv">
			{quiz.questions[selectedId].answerOptions.map((ele, idx) => {
				return (
					<div key={idx} style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '90px',
					}}>
						<div className="pill">
							<Bubble text={alphabet[idx]}/>
							<textarea wrap={"off"} placeholder={"Enter answer here"} className={"choiceEdit"}
									  value={ele.answerOptionText} onChange={(event) => {

								quiz.questions[selectedId].updateOptions(b => {
									return b.map((n) => {
										if (n.choiceId === ele.choiceId) {
											return {...n, text: event.target.value}
										}
										return n;
									})
								})
							}}/>
							<Icon icon={CrossIcon}
								  onClick={() => quiz.questions[selectedId].updateOptions(q => q.filter(b => b.choiceId !== q[idx].choiceId))
								  }/>
						</div>

						<div className="checkArea" onClick={() => {

							quiz.questions[selectedId].updateOptions(b => b.map((n) => ({
								...n,
								isCorrect: n.choiceId === ele.choiceId
							})))
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

						quiz.questions[selectedId].updateOptions(r => {
							setNextID(a => a + 1)
							return [...r, {text: "", choiceID: nextID, isCorrect: r.length === 0}]
						})
					}}
					size={'large'}
			>
				Add new choice
			</Button>
		</div>
	);
}

export default function QuizFieldEdit({selectedId, setSelectId, quiz}: QuizFieldEditProps) {

	return (
		<div>
			{(selectedId < quiz.questions.length && quiz.questions.length !== 0) &&
				<div style={{
					marginLeft: 20,
					display: 'flex',
					flexDirection: 'column'
				}}>
					{/*<Bubble text={selectedID} scale={50}/>*/}
					<textarea className={"titleEdit"} placeholder={"Enter question here."}
							  value={quiz.questions[selectedId].questionText} onChange={(event) => {
						quiz.questions[selectedId].questionText = event.target.value;
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

					<Choices quiz={quiz} selectedId={selectedId}/>

					<div style={{
						marginTop: 'auto',
						display: 'flex',
						flexDirection: 'row',
						gap: '20px',
					}}>
						<Button iconBefore={ChevronLeftIcon} className="prevButton" onClick={() => {
							setSelectId(r => (r === 0 ? 0 : r - 1))
						}
						} disabled={selectedId <= 0}>Prev. Question</Button>
						<Button iconAfter={ChevronRightIcon}
								className="nextButton"
								onClick={() => {
									if (selectedId === quiz.questions.length - 1) {
										quiz.questions[selectedId].updateOptions(r => {
											return [...r, {title: "", choices: []}]
										});
										setSelectId(r => r + 1);
									} else {
										setSelectId(r => r + 1);
									}
								}}
						>{selectedId === quiz.questions.length - 1 ? 'New Question' : 'Next Question'}</Button>
					</div>
				</div>
			}
		</div>
	)
}
