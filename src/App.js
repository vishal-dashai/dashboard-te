import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthenticatedUserProvider} from "./provider/AuthenticatedUserProvider";
import Manager from "./Manager";

export default function App() {
	return (
		<AuthenticatedUserProvider>
			<Manager/>
		</AuthenticatedUserProvider>
	)
}
