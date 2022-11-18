import {AuthenticatedUserContext} from "./provider/AuthenticatedUserProvider";
import {Outlet} from "react-router";
import React, {useContext, useEffect} from "react";
import firebase from "firebase/compat/app";
import {Modal} from "react-bootstrap";
import {CrossIcon, Icon, Spinner, TickIcon} from "evergreen-ui";
import {useLocation} from "react-router-dom";
import {ContentRequest} from "@thedashboardai/train-edu-front-end-api-wrapper";
import {Popup} from "./components/Popup";
import {PopupContext} from "./provider/PopupProvider";

export default function Manager() {
	const {user, setUser, setProfile} = useContext(AuthenticatedUserContext);
	const location = useLocation();
	const {popups} = useContext(PopupContext);

	useEffect(() => {
		const unsubscribeAuth = firebase.auth().onAuthStateChanged(async authenticatedUser => {
			try {
				console.log("user has been updated")
				await (authenticatedUser ? setUser(authenticatedUser) : setUser(null));
				if (authenticatedUser) {
					localStorage.setItem("signedIn", "true")
				} else {
					localStorage.removeItem("signedIn")

					/*
										if (location.pathname !== '/login') {
											window.location.href = "/login"
										}
										console.log(window.location.href)*/

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
			console.log(user)
			if (user !== null) {
				setProfile(await ContentRequest.getUserProfile(user.uid))
			}
		}

		fetchData()
	}, [user])

	/*
		if(!user && localStorage.getItem("signedIn")){
			localStorage.removeItem("signedIn")
		}
	*/

	return (
		<>
			{/*{!user && localStorage.getItem("signedIn") ? <Login/> :*/}
			<Outlet/>
			{popups.map((data, idx) => <Popup popupData={data} key={idx}/>)}
		</>
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
