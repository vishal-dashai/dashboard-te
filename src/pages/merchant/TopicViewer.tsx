import React, {useContext, useEffect, useState} from "react";
import {AuthContextType, AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {ContentRequest, ContentSender, ITopic} from "@thedashboardai/train-edu-front-end-api-wrapper";
import {Spinner} from "evergreen-ui";
import frame from '../../assets/img/Frame.png';
import {IPopup} from "../../components/Popup";
import {PopupContext, PopupContextProps} from "../../provider/PopupProvider";

export default function TopicViewer() {
	const {user, profile} = useContext(AuthenticatedUserContext) as AuthContextType;
	const [isLoading, setLoading] = useState(true);
	const [topics, setTopics] = useState<ITopic[]>(null);
	const {setPopups} = useContext<PopupContextProps>(PopupContext)

	async function loadTopics() {
		setLoading(true)
		let token = await user.getIdToken();
		setTopics(await ContentRequest.getAllTopics(token, profile.restaurantId))
		setLoading(false)
	}

	useEffect(() => {
		if (user !== null && profile !== null) {
			loadTopics()
		}
	}, [user, profile])

	return (
		<>
			<ManagerBar/>
			<div className="App">

				<div className={'coloredHeading'}>
					<h1>Your Content</h1>
				</div>

				<div className="content">

					<div className={'tileHeader'}>
						<h3>Select a Topic to edit:</h3>

						<button className={'nextButton'} id={'blue'} onClick={() => {
							let title: string = '';

							const popup: IPopup = {
								title: 'Add Topic',
								subText: 'Enter the name of the topic you want to add.',
								isInProgress: false,
								confirmType: 'blue',
								cancelText: 'Cancel',
								confirmText: 'Add',
								body: <>
								<textarea
									className={"contentTitleEdit"}
									placeholder={"Enter topic title"}
									defaultValue={title}
									onChange={(e) => {
										title = e.target.value;
									}}/>
								</>,
								onConfirmed: async () => {
									const token = await user.getIdToken()
									await ContentSender.addTopic(token, profile.restaurantId, [title])
									await loadTopics()
									setPopups(a => a?.filter((b) => b.title !== popup.title))
								}
							}
							setPopups(a => [...a, popup])
						}}>Add New +
						</button>
					</div>

					<div className={'tileArea'}>
						{isLoading ? <><Spinner/><strong>Loading topics...</strong></> :
							(topics == null ? <p>Something went wrong</p> : topics?.map((top, i) => {
								return (
									<div className={'contentTile'} key={i} onClick={() => {
										window.open('contentview?id=' + top.topicId, '_self')
									}}>
										<img
											src={top.iconUrl ? top.iconUrl : frame}
											alt={''}/>
										<p>{top.name}</p>
									</div>)
							}))}
					</div>
				</div>
			</div>
		</>
	);
}
