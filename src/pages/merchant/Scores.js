import React, {useContext, useEffect, useState} from "react";
import {ArrowDownIcon, ArrowUpIcon, Button, SearchInput, Spinner, Table} from "evergreen-ui";
import vector1 from '../../assets/vector1.png'
import vector2 from '../../assets/vector2.png'
import vector3 from '../../assets/vector3.png'
import '../../assets/css/Scores.scss'
import ResultsTable from "../../components/ResultsTable";
import API from "../../api";
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {Form} from "react-bootstrap";

export default function Scores() {
	const {user} = useContext(AuthenticatedUserContext);
	const [scores, setScores] = useState([]);
	const [sortConfig, setSortConfig] = useState({key: "user_id", direction: "asc"});

	const [isLoading, setLoading] = useState(false);
	const [searchKey, setSearchKey] = useState('');

	const getUserProfile = async (userId) => {
		const res = await fetch(`${API}/getUserProfileInfo/` + userId, {
			method: 'GET',
		})
		const data = await res.json()
		console.log('get user', data, data?.restaurantId);
		await getAllEmployeeScoresForRestaurant(data?.restaurantId)
	}

	const getAllEmployeeScoresForRestaurant = async (restaurantId) => {
		const res = await fetch(`${API}/getAllEmployeeScoresForRestaurant/${restaurantId}`, {
			method: 'GET',
		})
		const data = await res.json()

		console.log('get scores', data?.scores);
		setScores(data?.scores)
	}

	useEffect(() => {
		if (user?.uid) {
			const a = async () => {
				setLoading(true)
				await getUserProfile(user?.uid)
				setLoading(false)
			}
			a()
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
						<div className={'searchArea'}>
							<h2 className="subtitle">Quiz Results:</h2>
							<SearchInput placeholder="Search quiz or employee" value={searchKey}
										 onChange={(e) => {
											 // console.log(e)
											 setSearchKey(e.target?.value ?? '')
										 }}
							/>
						</div>

						{isLoading ? <div className={'centerContent'}><h2>Loading Scores</h2>
								<Spinner/></div> :

							(scores.length !== 0 ?
							<Table minHeight={'100%'} marginBottom={50} className="table">
								<Table.Head className="tableHeader">
									<Table.TextHeaderCell className={'headerCell'}>
										<Button
											iconAfter={sortConfig?.key === 'user_id' ? sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon : null}
											onClick={() => requestSorting('user_id')}>Employee</Button>
									</Table.TextHeaderCell>
									<Table.TextHeaderCell className={'headerCell'}>
										<Button
											iconAfter={sortConfig?.key === 'topic_name' ? sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon : null}
											onClick={() => requestSorting('topic_name')}>Quiz</Button></Table.TextHeaderCell>
									<Table.TextHeaderCell className={'headerCell'}><Button
										iconAfter={sortConfig?.key === 'score_percentage' ? sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon : null}
										onClick={() => requestSorting('score_percentage')}
										margin={0}>Score</Button></Table.TextHeaderCell>
								</Table.Head>
								{!isLoading &&
									<ResultsTable scores={scores} config={sortConfig} searchKey={searchKey}/>}
							</Table> : <h2>There are currently no scores available.</h2>)
						}

						<img className="vector1" src={vector1} alt="design"/>
						<img className="vector2" src={vector2} alt="design"/>
						<img className="vector3" src={vector3} alt="design"/>
					</div>
				</div>
			</div>
		</>

	);
}
