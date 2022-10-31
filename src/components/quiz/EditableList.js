import React, {useState} from "react";
import './editable_list.scss';
import {AddIcon, ChevronLeftIcon, CrossIcon, Icon, Spinner, TickIcon} from "evergreen-ui";
import {Modal} from "react-bootstrap";

function DeletePopup({show, onHide, questionTitle, list, setList, deleteId}) {
	return (
		<Modal
			show={show}
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
					Delete {questionTitle}?
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
						setList((q) => q.filter((b, i) => i !== deleteId))
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

export default function EditableList({setSelectedID, selectedID, list, setList, quizName, setQuizName}) {
	const [modalShow, setModalShow] = useState(false);
	const [selectedDelete, setSelectedDelete] = useState(-1);

	return (
		<div className="questionBox">
			<p className={'quizNameEditor'}>{quizName}</p>

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
							<Icon icon={CrossIcon} onClick={() => {
								setSelectedDelete(inx)
								setModalShow(true)
								// setList((q) => q.filter((b, i) => i !== inx))
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
			<DeletePopup show={modalShow} onHide={() => setModalShow(false)} list={list} setList={setList}
						 deleteId={selectedDelete}/>
		</div>
	)
}
