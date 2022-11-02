import {AuthenticatedUserContext} from "./provider/AuthenticatedUserProvider";
import {Outlet} from "react-router";
import React, {useContext, useEffect} from "react";
import firebase from "firebase/compat/app";
import API from "./api";
import User from "./api/User";
import {Modal} from "react-bootstrap";
import {CrossIcon, Icon, Spinner, TickIcon} from "evergreen-ui";

export default function Manager() {
	const {user, setUser, setProfile} = useContext(AuthenticatedUserContext);

	useEffect(() => {
		const unsubscribeAuth = firebase.auth().onAuthStateChanged(async authenticatedUser => {
			try {
				console.log("user has been updated")
				await (authenticatedUser ? setUser(authenticatedUser) : setUser(null));
				if (authenticatedUser) {
					localStorage.setItem("signedIn", "true")
				} else {
					localStorage.removeItem("signedIn")
				}

				// setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		});

		return unsubscribeAuth;
	}, []);

	useEffect(() => {
		async function fetchData() {
			console.log("BBBBBBBBBBB")
			console.log(user)
			if (user !== null) {
				await fetch(`${API}/getUserProfileInfo/` + user.uid, {
					method: 'GET',
				}).then(e => e.json()).then(data => {
					const theUser = new User(data);
					setProfile(theUser);
				}).catch((e) => {
					console.log(e)
				})
			}
		}

		fetchData()
	}, [user])

	return (
		<Outlet/>
	)
}

function UpdatePopup({show, onHide, publish, quizName, isUploading}) {
	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			contentClassName={'confirmationModal'}
			backdrop="static"
			keyboard={false}
		>
			{!isUploading ? <> <Modal.Header>
				<Modal.Title id="contained-modal-title-vcenter">
					Publish {quizName}?
				</Modal.Title>
			</Modal.Header>
				<Modal.Body>
					<p>Are you sure you want to publish this quiz? It will be visible to all employees.</p>
				</Modal.Body>
				<Modal.Footer>
					<button
						className="prevButton"
						onClick={() => {
							onHide()
						}}
					>
						No, cancel
						{<Icon icon={CrossIcon}/>}
					</button>

					<button
						className="nextButton"
						onClick={() => {
							// onHide()
							publish()
						}}
					>
						Yes, publish quiz
						{<Icon icon={TickIcon}/>}
					</button>
				</Modal.Footer></> : <div className={'centerContent'}><h2>Publishing changes</h2>
				<Spinner/></div>}
		</Modal>
	);
}
