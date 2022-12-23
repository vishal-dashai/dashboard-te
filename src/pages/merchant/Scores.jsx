import React, {useContext, useEffect, useState, Suspense} from "react";
import {ArrowDownIcon, ArrowUpIcon, Button, SearchInput, Spinner, Table} from "evergreen-ui";
import vector1 from '../../assets/vector1.png'
import vector2 from '../../assets/vector2.png'
import vector3 from '../../assets/vector3.png'
import '../../assets/css/Scores.scss'
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {ContentRequest} from "@thedashboardai/train-edu-front-end-api-wrapper";
const ResultsTable = React.lazy(() => import('../../components/ResultsTable'));

export default function Scores() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [scores, setScores] = useState([]);
	const [sortConfig, setSortConfig] = useState({key: "user_id", direction: "asc"});

	const [isLoading, setLoading] = useState(true);
	const [searchKey, setSearchKey] = useState('');

	useEffect(() => {
		if (user != null && profile != null) {
			const a = async () => {
				setLoading(true)
				let token = await user.getIdToken()
				console.log(token)
				let sc = await ContentRequest.getAllScores(token, profile.restaurantId)
				//console.log(sc)
				//console.log('AAAAAAAAAAAAAAAAAAAAAA')
				setScores(sc)
				setLoading(false)
			}
			a()
		}
	}, [user, profile])

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
							<label title={'search for quiz or employee'}>
								<SearchInput placeholder="Search quiz or employee" value={searchKey}
											 onChange={(e) => {
												 setSearchKey(e.target?.value ?? '')
											 }}
								/>
							</label>
						</div>

						{isLoading ? <div className={'centerContent'}><h2>Loading Scores</h2>
								<Spinner/></div> :
							<ScoresTable scores={scores} sortConfig={sortConfig} requestSorting={requestSorting}
										 isLoading={isLoading} searchKey={searchKey}/>
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

export const ScoresTable = ({scores, sortConfig, requestSorting, isLoading, searchKey}) => {
	return (scores !== null && scores.length !== 0 ?
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
			<Suspense fallback={<h2>Loading...</h2>}>
				<ResultsTable scores={scores} config={sortConfig} searchKey={searchKey}/>
			</Suspense>
{/*			{!isLoading &&
				<ResultsTable scores={scores} config={sortConfig} searchKey={searchKey}/>}*/}
		</Table> : <h2>There are currently no scores available.</h2>)
}
