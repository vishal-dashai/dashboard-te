import {AuthenticatedUserContext} from "./provider/AuthenticatedUserProvider";
import {Outlet} from "react-router";
import React, {useContext, useEffect} from "react";
import firebase from "firebase/compat/app";
import API from "./api";
import User from "./api/User";

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
