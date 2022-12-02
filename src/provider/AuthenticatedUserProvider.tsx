import React, {createContext, useState} from 'react';
import {IUser} from "@thedashboardai/train-edu-front-end-api-wrapper";

export const AuthenticatedUserContext = createContext<AuthContextType | null>(null);

type Props = {
	children: React.ReactNode;
};

export type AuthContextType = {
	user: any | null;
	restaurantId: string | null;
	profile: IUser | null;
	setUser: React.Dispatch<React.SetStateAction<null>>;
	setRestaurantId: React.Dispatch<React.SetStateAction<string | null>>;
	setProfile: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const AuthenticatedUserProvider = ({children}: Props) => {
	const [user, setUser] = useState(null);
	const [restaurantId, setRestaurantId] = useState<string | null>(null);
	const [profile, setProfile] = useState<IUser | null>(null);

	return (
		<AuthenticatedUserContext.Provider
			value={{user, setUser, restaurantId, setRestaurantId, profile, setProfile}}>
			{children}
		</AuthenticatedUserContext.Provider>
	);
};
