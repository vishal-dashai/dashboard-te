import React, {useContext, useEffect, useState} from "react";
import vector1 from '../assets/vector1.png'
import vector2 from '../assets/vector2.png'
import vector3 from '../assets/vector3.png'
import '../App.scss'
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import '../../src/assets/css/quiz_editor.scss'
import EditableList from "../components/quiz/EditableList";
import QuizFieldEditor from "../components/quiz/QuizFieldEditor";
import ManagerBar from "../components/ManagerBar";
import API from "../api";
import {ChevronUpIcon, CrossIcon, Icon, Spinner, TickIcon} from "evergreen-ui";
import {useSearchParams} from "react-router-dom";
import {Modal} from "react-bootstrap";
import QuizUploader from "../api/quiz/QuizUploader";
import {EditList} from "../components/quiz/EditList";

// import EditList from "src/components/quiz/EditList.tsx";

function ConfirmationPopup({show, onHide, publish, quizName, isUploading}) {
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
			{!isUploading ? <> <Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">
					Publish {quizName}?
				</Modal.Title>
			</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to publish this quiz? It will be visible to all employees.</p>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="prevButton"
						onClick={() => {
							onHide()
						}}
					>
						No, cancel
						{<Icon icon={CrossIcon}/>}
					</button>

					<button
						className="nextButton"
						onClick={() => {
							// onHide()
							publish()
						}}
					>
						Yes, publish quiz
						{<Icon icon={TickIcon}/>}
					</button>
				</Modal.Footer></> : <div className={'centerContent'}><h2>Publishing changes</h2>
				<Spinner/></div>}
		</Modal>
	);
}

export default function QuizEditor() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [selectedID, setSelectedID] = useState(0)
	const [list, setList] = useState([]);
	const [quizName, setQuizName] = useState('');
	const [modalShow, setModalShow] = React.useState(false);
	const [searchParams] = useSearchParams();
	const [liveQuizData, setLiveQuizData] = useState();

	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);

	const loadQuiz = async () => {
		setLoading(true)
		await fetch(`${API}/getQuizByRestTopic?` + new URLSearchParams({
			restaurantId: profile.restaurantId,
			topicId: searchParams.get('id')
		}), {
			method: 'GET',
		}).then(e => e.json()).then(data => {
				console.log("QUIZ DATA IS HERE")
				console.log(data)
				if (data?.status === 404 || data?.status === 500 || data?.status === 400) {
					//setQuiz(null)
					// alert("No quiz for this topic!")
				} else {
					console.log(data)
					setQuizName(data.name)
					setLiveQuizData(data)

					let quest = [];
					data.questions.forEach((ele) => {
						let i = 0;
						let opts = [];
						ele.answerOptions.forEach((opt) => {
							opts.push({
								text: opt.answerOptionText,
								choiceID: ++i,
								isCorrect: opt.answerOptionId === ele.correctAnswerId
							})
						})
						quest.push({title: ele.questionText, choices: opts, questionId: ele.questionId})
					})
					setList(quest);
				}
			}
		).catch(e => {
			console.log("Quiz error")
			console.log("ERROR: " + e)
		})
		setLoading(false)
	}

	const publish = async () => {
		console.log("DATA IS AS FOLLOWS")
		console.log(quizName)
		console.log(list)

		console.log("LIVE DATA")
		console.log(liveQuizData)
		setUploading(true)
		if (liveQuizData !== null && liveQuizData !== undefined) {
			const result = QuizUploader.compareAndBuildData(liveQuizData, list)
			await fetch(`${API}/updateQuestions/` + liveQuizData.quizId, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(result)
			})
		} else {
			await fetch(`${API}/addQuizByRestTopic?restaurantId=${profile.restaurantId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					restaurantId: profile.restaurantId,
					topicId: searchParams.get('id'),
					name: decodeURIComponent(searchParams.get('n')) + 'Quiz',
					totalQuestions: list.length,
					totalScore: list.length
				})
			}).then(e => e.json()).then(async r => {
				console.log('RESULT FROM ADDING')
				console.log(r)
				let quizId = r.quiz_id

				let totalData = []

				list.forEach((ele) => {
					let options = []
					ele.choices.forEach((cho) => options.push({
						answerOptionText: cho.text,
						isCorrect: cho?.isCorrect ?? false
					}))

					if (options.length !== 0) {
						totalData.push({
							questionText: ele.title,
							answerOptions: options
						})
					}
				});

				console.log('CREATE QUESTIONS TO BE UPLOADED')
				console.log(list)
				console.log("TOTAL DATA")
				console.log(totalData)

				await fetch(`${API}/createAllQuestions/${quizId}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({"questions": totalData})
				}).then(e => e.json()).then(r => {
					console.log({"questions": totalData})
					console.log(r)
					// alert("Quiz was uploaded!")
				}).catch(err => {
					console.log("error")
					console.log(err)
				})

			}).catch(err => {
				console.log("error")
			})
		}
		await loadQuiz()
		setUploading(false)
		setModalShow(false)
	}

	useEffect(() => {
		console.log('THE USER')
		console.log(user)
		console.log(profile)
		if (user !== null && profile !== null)
			loadQuiz()
		console.log("ID IS ")
		console.log(searchParams.get('id'))
	}, [user, profile])

	return (
		<>
			<ManagerBar/>
			{!loading ?
				<>
					<div className="quizEditor">
						<EditableList
							setSelectedID={setSelectedID}
							selectedID={selectedID}
							list={list}
							setList={setList}
							quizName={quizName}
							setQuizName={setQuizName}
						/>

						{/*<EditList quiz={null} setSelectedId={setSelectedID} selectedId={selectedID}/>*/}

						<div className="viewArea">
							<QuizFieldEditor
								setSelectedID={setSelectedID}
								selectedID={selectedID}
								list={list}
								setList={setList}/>
						</div>

						<div className={"changesArea"}>
							<button className={"fancyButtonFull"} onClick={() => {
								// window.location.href = "onboard";
								setModalShow(true)
							}}>
								{"Publish Quiz"}
								{<Icon icon={ChevronUpIcon} height={20} width={20} marginTop={3}/>}
							</button>

						</div>

						<img className="vector1" src={vector1} alt="design"/>
						<img className="vector2" src={vector2} alt="design"/>
						<img className="vector3" src={vector3} alt="design"/>
					</div>

					<ConfirmationPopup show={modalShow} onHide={() => setModalShow(false)} quizName={quizName}
									   publish={publish} isUploading={uploading}/>
				</> :
				<div className={'centerContent'}><h2>Loading Quiz</h2>
					<Spinner/></div>
			}
		</>

	);
}
