import React, {useContext, useEffect, useState} from "react";
import vector1 from '../assets/vector1.png'
import vector2 from '../assets/vector2.png'
import vector3 from '../assets/vector3.png'
import '../App.scss'
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import ManagerBar from "../components/ManagerBar";
import {Alert, Button, Spinner, Textarea, TickIcon} from "evergreen-ui";
import API from "../api";
import {ContentRequest, ContentSender} from "@thedashboardai/train-edu-front-end-api-wrapper";

export default function Updates() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [uploaded, setUploaded] = useState();
	const [uploading, setUploading] = useState(false);

	const [text, setText] = useState('' | null);

	const postNode = async () => {
		setUploading(true)
		console.log(profile.restaurantId)

		let q = text.split('\n');
		let ht = '<ul>';
		q.forEach((e) => {
			ht += '<li>' + e + '</li>';
		})
		ht += '</ul>';
		console.log(ht)

		await ContentSender.updateDailyNote(await user.getIdToken(), profile.restaurantId, {note: ht});

		await delay(3000)
		setUploading(false)
	}

	const delay = ms => new Promise(res => setTimeout(res, ms));

	useEffect(() => {
		if (user !== null && profile !== null) {
			const ar = async () => {
				setText(await ContentRequest.getAndStripNote(await user.getIdToken(), profile.restaurantId));
			}
			ar()
		}
	}, [user, profile])

	return (
		<>
			<ManagerBar/>

			<div className="App">
				<div className={'coloredHeading'}>
					<h1>Daily Notes</h1>
				</div>

				<div className="content">
					<div style={{marginTop: 10}}>
						<h3>Enter any new or urgent training updates here!</h3>

						{uploaded && <Alert intent={'success'} title={'Message uploaded successfully!'}/>}
						{uploading && <center><Spinner/><strong>Uploading note...</strong></center>}

						<div style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '100%',
							alignContent: 'center',
							alignItems: 'center',
							flex: '1 1 auto',
							marginTop: 20,
						}}>
							<p>Enter each point on a new line.</p>

							<label title={'daily note update'} style={{minWidth: '100%'}}>
								<Textarea name="textarea-1" placeholder="Type something here" minHeight={'40vh'}
										  style={{marginBottom: 20, minWidth: '100%'}} value={text}
										  onChange={(e) => setText(e.target.value)}/>
							</label>
							<Button iconAfter={TickIcon}
									className="nextButton"
									style={{background: '#44A8FF'}}
									onClick={() => {
										postNode()
									}}
							>{'Submit Update'}</Button>
						</div>

					</div>

					<img className="vector1" src={vector1} alt="design"/>
					<img className="vector2" src={vector2} alt="design"/>
					<img className="vector3" src={vector3} alt="design"/>
				</div>
			</div>
		</>
	);
}
