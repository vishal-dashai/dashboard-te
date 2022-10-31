import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import App from "./App";
import {createBrowserRouter} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Scores from "./pages/merchant/Scores";
import {RouterProvider} from "react-router";
import FIREBASE_CONFIG from "./firebaseconfig";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import QuizEditor from "./pages/QuizEditor";
import RequireElevated from "./components/RequireElevated";
import Onboard from "./pages/Onboard";
import Updates from "./pages/Updates";
import Forgot from "./pages/Forgot";
import QuizViewer from "./pages/merchant/quiz/QuizViewer";
import './App.scss';
import Upload from "./pages/merchant/Upload";
import QuizEdit from "./pages/QuizEdit";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App/>,
		errorElement: <NotFound/>,
		children: [
			{index: true, element: <RequireAuth children={<Scores/>}><Scores/></RequireAuth>},
			{
				path: "login",
				element: <Login/>
			},
			{
				path: "home",
				element: (<RequireAuth><Scores/></RequireAuth>)
			},
			/*			{
							path: "landing",
							element: (<Landing/>)
						},*/
			{
				path: "merchant/scores",
				element: (<RequireAuth><Scores/></RequireAuth>)
			},
			{
				path: "merchant/quizeditor",
				element: (<RequireElevated><QuizEditor/></RequireElevated>)
			},
			{
				path: "merchant/quizviewer",
				element: (<RequireElevated><QuizViewer/></RequireElevated>)
			},
			{
				path: "merchant/updates",
				element: (<RequireElevated><Updates/></RequireElevated>)
			},
			{
				path: "merchant/upload",
				element: (<RequireElevated><Upload/></RequireElevated>)
			},
			{
				path: "onboard",
				element: (<Onboard/>)
			},
			{
				path: "forgot",
				element: (<Forgot/>)
			}
		]
	},
]);

const app = firebase.initializeApp(FIREBASE_CONFIG);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
