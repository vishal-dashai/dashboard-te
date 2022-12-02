import React, {useState} from "react";

export default function Bubble({text, scale=25}) {

	return (
		<div style={{
			height: scale,
			width: scale,
			minHeight: scale,
			minWidth: scale,
			backgroundColor: '#F3F4F7',
			borderRadius: 50,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}>
			<p style={{
				fontFamily: 'Raleway',
				fontWeight: 700,
				lineHeight: 20,
				marginTop: 7,
				fontSize: 12 * (scale * 0.04)
			}}>{text}</p>
		</div>
	)
}
