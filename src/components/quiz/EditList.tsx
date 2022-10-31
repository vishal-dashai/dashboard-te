import React, {Dispatch, SetStateAction, useState} from "react";
import './editable_list.scss';
import {IQuiz} from "../../api/quiz/Quiz";
import {AddIcon, ChevronLeftIcon, CrossIcon, Icon} from 'evergreen-ui';
import {Question} from "../../api/quiz/Question";
import {Modal} from "react-bootstrap";

type EditableListProps = {
	quiz: IQuiz;
	setSelectedId: Dispatch<SetStateAction<number>>;
	selectedId: number;
};

type DeleteModalProps = {
	quiz: IQuiz;
	modalShow: boolean;
	onHide: Function;
	selectedDelete: number;
};

export const EditList = ({quiz, selectedId, setSelectedId}: EditableListProps) => {
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
							<p className="questionNumber">Q {inx + 1}.</p>
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
					// setList(r => [...r, {title: "", choices: []}])
					quiz.questions.push(new Question("", [], 0));
				}}>
					<Icon icon={AddIcon}/>
					New Question
				</button>
			</div>
			<DeletePopup modalShow={modalShow} onHide={() => setModalShow(false)} quiz={quiz}
						 selectedDelete={selectedDelete}/>
		</div>
	)
};

export const DeletePopup = ({
								quiz,
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
					{<Icon icon={ChevronLeftIcon}/>}
				</button>

				<button
					className="nextButton"
					id={'warning'}
					onClick={() => {
						quiz.questions = quiz.questions.filter((b, i) => i !== selectedDelete)
						onHide()
					}}
				>
					Yes, delete
					{<Icon icon={CrossIcon}/>}
				</button>
			</Modal.Footer>
		</Modal>
	);
}
