import React, {useContext, useEffect, useState} from "react";
import {useMediaQuery} from "react-responsive";
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import vector1 from '../../assets/vector1.png'
import vector2 from '../../assets/vector2.png'
import vector3 from '../../assets/vector3.png'

export default function Forms() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [isLoading, setLoading] = useState(false);

	const loadTopics = async () => {
	/*	let tops: TopicInfo[] = []
		await fetch(`${API}/getAllTopics/${profile.restaurantId}`).then(e => e.json()).then(data => {
			for (let i in data) {
				let top: TopicInfo = JSON.parse(JSON.stringify(data[i]));
				if (top.name !== 'daily notes')
					tops.push(top);
			}
		});
		setTopics(tops)*/
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
			<div className="App">

				<div className={'coloredHeading'}>
					<h1>Forms</h1>
				</div>

				<div className="content">
					<div style={{marginTop: 10}}>

						{/*<div style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '100%',
							alignContent: 'center',
							alignItems: 'center',
							flex: '1 1 auto',
							marginTop: 20,
							gap: 20,
						}}>

							{!uploading && wasGood &&
								<Alert intent={'success'} title={'Content uploaded successfully!'}/>}
							{uploading ? <><h2>Uploading your content! Please do not close or refresh this page.</h2>
								<Spinner/></> : <><Pane maxWidth={500} minWidth={200}>
								<FileUpload files={files} setFiles={setFiles}/>
							</Pane>

								<Button iconAfter={TickIcon}
										className="nextButton"
										style={{background: '#44A8FF'}}
										onClick={() => {
											uploadContent()
										}}
								>{'Submit Content'}</Button></>}
						</div>*/}

					</div>

					<img className="vector1" src={vector1} alt="design"/>
					<img className="vector2" src={vector2} alt="design"/>
					<img className="vector3" src={vector3} alt="design"/>
				</div>
			</div>
		</>
	);
}
