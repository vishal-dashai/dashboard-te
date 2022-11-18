import {useNavigate} from "react-router";
import React, {useEffect} from "react";
import {getAuth} from "firebase/auth";

export default function RequireAuth({children}) {
/*	const {user} = useContext(AuthenticatedUserContext);
	let location = useLocation();*/

	const nav = useNavigate();

	useEffect(() => {
		getAuth().onAuthStateChanged(function(user) {
			if (!user) {
				console.error(
					'Redirecting. User not logged in.'
				);
				nav('/login');
			}
		});
	}, [nav]);

	return children;
}
