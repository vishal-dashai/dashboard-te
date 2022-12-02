import React from "react";
import {Spinner} from "evergreen-ui";

type IncrementerProps = {
	message: string;
};

export default function LoadingIndc({message}: IncrementerProps) {
	return (<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
		<h4 style={{marginTop: 10, marginRight: 4}}>{message}</h4>
		<Spinner/>
	</div>);
}
