import {useLocation, useNavigate} from "react-router";
import React, {useContext, useEffect} from "react";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import {getAuth} from "firebase/auth";

export default function RequireAuth({children}) {
	const {user} = useContext(AuthenticatedUserContext);
	let location = useLocation();

/*
	if (!user) {
		if(!localStorage.getItem("signedIn"))
			return <Navigate to='/login' replace state={{from: location}}/>
	}
*/


	const nav = useNavigate();

	useEffect(() => {
		getAuth().onAuthStateChanged(function(user) {
			if (!user) {
				console.error(
					'Access to protected route denied, redirecting to login...'
				);
				nav('/login');
			}
		});
	}, [nav]);

	return children;
}
