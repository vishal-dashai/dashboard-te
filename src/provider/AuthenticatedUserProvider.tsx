import React, {createContext, useState} from 'react';
import {IUser} from "@thedashboardai/train-edu-front-end-api-wrapper";
import firebase from "firebase/compat";

export const AuthenticatedUserContext = createContext<AuthContextType | null>(null);

type Props = {
	children: React.ReactNode;
};

export type AuthContextType = {
	user: firebase.User | null;
	restaurantId: string | null;
	profile: IUser | null;
	setUser: React.Dispatch<React.SetStateAction<firebase.User | null>>;
	setRestaurantId: React.Dispatch<React.SetStateAction<string | null>>;
	setProfile: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const AuthenticatedUserProvider = ({children}: Props) => {
	const [user, setUser] = useState<firebase.User | null>(null);
	const [restaurantId, setRestaurantId] = useState<string | null>(null);
	const [profile, setProfile] = useState<IUser | null>(null);

	return (
		<AuthenticatedUserContext.Provider
			value={{user, setUser, restaurantId, setRestaurantId, profile, setProfile}}>
			{children}
		</AuthenticatedUserContext.Provider>
	);
};
