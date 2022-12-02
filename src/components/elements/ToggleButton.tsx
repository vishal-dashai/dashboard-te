import React, {Dispatch, SetStateAction, useState} from "react";

type ToggleButtonProps = {
	active: boolean;
	children: React.ReactNode;
	onClick: Function;
};

export default function ToggleButton({onClick, children, active}: ToggleButtonProps) {

	return (
		<button onClick={() => {
			onClick();
		}}
				style={{
					color: active ? 'red' : 'orange'
				}}

		>
			{children}
		</button>);
}
