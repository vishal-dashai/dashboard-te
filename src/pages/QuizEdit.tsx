import React, {useContext, useEffect, useState} from "react";
import vector1 from '../assets/vector1.png'
import vector2 from '../assets/vector2.png'
import vector3 from '../assets/vector3.png'
import '../App.scss'
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import '../../src/assets/css/quiz_editor.scss'
import ManagerBar from "../components/ManagerBar";
import {ChevronUpIcon, CrossIcon, Icon, Spinner, TickIcon} from "evergreen-ui";
import {useSearchParams} from "react-router-dom";
import {Alert, Modal} from "react-bootstrap";
import {EditList} from "../components/quiz/EditList";
import {IQuiz, LiveQuiz, Quiz} from "../api/quiz/Quiz";
import TopicInfo from "../api/TopicInfo";
import {QuizConnection} from "../api/quiz/QuizConnection";
import QuizFieldEdit from "../components/quiz/QuizFieldEdit";
import API from "../api";
import {Question} from "../api/quiz/Question";

type ConfirmationProps = {
	quiz: IQuiz;
	show: boolean;
	onHide: Function;
	publish: Function;
	isUploading: boolean;
};

function ConfirmationPopup({show, onHide, publish, quiz, isUploading}: ConfirmationProps) {
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
					Publish {quiz.name}?
				</Modal.Title>
			</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to publish this quiz? It will be visible to all employees.</p>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="nextButton"
						id={'prev'}
						onClick={() => {
							onHide()
						}}
					>
						No, cancel
						{<Icon icon={CrossIcon} height={20} width={20} marginTop={3}/>}
					</button>

					<button
						className="nextButton"
						id={'go'}
						onClick={() => {
							// onHide()
							publish()
						}}
					>
						Yes, publish quiz
						{<Icon icon={TickIcon} height={20} width={20} marginTop={3}/>}
					</button>
				</Modal.Footer></> : <div className={'centerContent'}><h2>Publishing changes</h2>
				<Spinner/></div>}
		</Modal>
	);
}

export default function QuizEdit() {
	const {user, profile} = useContext(AuthenticatedUserContext);

	const [modalShow, setModalShow] = React.useState(false);

	const [searchParams] = useSearchParams();

	const [selectedID, setSelectedID] = useState(0)
	const [liveQuizData, setLiveQuizData] = useState<LiveQuiz>(null);
	const [quiz, setEditingQuiz] = useState<Quiz>(null);

	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [errors, setErrors] = useState<{ message: string, errorQuestion: Question }>(null);

	const updateQuiz = () => {
		setEditingQuiz(q => {
			let err = QuizConnection.validateQuiz(q)
			if (err !== errors) {
				setErrors(null)
			}
			return ({...q})
		})
	}

	const publish = async () => {
		let errors = QuizConnection.validateQuiz(quiz)

		console.log(errors)
		if (errors !== null) {
			setModalShow(false)
			setErrors(errors)
			console.log(errors.message)
			return;
		}

		console.log("DATA IS AS FOLLOWS")
		console.log(quiz.name)
		console.log(quiz.questions)

		console.log("LIVE DATA")
		console.log(liveQuizData)
		setUploading(true)
		if (liveQuizData !== null && liveQuizData !== undefined) {
			const result = QuizConnection.compareAndBuildData(liveQuizData, quiz)
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
					totalQuestions: quiz.questions.length,
					totalScore: quiz.questions.length
				})
			}).then(e => e.json()).then(async r => {
				console.log('RESULT FROM ADDING')
				console.log(r)
				let quizId = r.quiz_id

				let totalData: { questionText: string; answerOptions: { answerOptionText: any; isCorrect: boolean; }[]; }[] = []

				quiz.questions.forEach((ele) => {
					let options: { answerOptionText: any; isCorrect: boolean; }[] = []
					ele.answerOptions.forEach((cho) => options.push({
						answerOptionText: cho.answerOptionText,
						isCorrect: cho?.isCorrect ?? false
					}))

					if (options.length !== 0) {
						totalData.push({
							questionText: ele.questionText,
							answerOptions: options
						})
					}
				});

				console.log('CREATE QUESTIONS TO BE UPLOADED')
				console.log(quiz.questions)
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
		await loadQuizData();
		setUploading(false)
		setModalShow(false)
	}

	const loadQuizData = async () => {
		setLoading(true)
		QuizConnection.loadQuizByTopic(new TopicInfo(searchParams.get('n'), profile.restaurantId, searchParams.get('id'))).then((a) => {
			setLiveQuizData(a);
			setEditingQuiz(a.toEditable());
			setLoading(false)
		})
	}

	useEffect(() => {
		console.log('THE USER')
		console.log(user)
		console.log(profile)
		if (user !== null && profile !== null) {
			loadQuizData();
		}
		console.log("ID IS ")
		console.log(searchParams.get('id'))
	}, [user, profile])

	useEffect(() => {
		const unloadCallback = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue = "";
			return "";
		};
		window.addEventListener("beforeunload", unloadCallback);
		return () => window.removeEventListener("beforeunload", unloadCallback);
	}, [])

	return (
		<>
			<ManagerBar/>
			{!loading ?
				<>
					<div className="quizEditor">
						<EditList quiz={quiz} updateQuiz={updateQuiz} setSelectedId={setSelectedID}
								  selectedId={selectedID} errors={errors !== null ? errors.errorQuestion : null}/>

						<div className="viewArea">
							<QuizFieldEdit quiz={quiz} updateQuiz={updateQuiz} selectedId={selectedID}
										   setSelectId={setSelectedID} errors={errors}/>
						</div>

						<div className={"changesArea"}>
							<button className={"nextButton"} id={'blue'} onClick={() => {
								// window.location.href = "onboard";
								setModalShow(true)
							}}>
								{"Publish Quiz"}
								{<Icon icon={ChevronUpIcon} height={20} width={20} marginTop={3}/>}
							</button>
							{/*<p>Autosaved 20 minutes ago...</p>*/}
						</div>

						<img className="vector1" src={vector1} alt="design"/>
						<img className="vector2" src={vector2} alt="design"/>
						<img className="vector3" src={vector3} alt="design"/>
					</div>

					<ConfirmationPopup show={modalShow} onHide={() => setModalShow(false)} quiz={quiz}
									   publish={publish} isUploading={uploading}/>
				</> :
				<div className={'centerContent'}><h2>Loading Quiz</h2>
					<Spinner/></div>
			}
		</>

	);
}
