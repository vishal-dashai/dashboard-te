import React from "react";
import './editable_list.scss';

type EditableListProps = {
	message: string;
};


const EditList = ({message}: EditableListProps) => {

	return (
		<div>{message}</div>


	)
};
