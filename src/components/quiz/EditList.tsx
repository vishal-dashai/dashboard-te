import React, {Dispatch, SetStateAction, useState} from "react";
import './editable_list.scss';
import {IQuiz, Quiz} from "../../api/quiz/Quiz";
import {AddIcon, ChevronLeftIcon, CrossIcon, Icon} from 'evergreen-ui';
import {Question} from "../../api/quiz/Question";
import {Modal} from "react-bootstrap";

type EditableListProps = {
	quiz: IQuiz;
	updateQuiz: Function;
	setSelectedId: Dispatch<SetStateAction<number>>;
	selectedId: number;
	errors: Question;
};

type DeleteModalProps = {
	quiz: IQuiz;
	updateQuiz: Function;
	modalShow: boolean;
	onHide: Function;
	selectedDelete: number;
};

export const EditList = ({quiz, updateQuiz, selectedId, setSelectedId, errors}: EditableListProps) => {
	const [modalShow, setModalShow] = useState(false);
	const [selectedDelete, setSelectedDelete] = useState(-1);

	return (
		<div className="questionBox">
			<p className={'quizNameEditor'}>{quiz.name}</p>

			<div style={{
				overflowY: 'auto',
				flex: 1,
			}}>

				{quiz.questions.map((ele, inx) => (
					<div className="box" key={inx} onClick={() => {
						setSelectedId(inx);
					}} style={{
						border: (selectedId === inx ? '2px solid #44A8FF' : 'none'),
					}}>
						<div className="questionArea">
							<div style={{display: 'flex', flexDirection: 'row'}}>
								<p className="questionNumber">Q {inx + 1}.</p> {errors && errors === ele &&
								<p className={'angryText'}>This question has errors.</p>}
							</div>
							<p className="questionPreview">{ele.questionText}</p>
						</div>
						<div>
							<Icon icon={CrossIcon} onClick={() => {
								setSelectedDelete(inx)
								setModalShow(true)
								// setList((q) => q.filter((b, i) => i !== inx))
							}}/>
						</div>
					</div>
				))}

				<button className="addButtonArea" onClick={() => {
					quiz.questions.push(new Question("", []))
					updateQuiz()
				}}>
					<Icon icon={AddIcon}/>
					New Question
				</button>
			</div>
			<DeletePopup modalShow={modalShow} updateQuiz={updateQuiz} onHide={() => setModalShow(false)} quiz={quiz}
						 selectedDelete={selectedDelete}/>
		</div>
	)
};

export const DeletePopup = ({
								quiz,
								updateQuiz,
								modalShow,
								onHide,
								selectedDelete,
							}: DeleteModalProps) => {
	return (
		<Modal
			show={modalShow}
			onHide={onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			contentClassName={'confirmationModal'}
			backdrop="static"
			keyboard={false}
		>
			<Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">
					Delete this question?
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Are you sure you want to delete this question? If you publish your changes it cannot be restored.</p>
			</Modal.Body>
			<Modal.Footer>
				<button
					className="prevButton"
					onClick={() => {
						onHide()
					}}
				>
					No, cancel
					{<Icon icon={ChevronLeftIcon} height={20} width={20} marginTop={3}/>}
				</button>

				<button
					className="nextButton"
					id={'warning'}
					onClick={() => {
						quiz.questions = quiz.questions.filter((b, i) => i !== selectedDelete)
						updateQuiz()
						onHide()
					}}
				>
					Yes, delete
					{<Icon icon={CrossIcon} height={20} width={20} marginTop={3}/>}
				</button>
			</Modal.Footer>
		</Modal>
	);
}
