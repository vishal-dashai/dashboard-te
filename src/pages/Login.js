import wine from '../assets/wine.png'
import logo from '../assets/logo.png'
import {Button, ChevronRightIcon, TextInputField} from "evergreen-ui";
import React, {useContext, useState} from "react";
import {browserSessionPersistence, getAuth, setPersistence, signInWithEmailAndPassword} from "firebase/auth";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import {Navigate} from "react-router";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [isWrong, setWrong] = useState(false);

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

				{isWrong ? <>
					<h3 className={'subError'}>Username or password is wrong!</h3>
					<a href={'forgot'}>Forgot Password?</a>
					<br/>
					<br/>
				</> : null}

				<TextInputField inputHeight={50} inputWidth={'276'} label="Email Address" type="email"
								value={email} onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"/>
				<TextInputField inputHeight={50} inputWidth={'276'} label="Password" type="password"
								value={password} onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"/>
				<Button size="large" appearance="primary" intent="success" iconAfter={ChevronRightIcon}
						onClick={() => {
							const auth = getAuth();

							setPersistence(auth, browserSessionPersistence).then(() => {
								return signInWithEmailAndPassword(auth, email, password).catch((error) => {
									setWrong(true)
								});
							}).catch((error) => {
								const errorCode = error.code;
								const errorMessage = error.message;

							});
						}}
				>
					Login
				</Button>
			</div>
		</div>
	</div>);
}
