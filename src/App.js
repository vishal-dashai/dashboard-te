import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthenticatedUserProvider} from "./provider/AuthenticatedUserProvider";
import Manager from "./Manager";
import {PopupProvider} from "./provider/PopupProvider";

export default function App() {

	return (
		<AuthenticatedUserProvider>
			<PopupProvider>
				<Manager/>
			</PopupProvider>
		</AuthenticatedUserProvider>
	)
}
