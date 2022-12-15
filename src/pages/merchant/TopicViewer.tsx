import React, {useContext, useEffect, useState} from "react";
import {AuthContextType, AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {ContentRequest, ITopic} from "@thedashboardai/train-edu-front-end-api-wrapper";
import {Spinner} from "evergreen-ui";
import frame from '../../assets/img/Frame.png';

export default function TopicViewer() {
	const {user, profile} = useContext(AuthenticatedUserContext) as AuthContextType;
	const [isLoading, setLoading] = useState(true);
	const [topics, setTopics] = useState<ITopic[]>(null);

	useEffect(() => {
		if (user !== null && profile !== null) {
			const a = async () => {
				setLoading(true)
				setTopics(await ContentRequest.getAllTopics(await user.getIdToken(), profile.restaurantId))
				setLoading(false)
			}
			a()
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
