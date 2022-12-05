import React from "react";
import {useMediaQuery} from "react-responsive";
import ManagerBar from "../../components/ManagerBar";
import {DownloadIcon, Icon} from "evergreen-ui";

type IFile = {
	name: string;
	path: string;
}

const files: IFile[] = [
	{
		name: "IncidentReport.pdf",
		path: '/files/IncidentReport.pdf'
	},
	{
		name: "ActOfViolenceReport.pdf",
		path: '/files/ActOfViolenceReport.pdf'
	},
	{
		name: "EmployeeLog.pdf",
		path: '/files/EmployeeLog.pdf'
	},
	{
		name: "AlcoholWarningEnglish.pdf",
		path: '/files/AlcoholWarningEnglish.pdf'
	},
	{
		name: "AlcoholWarningSpanish.pdf",
		path: '/files/AlcoholWarningSpanish.pdf'
	},
	{
		name: "IncidentReport.pdf",
		path: '/files/IncidentReport.pdf'
	},
	{
		name: "IDLog.pdf",
		path: '/files/IDLog.pdf'
	},
	{
		name: "InspectionReport.pdf",
		path: '/files/InspectionReport.pdf'
	},
	{
		name: "SecurityAffidavit.pdf",
		path: '/files/SecurityAffidavit.pdf'
	},
	{
		name: "SecurityAttestationForm.pdf",
		path: '/files/SecurityAttestationForm.pdf'
	}
];


export default function Forms() {
	const isSmaller = useMediaQuery({query: '(max-width: 1200px)'})

	return (
		<>
			<ManagerBar/>
			<div className="App">

				<div className={'coloredHeading'}>
					<h1>Forms</h1>
				</div>

				<div className="content">
					<div className={'tileArea'}>

						{files.map((a, i) => {

							return (
								<div style={{
									backgroundColor: '#F3F4F7',
									borderRadius: 12,
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									padding: '16px 24px',
									width: 400,
									height: 80,
								}}>
									<p style={{
										color: 'black',
										fontSize: 18,
									}}>{a.name}</p>
									<button className={'downloadButton'} onClick={() => {
										fetch(a.path).then(response => {
											response.blob().then(blob => {
												const fileURL = window.URL.createObjectURL(blob);
												let alink = document.createElement('a');
												alink.href = fileURL;
												alink.download = a.name;
												alink.click();
											})
										})
									}}>
										<Icon icon={DownloadIcon} color={'white'} size={24}/>
									</button>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</>
	);
}
