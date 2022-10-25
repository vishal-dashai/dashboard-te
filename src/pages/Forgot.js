import wine from '../assets/wine.png'
import logo from '../assets/logo.png'
import {Button, ChevronRightIcon, TextInputField} from "evergreen-ui";
import React, {useContext, useState} from "react";
import {
	browserSessionPersistence,
	getAuth,
	setPersistence,
	signInWithEmailAndPassword,
	sendPasswordResetEmail
} from "firebase/auth";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import {Navigate} from "react-router";

export default function Forgot() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [isWrong, setWrong] = useState(false);
	const [isSent, setSent] = useState(false);

	const {user} = useContext(AuthenticatedUserContext);

	if (user || localStorage.getItem("signedIn")) {
		return <Navigate to='/home'/>
	}

	async function forget() {
		const auth = getAuth();

		await sendPasswordResetEmail(auth, email)
			.then(function () {
				// navigation.navigate("Login");
				setSent(true)

				// alert("Your password reset has been sent to your email");
			})
			.catch(function (error) {
				// setLoading(false);
				setWrong(true)
			});
	}

	return (<div className="App">
		<div className="loginWrapper">
			<div className="left">
				<img className="disaplyImg" src={wine} alt="wine"/>
				<img className="logoImg" src={logo} alt="logo"/>
			</div>
			<div className="right">
				<h1 className="title">Reset Password</h1>
				<h2 className="subtitle">Training & Education</h2>

				{!isSent ?
					<>
						{
							isWrong ? <><h3 className={'subError'}>No account with that email was found!</h3></> : null
						}

						<TextInputField inputHeight={50} inputWidth={'276'} label="Email Address" type="email"
										value={email} onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"/>

						<Button size="large" appearance="primary" intent="success" iconAfter={ChevronRightIcon}
								onClick={() => {
									forget()
								}}
						>
							Reset Password
						</Button></>
					:
					<><p>A password reset email has been sent to the listed email address.</p>    <Button size="large"
																										  appearance="primary"
																										  intent="success"
																										  iconAfter={ChevronRightIcon}
																										  onClick={() => {
																											  window.open('login', '_self')
																										  }}
					>
						Back to Login
					</Button></>}

			</div>
		</div>
	</div>)
};
