import React, {useContext} from "react";
import vector1 from '../../assets/vector1.png'
import vector2 from '../../assets/vector2.png'
import vector3 from '../../assets/vector3.png'
import '../../App.scss';
import {Alert, Button, Pane, Spinner, Textarea, TickIcon} from "evergreen-ui";
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {FileUpload} from "../../components/FileUpload";

export default function Upload() {
	const {user, profile} = useContext(AuthenticatedUserContext);

	const [files, setFiles] = React.useState([])
	const [uploading, setUploading] = React.useState(false)
	const [wasGood, setWasGood] = React.useState(false)

	async function uploadContent() {
		setUploading(true)
		let dat = new FormData();

		files.forEach(value => {
			dat.append('files', value);
		})

		await fetch('https://new-customer-onboarding.herokuapp.com/api/v1/upload?' + new URLSearchParams({
			name: profile.name,
			email: profile.email,
			restaurantName: profile.restaurantName
		}), {
			method: 'POST',
			cache: 'no-cache',
			body: dat
		}).then(i => i.json()).then(b => {
			console.log("B is below")
			console.log(b)
			setWasGood(true)
			setFiles([])
		}).catch((c) => {
			console.log(c)
			setWasGood(false)
		});
		setUploading(false)
	}

	return (
		<>
			<ManagerBar/>

			<div className="App">

				<div className={'coloredHeading'}>
					<h1>Upload Content</h1>
				</div>

				<div className="content">
					<div style={{marginTop: 10}}>

						<div style={{
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
