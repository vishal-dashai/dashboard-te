import wine from '../assets/wine.png'
import logo from '../assets/logo.png'
import {Button, ChevronRightIcon, TextInputField} from "evergreen-ui";
import React, {useContext, useState} from "react";
import firebase from "firebase/compat/app";
import {getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence} from "firebase/auth";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import {Navigate, useLocation} from "react-router";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const {user} = useContext(AuthenticatedUserContext);

	if (user || localStorage.getItem("signedIn")) {
		return <Navigate to='/home'/>
	}

	return (<div className="App">
		<div className="loginWrapper">
			<div className="left">
				<img className="disaplyImg" src={wine} alt="wine"/>
				<img className="logoImg" src={logo} alt="logo"/>
			</div>
			<div className="right">
				<h1 className="title">Login</h1>
				<h2 className="subtitle">Training & Education</h2>
				<TextInputField inputHeight={50} inputWidth={376} label="Email Address" type="email"
								value={email} onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"/>
				<TextInputField inputHeight={50} inputWidth={376} label="Password" type="password"
								value={password} onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"/>
				<Button size="large" appearance="primary" intent="success" iconAfter={ChevronRightIcon}
						onClick={() => {
							// TODO: Add the sign in handler.
							// 1. Create the Google auth provider
							// const provider = new firebase.auth.EmailAuthProvider();
							// 2. Sign in

							const auth = getAuth();

							setPersistence(auth, browserSessionPersistence).then(() => {
								// Existing and future Auth states are now persisted in the current
								// session only. Closing the window would clear any existing state even
								// if a user forgets to sign out.
								// ...
								// New sign-in will be persisted with session persistence.
								return signInWithEmailAndPassword(auth, email, password);
							})
								.catch((error) => {
									// Handle Errors here.
									const errorCode = error.code;
									const errorMessage = error.message;
								});


							// firebase.auth().signInWithEmailAndPassword( email, password);


						}}
				>
					Login
				</Button>
			</div>
		</div>
	</div>);
}
