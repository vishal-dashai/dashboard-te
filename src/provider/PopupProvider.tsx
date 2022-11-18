import React, {createContext, useState} from 'react';
import {IPopup} from "../components/Popup";

export const PopupContext = createContext<PopupContextProps | null>(null);

export type PopupContextProps = {
	popups: IPopup[];
	setPopups: React.Dispatch<React.SetStateAction<IPopup[]>>;
}

export const PopupProvider = ({children}: { children: React.ReactNode; }) => {
	const [popups, setPopups] = useState<IPopup[]>([]);

	return (
		<PopupContext.Provider value={{popups, setPopups}}>
			{children}
		</PopupContext.Provider>
	);
};
