import React, {useEffect, useState} from "react";
import logo from '../assets/logo.png';
import {ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, Icon, Pane, Spinner, TextInputField} from "evergreen-ui";
import {FileUpload} from "../components/FileUpload";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

const Page1 = ({name, setName, email, setEmail, restaurant, setRestaurant}) => {
	return (<div>
		<TextInputField inputHeight={50} fontSize={20} marginTop={10}
						label="What is your name?"
						type="name"
						value={name}
						required
						onChange={(e) => setName(e.target.value)}
						placeholder="Enter your name"
		/>
		<TextInputField inputHeight={50} fontSize={20} marginTop={10}
						label="What is your email address?"
						type="email"
						value={email}
						required
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter email address"
		/>
		<TextInputField inputHeight={50} fontSize={20} marginTop={10}
						label="What is your restaurant's name?"
						type="name"
						required
						value={restaurant}
						onChange={(e) => setRestaurant(e.target.value)}
						placeholder="Enter restaurant name"
		/>
	</div>)
}

const SubmittedPage = ({finishedState, isUploading}) => {

	return (<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
		{isUploading ?
			<>
				<h3>Uploading your content. Please do not close the tab!</h3>
				<Spinner animation="border" role="status">
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</> :
			<>
				<h2>{finishedState ? "We have received your information and will get back to you as soon as we can! Thank you!" : "Failed to send information. Please refresh and try again."}</h2>
			</>}
	</div>)
}

const Onboard = () => {
	const [name, setName] = useState(null);
	const [restaurant, setRestaurant] = useState(null);
	const [email, setEmail] = useState(null);

	const [pageNumber, setPageNumber] = useState(1);

	const [files, setFiles] = React.useState([])

	const [isUploading, setUploading] = useState(false);
	const [finishedState, setFinishedState] = useState();
	const chunkSize = 1048576 * 3;

	useEffect(() => {
		window.onbeforeunload = confirmExit;

		function confirmExit() {
			return isUploading ? "We are still uploading your files! If you close we won't receive your information!" : null;
		}

	}, [])

	const uploadFiles = async () => {


		let file = files[0];
		let dat = new FormData();

		dat.append("files", file)
		/*		files.forEach(value => {
					dat.append('files', value);
				})*/

		const chunkCount = file.size % chunkSize === 0 ? file.size / chunkSize : Math.floor(file.size / chunkSize) + 1;
		const fileID = uuidv4() + "." + file.name.split('.').pop();

		for (let i = 0; i < chunkCount; i++) {
			let start = i * chunkSize;
			let end = start + chunkSize;
			await uploadChunk(file, file.slice(start, end), fileID, i)

			/*			var percentage = (counter / chunkCount) * 100;
						setProgress(percentage);*/
		}

		await fetch('https://new-customer-onboarding.herokuapp.com/api/v1/upload?' + new URLSearchParams({
			name: name,
			email: email,
			restaurantName: restaurant
		}), {
			method: 'POST',
			cache: 'no-cache',
			body: dat
		}).then(i => i.json()).then(b => {
			console.log("B is below")
			console.log(b)
			setFinishedState(b)
			setUploading(false)
		}).catch((c) => {
			console.log(c)
		});
	}

	const uploadChunk = async (file, chunk, guid, index) => {
		try {
			const response = await axios.post("", chunk, {
				params: {
					id: index,
					fileName: guid,
				},
				headers: {'Content-Type': 'application/json'}
			});
			const data = response.data;
			if (data.isSuccess) {

			} else {
				console.log('Error Occurred:', data.errorMessage)
			}

		} catch (error) {
			console.log('error', error)
		}
	}

	return (
		<div>
			<div className={"fancyThing"}>
				<div className={"gib"}/>
				<div className={"gib2"}/>
				<h1 className={"welcomeMessage"}>Welcome to</h1>
				<div className={"sinatraLogo"}>
					<img alt={''} src={logo}/>
					<h2 className={"sinatraName"}>Sinatra</h2>
				</div>
			</div>

			<div className={"contentSection"}>
				<span className={"pill1"}/>
				<span className={"pill2"}/>
				<span className={"pill3"}/>

				<div className={"prompt"}>
					<p className={"basicText"}>Begin onboarding with the following below:</p>
					<Icon icon={ChevronDownIcon} height={20} width={20} paddingLeft={1} paddingTop={1}
						  border={'#000000 solid 1px'} borderRadius={100}/>
				</div>

				<div className={"mainContent"}>
					<div style={{maxWidth: 500, width: '75%'}}>
						<div style={{display: 'flex', flexDirection: 'row', marginRight: 50, width: '100%'}}>
							<div className="circle">{pageNumber}</div>
							<h3 className={"sectionHeader"}>{pageNumber === 1 ? "Basic Information" : pageNumber === 2 ? "Upload Content" : "Thank You!"}</h3>
						</div>

						{pageNumber === 1 && <Page1 restaurant={restaurant} setRestaurant={setRestaurant} email={email}
													setEmail={setEmail} name={name} setName={setName}/>}

						{pageNumber === 3 &&
							<SubmittedPage finishedState={finishedState} isUploading={isUploading}/>}

						{pageNumber === 2 && <>
							<Pane maxWidth={500} minWidth={200}>
								<FileUpload files={files} setFiles={setFiles}/>
							</Pane>
							{/*	<Pane maxWidth={500}>
								<Label htmlFor="textarea-2" marginBottom={4} display="block">
									Or add text
								</Label>
								<Textarea id="textarea-2" height={100} placeholder="Type something here"/>
							</Pane>*/}
						</>}


						{pageNumber <= 2 &&
							<div className={"buttonSection"}>
								{
									<button className={"fancyButtonPrev"} onClick={() => {
										if (pageNumber === 1) {
											window.history.back()
										}
										setPageNumber(a => {
											if (a <= 1) return 1;
											return a - 1;
										});
									}}>
										{<Icon icon={ChevronLeftIcon} height={20} width={20} marginTop={3}/>}
										{pageNumber === 1 ? "Home" : "Previous"}
									</button>
								}

								<button className={"fancyButton"}
										disabled={(name === null || email === null || restaurant === null)}
										onClick={async () => {
											setPageNumber(a => {
												if (a >= 3) return 3;
												if (name === null || email === null || restaurant === null) return a;
												return a + 1;
											});
											if (pageNumber > 1) {
												setUploading(true)
												let dat = new FormData();

												files.forEach(value => {
													dat.append('files', value);
												})

												await fetch('https://new-customer-onboarding.herokuapp.com/api/v1/upload?' + new URLSearchParams({
													name: name,
													email: email,
													restaurantName: restaurant
												}), {
													method: 'POST',
													cache: 'no-cache',
													body: dat
												}).then(i => i.json()).then(b => {
													console.log("B is below")
													console.log(b)
													setFinishedState(b)
													setUploading(false)
												}).catch((c) => {
													console.log(c)
												});
											}
										}}>
									{pageNumber === 1 ? "Next" : "Submit"}
									{<Icon icon={ChevronRightIcon} height={20} width={20} marginTop={3}/>}
								</button>
							</div>}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Onboard;
