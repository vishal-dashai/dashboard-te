import React, {useContext} from "react";
import vector1 from '../assets/vector1.png'
import vector2 from '../assets/vector2.png'
import vector3 from '../assets/vector3.png'
import '../App.scss'
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import ManagerBar from "../components/ManagerBar";

export default function Updates() {
	const {user} = useContext(AuthenticatedUserContext);

	return (
		<>
			<ManagerBar/>

			<div className="App">
				<div className="dashboard">
					<div className="content">


						<img className="vector1" src={vector1} alt="design"/>
						<img className="vector2" src={vector2} alt="design"/>
						<img className="vector3" src={vector3} alt="design"/>
					</div>
				</div>
			</div>
		</>

	);
}
