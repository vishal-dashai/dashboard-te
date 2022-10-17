import React, {useState} from "react";
import logo from '../assets/logo.png';
import {
	Alert,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	FileCard,
	FileRejectionReason,
	FileUploader,
	Icon,
	Label,
	majorScale,
	MimeType,
	Pane,
	rebaseFiles,
	Textarea,
	TextInputField
} from "evergreen-ui";

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

const SubmittedPage = () => {

	return (<div>
		<h2>We have received your information and will get back to you as soon as we can! Thank you!</h2>
	</div>)
}


const Onboard = () => {
	const [name, setName] = useState(null);
	const [restaurant, setRestaurant] = useState(null);
	const [email, setEmail] = useState(null);

	const [pageNumber, setPageNumber] = useState(1);

	const acceptedMimeTypes = [MimeType.jpeg]
	const maxFiles = 5
	const maxSizeInBytes = 50 * 1024 ** 2 // 50 MB
	const [files, setFiles] = React.useState([])
	const [fileRejections, setFileRejections] = React.useState([])
	const values = React.useMemo(() => [...files, ...fileRejections.map((fileRejection) => fileRejection.file)], [
		files,
		fileRejections,
	])
	const handleRemove = React.useCallback(
		(file) => {
			const updatedFiles = files.filter((existingFile) => existingFile !== file)
			const updatedFileRejections = fileRejections.filter((fileRejection) => fileRejection.file !== file)

			// Call rebaseFiles to ensure accepted + rejected files are in sync (some might have previously been
			// rejected for being over the file count limit, but might be under the limit now!)
			const {accepted, rejected} = rebaseFiles(
				[...updatedFiles, ...updatedFileRejections.map((fileRejection) => fileRejection.file)],
				{acceptedMimeTypes, maxFiles, maxSizeInBytes}
			)

			setFiles(accepted)
			setFileRejections(rejected)
		},
		[acceptedMimeTypes, files, fileRejections, maxFiles, maxSizeInBytes]
	)

	const fileCountOverLimit = files.length + fileRejections.length - maxFiles
	const fileCountError = `You can upload up to 5 files. Please remove ${fileCountOverLimit} ${
		fileCountOverLimit === 1 ? 'file' : 'files'
	}.`

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
							<SubmittedPage restaurant={restaurant} setRestaurant={setRestaurant} email={email}
										   setEmail={setEmail} name={name} setName={setName}/>}

						{pageNumber === 2 && <>
							<Pane maxWidth={500} minWidth={200}>
								<FileUploader
									acceptedMimeTypes={acceptedMimeTypes}
									label="Upload Your Content"
									description="Upload .pdf, .zip, .png, .jpeg files"
									disabled={files.length + fileRejections.length >= maxFiles}
									maxSizeInBytes={maxSizeInBytes}
									maxFiles={maxFiles}
									onAccepted={setFiles}
									onRejected={setFileRejections}
									renderFile={(file, index) => {
										const {name, size, type} = file
										const renderFileCountError = index === 0 && fileCountOverLimit > 0

										// We're displaying an <Alert /> component to aggregate files rejected for being over the maxFiles limit,
										// so don't show those errors individually on each <FileCard />
										const fileRejection = fileRejections.find(
											(fileRejection) => fileRejection.file === file && fileRejection.reason !== FileRejectionReason.OverFileLimit
										)
										const {message} = fileRejection || {}

										return (
											<React.Fragment key={`${file.name}-${index}`}>
												{renderFileCountError &&
													<Alert intent="danger" marginBottom={majorScale(2)}
														   title={fileCountError}/>}
												<FileCard
													isInvalid={fileRejection != null}
													name={name}
													onRemove={() => handleRemove(file)}
													sizeInBytes={size}
													type={type}
													validationMessage={message}
												/>
											</React.Fragment>
										)
									}}
									values={values}
								/>
							</Pane>
							<Pane maxWidth={500}>
								<Label htmlFor="textarea-2" marginBottom={4} display="block">
									Or add text
								</Label>
								<Textarea id="textarea-2" height={100} placeholder="Type something here"/>
							</Pane>
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

								<button className={"fancyButton"} disabled={(name === null || email === null || restaurant === null)} onClick={async () => {
									setPageNumber(a => {
										if (a >= 3) return 3;
										if(name === null || email === null || restaurant === null) return a;
										return a + 1;
									});
									if (pageNumber > 1) {
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
										}).then(i => {
											console.log(i)
											return i.json()
										}).then(dat => {
											console.log(dat)
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
