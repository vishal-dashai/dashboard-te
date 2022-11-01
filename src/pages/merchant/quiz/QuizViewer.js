import React, {useContext, useEffect, useState} from "react";
import vector1 from '../../../assets/vector1.png'
import vector2 from '../../../assets/vector2.png'
import vector3 from '../../../assets/vector3.png'
import '../../../assets/css/QuizViewer.scss';
import {AuthenticatedUserContext} from "../../../provider/AuthenticatedUserProvider";
import API from "../../../api";
import TopicInfo from "../../../api/TopicInfo";
import ManagerBar from "../../../components/ManagerBar";
import {ChevronRightIcon, CrossIcon, Icon, Spinner} from "evergreen-ui";
import TaskSquare from '../../../assets/svg/task-square.svg';
import EditIcon from '../../../assets/svg/edit-2.svg';
import {Modal} from "react-bootstrap";
import {alphabet} from "../../../components/quiz/QuizFieldEditor";
import {useMediaQuery} from "react-responsive";

export default function QuizViewer() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [topics, setTopics] = useState([]);
	const [viewing, setViewing] = useState();
	const [show, setShow] = useState(false);
	const [nothingThere, setNothingThere] = useState(false);

	const handleClose = () => {
		setShow(false)
		setViewing(null)
	};

	const handleShow = async (topic) => {
		setNothingThere(false)
		setShow(true)
		await loadQuiz(topic).then((r) => {
			setViewing(r)
			console.log('status is ')
			console.log(r?.status)
			if (r?.status && r?.status !== 200) {
				setNothingThere(true)
				setViewing(null)
			}
			console.log(viewing)
		}).catch((e) => {
			setNothingThere(true)
		});
	};

	const loadTopics = async () => {
		let tops = []
		await fetch(`${API}/getAllTopics/${profile.restaurantId}`).then(e => e.json()).then(data => {
			for (let i in data) {
				let r = data[i];
				if (r.name !== 'daily notes') {
					let top = new TopicInfo(r.name, r.restaurant_id, r.topicId);
					tops.push(top);
				}
			}
		});
		setTopics(tops)
	}

	const loadQuiz = async (topic) => {
		let dat = null;
		await fetch(`${API}/getQuizByRestTopic?` + new URLSearchParams({
			restaurantId: topic.restaurant_id,
			topicId: topic.topicId
		}), {
			method: 'GET',
		}).then(e => e.json()).then(data => {
				console.log("QUIZ DATA IS HERE")
				console.log(data)
				if (data?.status === 404 || data?.status === 500 || data?.status === 400) {
					//setQuiz(null)
					// alert("No quiz for this topic!")
					dat = {status: 400}
				} else {
					console.log(data)
					dat = data;
				}
				// let quiz = new LiveQuiz();

			}
		).catch(e => {
			console.log("Quiz error")
			console.log("ERROR: " + e)
		})
		return dat;
	}

	useEffect(() => {
		if (user !== null && profile !== null)
			loadTopics()
	}, [user, profile])

	const isSmaller = useMediaQuery({query: '(max-width: 1200px)'})

	return (
		<>
			<ManagerBar/>
			<div>

				<div className={'topics'}>

					{topics.map((a, i) => {
						return (
							<div className={'topicSection'} key={i}>
								<div style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									gap: 20
								}}>
									<img src={TaskSquare} alt=""/>
									<h3>{a.name}</h3>
								</div>

								<div style={{
									display: 'flex',
									flexDirection: 'row-reverse',
									alignItems: 'center',
									gap: 20
								}}>
									<button className={"fancyButtonPrev"} onClick={() => {
										// window.open('quizeditor/' + a.topicID, '_self')
										handleShow(a)
									}}>
										{"View"}
										<Icon icon={ChevronRightIcon} height={15} width={15}/>
									</button>

									{!isSmaller ?
										<button className={"fancyButtonFull"} onClick={() => {
											window.open('quizeditor?id=' + a.topicId + '&n=' + encodeURIComponent(a.name), '_self')
										}}>
											{"Edit Quiz"}
											<img src={EditIcon} alt=""/>
										</button> : <></>
									}
								</div>
							</div>
						)
					})}
				</div>

				<Modal show={show} onHide={handleClose} dialogClassName={'ex'}>
					{nothingThere ? <><h2>No quiz here yet! Close this pop-up and click 'Edit Quiz' to add one!</h2>
							<button className={"fancyButtonPrev"} onClick={() => {
								handleClose()
							}}>
								Close
								{<Icon icon={CrossIcon} height={20} width={20} marginTop={3} marginLeft={3}/>}
							</button>
						</> :
						viewing ? <>
							<Modal.Header>
								<Modal.Title>{viewing.name}</Modal.Title>
								<button className={"fancyButtonPrev"} onClick={() => {
									handleClose()
								}}>
									Close
									{<Icon icon={CrossIcon} height={20} width={20} marginTop={3} marginLeft={3}/>}
								</button>
							</Modal.Header>
							<div className={'viewBody'}>
								{viewing.questions.map((a, i) => {

									return (<div className={'infoSection'} key={i}>
										<h1>{(i + 1) + ". " + a.questionText}</h1>
										{a.answerOptions.map((r, b) => {
												return (
													a.correctAnswerId === r.answerOptionId ? <p className={'strong'}
																								key={b}>{alphabet[b] + ". " + r.answerOptionText}</p> :
														<p key={b}>{alphabet[b] + ". " + r.answerOptionText}</p>
												)
											}
										)}
									</div>)
								})}
							</div>
						</> : <><Spinner/></>}

				</Modal>

				<img className="vector1" src={vector1} alt="design"/>
				<img className="vector2" src={vector2} alt="design"/>
				<img className="vector3" src={vector3} alt="design"/>
			</div>
		</>

	);
}
