import React, {useContext, useEffect, useState} from "react";
import '../../../assets/css/QuizViewer.scss';
import {AuthContextType, AuthenticatedUserContext} from "../../../provider/AuthenticatedUserProvider";
import API from "../../../api";
import ManagerBar from "../../../components/ManagerBar";
import {ChevronRightIcon, CrossIcon, Icon, SavedIcon, Spinner} from "evergreen-ui";
import TaskSquare from '../../../assets/svg/task-square.svg';
import EditIcon from '../../../assets/svg/edit-2.svg';
import {Modal} from "react-bootstrap";
import {useMediaQuery} from "react-responsive";
import {alphabet} from "../../../components/quiz/QuizFieldEdit";
import Incrementer from "../../../components/elements/Incrementer";
import {ContentRequest, ILiveQuiz, ITopic, LiveQuiz} from "@thedashboardai/train-edu-front-end-api-wrapper";
import LoadingIndc from "../../../components/elements/LoadingIndc";

export default function QuizView() {
	const {user, profile} = useContext(AuthenticatedUserContext) as AuthContextType;
	const [topics, setTopics] = useState<Array<ITopic>>([]);
	const [viewing, setViewing] = useState<LiveQuiz | null>(null);
	const [show, setShow] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [maxAttempts, setMaxAttempts] = useState(1);
	const [liveMaxAttempts, setLiveMaxAttempts] = useState(1);

	const handleClose = () => {
		setShow(false)
		setViewing(null)
	};

	const handleShow = async (topic: ITopic) => {
		setShow(true)
		await ContentRequest.getQuiz(topic.restaurant_id, topic.topicId).then((r: ILiveQuiz) => {
			setViewing(new LiveQuiz(r))
			console.log(viewing)
		});
	};

	useEffect(() => {
		if (user !== null && profile !== null) {
			const a = async () => {
				setLoading(true)
				setTopics(await ContentRequest.getAllTopics(profile.restaurantId))
				const max = await ContentRequest.getMaxQuizAttempts(profile.restaurantId)
				setLiveMaxAttempts(max)
				setMaxAttempts(max)
				setLoading(false)
			}
			a()
		}
	}, [user, profile])

	const isSmaller = useMediaQuery({query: '(max-width: 1200px)'})

	return (
		<>
			<ManagerBar/>


			{isLoading ? <LoadingIndc message={'Loading quizzes'}/> :
				<div>
					<div className={'viewHeader'}>
						<h5>Maximum Quiz Attempts: </h5>
						<Incrementer value={maxAttempts} setValue={setMaxAttempts}/>

						<button
							onClick={async () => {
								await fetch(`${API}/setOrUpdateQuizMaxAttempts/` + profile.restaurantId, {
									method: 'PUT',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										maxQuizAttempts: maxAttempts
									})
								}).then((e) => {
									setLiveMaxAttempts(maxAttempts)
								})

							}}
							className={'pillButton'} id={(liveMaxAttempts === maxAttempts ? 'selected' : '')}>
							<p>{liveMaxAttempts !== maxAttempts ? 'Save' : 'Saved'}</p>
							<Icon icon={SavedIcon} color={(liveMaxAttempts === maxAttempts ? 'black' : 'white')}/>
						</button>
					</div>

					<div className={'topics'}>
						{topics?.map((a, i) => {
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
										<button className={"nextButtonBubbled"} id={'prev'} onClick={() => {
											// window.open('quizeditor/' + a.topicID, '_self')
											handleShow(a)
										}}>
											{"View"}
											<Icon icon={ChevronRightIcon} height={15} width={15}/>
										</button>

										{!isSmaller ?
											<button className={"nextButtonBubbled"} id={'blue'} onClick={() => {
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
				</div>}
		</>

	);
}
