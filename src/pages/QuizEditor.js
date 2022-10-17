import React, {useContext, useState} from "react";
import vector1 from '../assets/vector1.png'
import vector2 from '../assets/vector2.png'
import vector3 from '../assets/vector3.png'
import '../App.scss'
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import '../../src/assets/css/quiz_editor.scss'
import EditableList from "../components/quiz/EditableList";
import QuizFieldEditor from "../components/quiz/QuizFieldEditor";
import ManagerBar from "../components/ManagerBar";

export default function QuizEditor() {
	const {user} = useContext(AuthenticatedUserContext);
	const [selectedID, setSelectedID] = useState(0)
	const [list, setList] = useState([]);
	const [quizName, setQuizName] = useState('');

	return (
		<>
			<ManagerBar/>
			<div className="quizEditor">
				<EditableList
					setSelectedID={setSelectedID}
					selectedID={selectedID}
					list={list}
					setList={setList}
					quizName={quizName}
					setQuizName={setQuizName}
				/>

				<div className="viewArea">
					<QuizFieldEditor
						setSelectedID={setSelectedID}
						selectedID={selectedID}
						list={list}
						setList={setList}/>
				</div>

				<img className="vector1" src={vector1} alt="design"/>
				<img className="vector2" src={vector2} alt="design"/>
				<img className="vector3" src={vector3} alt="design"/>
			</div>
		</>

	);
}
