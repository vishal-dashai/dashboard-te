import React, {createContext, useState} from 'react';

export const AuthenticatedUserContext = createContext({user: null, profile: null});

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
