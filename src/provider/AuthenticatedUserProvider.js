import React, {useState, createContext} from 'react';
import User from "../api/User";
import API from "../api";

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({children}) => {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);

	return (
		<AuthenticatedUserContext.Provider
			value={{user, setUser, profile, setProfile}}>
			{children}
		</AuthenticatedUserContext.Provider>
	);
};

export const getOrUpdateProfile = async (user, setProfile) => {
	if (user !== null) {
		await fetch(`${API}/getUserProfileInfo/` + user.uid, {
			method: 'GET',
		}).then(e => e.json()).then(data => {
			const theUser = new User(data);
			setProfile(theUser);
			return theUser;
		}).catch((e) => {
			console.log(e)
		})
	}
}
