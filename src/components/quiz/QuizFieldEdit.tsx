import React, {Dispatch, SetStateAction, useState} from "react";
import './quiz_field_editor.scss';
import {
	AddIcon,
	Button,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	CrossIcon,
	Icon,
	TickIcon
} from "evergreen-ui";
import Bubble from "../elements/Bubble";
import {Quiz} from "../../api/quiz/Quiz";
import {Answer} from "../../api/quiz/Answer";
import {Question} from "../../api/quiz/Question";

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type ChoicesProps = {
	quiz: Quiz;
	setQuiz: Dispatch<SetStateAction<Quiz>>;
	selectedId: number;
};

type QuizFieldEditProps = {
	quiz: Quiz;
	setQuiz: Dispatch<SetStateAction<Quiz>>;
	selectedId: number;
	setSelectId: Dispatch<SetStateAction<number>>;
};

function Choices({quiz, selectedId, setQuiz}: ChoicesProps) {
	const [nextID, setNextID] = useState(quiz.questions[selectedId].answerOptions.length)

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

								quiz.questions[selectedId].answerOptions[idx].answerOptionText = event.target.value
								setQuiz(q => ({...q}))
							}}/>
							<Icon icon={CrossIcon}
								  onClick={() => {

									  quiz.questions[selectedId].answerOptions = quiz.questions[selectedId].answerOptions.filter((a) =>
										  a.choiceId !== quiz.questions[selectedId].answerOptions[idx].choiceId
									  )

									  setQuiz(q => ({...q}))
								  }
								  }/>
						</div>

						<div className="checkArea" onClick={() => {
							quiz.questions[selectedId].answerOptions.forEach((a) => {
								a.isCorrect = a.choiceId === ele.choiceId
							})
							setQuiz(q => ({...q}))
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
						setNextID(a => a + 1)
						quiz.questions[selectedId].answerOptions.push(new Answer("", quiz.questions[selectedId].answerOptions.length === 0, nextID))
						setQuiz(q => ({...q}));
					}}
					size={'large'}
			>
				Add new choice
			</Button>
		</div>
	);
}

export default function QuizFieldEdit({selectedId, setSelectId, quiz, setQuiz}: QuizFieldEditProps) {

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
						setQuiz(q => ({...q}))
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

					<Choices quiz={quiz} selectedId={selectedId} setQuiz={setQuiz}/>

					<div style={{
						marginTop: 'auto',
						display: 'flex',
						flexDirection: 'row',
						gap: '20px',
					}}>
						<button className="prevButton" onClick={() => {
							setSelectId(r => (r === 0 ? 0 : r - 1))
						}
						} disabled={selectedId <= 0}>
							{<Icon icon={ChevronLeftIcon} height={20} width={20}
								   marginTop={3}/>}
							Prev. Question
						</button>
						<button
							className="nextButton"
							onClick={() => {
								if (selectedId === quiz.questions.length - 1) {
									quiz.questions.push(new Question("", []))
									setQuiz(q => ({...q}))
									setSelectId(r => r + 1);
								} else {
									setSelectId(r => r + 1);
								}
							}}
						>{selectedId === quiz.questions.length - 1 ? 'New Question' : 'Next Question'}{<Icon icon={ChevronRightIcon} height={20} width={20}
																											 marginTop={3}/>}</button>
					</div>
				</div>
			}
		</div>
	)
}
