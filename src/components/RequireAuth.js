import {Navigate, useLocation} from "react-router";
import React, {useContext} from "react";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";

export default function RequireAuth({children}) {
	const {user} = useContext(AuthenticatedUserContext);
	let location = useLocation();

	if (!user) {
		if(!localStorage.getItem("signedIn"))
			return <Navigate to='/login' replace state={{from: location}}/>
	}

	return children;
}
