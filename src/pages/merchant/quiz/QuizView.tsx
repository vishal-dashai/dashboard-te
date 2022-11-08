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
import {useMediaQuery} from "react-responsive";
import {LiveQuiz} from "../../../api/quiz/Quiz";
import {QuizConnection} from "../../../api/quiz/QuizConnection";
import {alphabet} from "../../../components/quiz/QuizFieldEdit";

export default function QuizView() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [topics, setTopics] = useState<Array<TopicInfo>>([]);
	const [viewing, setViewing] = useState<LiveQuiz>();
	const [show, setShow] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const handleClose = () => {
		setShow(false)
		setViewing(null)
	};

	const handleShow = async (topic: TopicInfo) => {
		setShow(true)
		await QuizConnection.loadQuizByTopic(topic).then((r: LiveQuiz) => {
			setViewing(r)
			console.log(viewing)
		});
	};

	const loadTopics = async () => {
		let tops: TopicInfo[] = []
		await fetch(`${API}/getAllTopics/${profile.restaurantId}`).then(e => e.json()).then(data => {
			for (let i in data) {
				let top: TopicInfo = JSON.parse(JSON.stringify(data[i]));
				if (top.name !== 'daily notes')
					tops.push(top);
			}
		});
		setTopics(tops)
	}

	useEffect(() => {
		if (user !== null && profile !== null) {
			const a = async () => {
				setLoading(true)
				await loadTopics()
				setLoading(false)
			}
			a()
		}
	}, [user, profile])

	const isSmaller = useMediaQuery({query: '(max-width: 1200px)'})

	return (
		<>
			<ManagerBar/>
			<div>

				<div className={'topics'}>

					{isLoading ? <div className={'centerContent'}><h2>Loading</h2>
						<Spinner/></div> : topics.map((a, i) => {
						return (
							<div className={'topicSection'} key={i}>
								<div style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									gap: 20,
									width: '70%'
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
					{viewing ? <>
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
					</> : <div className={'centerContent'}><h2>Loading Quiz</h2>
						<Spinner/></div>
					}
				</Modal>

				<img className="vector1" src={vector1} alt="design"/>
				<img className="vector2" src={vector2} alt="design"/>
				<img className="vector3" src={vector3} alt="design"/>
			</div>
		</>

	);
}
