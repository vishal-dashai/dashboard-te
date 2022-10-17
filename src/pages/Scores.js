import React, {useContext, useEffect, useState} from "react";
import {ArrowDownIcon, ArrowUpIcon, Button, LogOutIcon, Table} from "evergreen-ui";
import firebase from "firebase/compat/app";
import vector1 from '../assets/vector1.png'
import vector2 from '../assets/vector2.png'
import vector3 from '../assets/vector3.png'
import MDEditor from '@uiw/react-md-editor';
import '../App.scss'
import ResultsTable from "../components/ResultsTable";
import API from "../api";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import ManagerBar from "../components/ManagerBar";
import {Form} from "react-bootstrap";

export default function Scores() {
	const {user} = useContext(AuthenticatedUserContext);
	const [restaurantId, setrestaurantId] = useState('');
	const [scores, setScores] = useState([]);
	const [restaurantName, setrestaurantName] = useState('');
	const [sortConfig, setSortConfig] = useState(null);
	const [theContent, setContent] = useState("**Hello world!!!**");

	const getUserProfile = async (userId) => {
		const res = await fetch(`${API}/api/v1/getUserProfileInfo/` + userId, {
			method: 'GET',
		})
		const data = await res.json()
		console.log('get user', data, data?.restaurantId);
		setrestaurantId(data?.restaurantId)
		getAllEmployeeScoresForRestaurant(data?.restaurantId)
	}

	const getAllEmployeeScoresForRestaurant = async (restaurantId) => {
		const res = await fetch(`${API}/api/v1/getAllEmployeeScoresForRestaurant/${restaurantId}`, {
			method: 'GET',
		})
		const data = await res.json()

		console.log('get scores', data?.scores);
		setScores(data?.scores)
		// setScores(ar)
		setrestaurantName(data?.restaurant_name)
	}

	useEffect(() => {
		if (user?.uid) {
			getUserProfile(user?.uid)
		}
	}, [user])

	function requestSorting(key) {
		let direction = 'asc';
		if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'des';
		}
		setSortConfig({key, direction});
	}

	return (
		<>
			<ManagerBar/>

			<div className="App">
				<div className="dashboard">
					<div className="content">
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							flex: 1,
							justifyContent: 'space-between',
							alignItems: 'space-between',
							width: '80%',
						}}>
							<h2 className="subtitle" style={{marginTop: 15}}>Quiz Results:</h2>
						{/*	<Form className="d-flex">
								<Form.Control
									type="search"
									placeholder="Search"
									className="me-2"
									aria-label="Search"
								/>
								<Button variant="outline-success">Search</Button>
							</Form>*/}
						</div>

						<Table minHeight={400} marginBottom={50} className="table">
							<Table.Head className="tableHeader">
								<Table.TextHeaderCell>
									<Button
										iconAfter={sortConfig?.key === 'user_id' ? sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon : null}
										onClick={() => requestSorting('user_id')}>Employee</Button>
								</Table.TextHeaderCell>
								<Table.TextHeaderCell>
									<Button
										iconAfter={sortConfig?.key === 'topic_name' ? sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon : null}
										onClick={() => requestSorting('topic_name')}>Quiz</Button></Table.TextHeaderCell>
								<Table.TextHeaderCell><Button
									iconAfter={sortConfig?.key === 'score_percentage' ? sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon : null}
									onClick={() => requestSorting('score_percentage')}>Score</Button></Table.TextHeaderCell>
							</Table.Head>
							<ResultsTable scores={scores} config={sortConfig}/>
						</Table>

						<img className="vector1" src={vector1} alt="design"/>
						<img className="vector2" src={vector2} alt="design"/>
						<img className="vector3" src={vector3} alt="design"/>
					</div>
				</div>
			</div>
		</>

	);
}
