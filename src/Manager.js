import {AuthenticatedUserContext} from "./provider/AuthenticatedUserProvider";
import {Navigate, Outlet} from "react-router";
import React, {useContext, useEffect, useState} from "react";
import Login from "./pages/Login";
import firebase from "firebase/compat/app";
import NavigationBar from "./components/NavigationBar";
import {useLocation} from 'react-router-dom'

export default function Manager() {
	const {user, setUser} = useContext(AuthenticatedUserContext);
	/*const location = useLocation();
	const [isBar, setIsBar] = useState(false);
*/
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
		console.log("BBBBBBBBBBB")
		console.log(user)
		if (user === null) {
			// <Navigate to='/login' replace state={{from: location}}/>
		}

	}, [user])

/*	useEffect(() => {
		console.log(location)
		switch (location.pathname) {
			default:
				setIsBar(false);
				break;
			case '/landing':
				setIsBar(true)
				break;
		}

	}, [location])*/

	return (
		<div>
			{/*{isBar && <NavigationBar/>}*/}
			<Outlet/>
		</div>
	)
}
