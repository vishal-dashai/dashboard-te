import {useEffect, useState} from "react";
import firebase from "firebase/compat/app";
import wine from './assets/wine.png'
import logo from './assets/logo.png'
import vector1 from './assets/vector1.png'
import vector2 from './assets/vector2.png'
import vector3 from './assets/vector3.png'
import MDEditor, {commands} from '@uiw/react-md-editor';
import './App.css'
import {
	ArrowDownIcon,
	ArrowTopRightIcon,
	ArrowUpIcon,
	Button,
	ChevronRightIcon,
	LogOutIcon,
	Table,
	TextInputField
} from "evergreen-ui";
import API from "./api";
import ResultsTable from "./Components/ResultsTable";

export default function App() {
	// 1. Create a state to store the user.
	// When the user's undefined, then the auth isn't initialized.
	// When it's null, then the user is not logged in.
	const [user, setUser] = useState();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [restaurantId, setrestaurantId] = useState('');
	const [scores, setScores] = useState([]);
	const [restaurantName, setrestaurantName] = useState('');
	const [sortConfig, setSortConfig] = useState(null);
	const [theContent, setContent] = useState("**Hello world!!!**");

	useEffect(() => {
		// 2. Add auth state change listener.
		firebase.auth().onAuthStateChanged(userData => {
			if (userData) {
				// 3. Save the user data to the state if it's logged in.
				setUser(userData);
				getUserProfile(userData?.uid)
			} else {
				// 4. Set the user to null to indicate that it's not logged in.
				setUser(null);
			}
		});
	}, []);

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

	if (user === undefined) {
		// 5. Display loading.
		return <div className="App">Loading...</div>;
	} else if (user === null) {
		// 6. Display the sign in button.
		return (
			<div className="App">
				<div className="loginWrapper">
					<div className="left">
						<img className="disaplyImg" src={wine} alt="wine"/>
						<img className="logoImg" src={logo} alt="logo"/>
					</div>
					<div className="right">
						<h1 className="title">Login</h1>
						<h2 className="subtitle">Training & Education</h2>
						<TextInputField inputHeight={50} inputWidth={376} label="Email Address" type="email"
										value={email} onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter your email"/>
						<TextInputField inputHeight={50} inputWidth={376} label="Password" type="password"
										value={password} onChange={(e) => setPassword(e.target.value)}
										placeholder="Enter your password"/>
						<Button size="large" appearance="primary" intent="success" iconAfter={ChevronRightIcon}
								onClick={() => {
									// TODO: Add the sign in handler.
									// 1. Create the Google auth provider
									const provider = new firebase.auth.EmailAuthProvider();
									// 2. Sign in
									firebase.auth().signInWithEmailAndPassword(email, password);
								}}
						>
							Login
						</Button>
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="App">
				<div className="dashboard">
					<div className="navbar">
						<img className="logoImg" src={logo} alt="logo"/>
						<h3 className="navTitle">
							Send your weekly content updates here!
						</h3>

						<Button marginRight={12} height={48} iconAfter={ArrowTopRightIcon}
								onClick={(e) => window.location.href = "https://km2tvqrwri0.typeform.com/to/HeCBxjpi"}>
							Go to Weekly Updates
						</Button>
					</div>

					<div className="content">
						<h1 className="title">Welcome back {restaurantName}
							{" "} <Button className="logoutBtn" size="large" appearance="primary" intent="danger"
										  iconAfter={LogOutIcon}
										  onClick={() => {
											  // Sign out the user
											  firebase.auth().signOut();
										  }}
							>
								Sign out
							</Button>
						</h1>

						<div className="container">
							<MDEditor
								value={theContent}
								onChange={setContent}
								preview="edit"
								commands={[
									// commands.codeEdit, commands.codePreview
								]}
								extraCommands={[]}
							/>

							<div className='center'>
								<Button onClick={() => {
								}}>Update Message</Button>
							</div>
						</div>

						<h2 className="subtitle">Test results:</h2>

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
										onClick={() => requestSorting('topic_name')}>Test</Button></Table.TextHeaderCell>
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
		);
	}
}
