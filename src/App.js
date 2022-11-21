import React, {useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthenticatedUserProvider} from "./provider/AuthenticatedUserProvider";
import Manager from "./Manager";
import {PopupProvider} from "./provider/PopupProvider";
import {ContentRequest} from "@thedashboardai/train-edu-front-end-api-wrapper";

export default function App() {

	useEffect(() => {
		let ap = '';

		if (process.env.REACT_APP_MODE === 'production') {
			ap = "https://training-and-education-prod.herokuapp.com"
		} else {
			ap = "https://train-edu-testing.herokuapp.com"
		}

		ap += '/api/v1'
		ContentRequest.API = ap;
	}, [])

	return (
		<AuthenticatedUserProvider>
			<PopupProvider>
				<Manager/>
			</PopupProvider>
		</AuthenticatedUserProvider>
	)
}
