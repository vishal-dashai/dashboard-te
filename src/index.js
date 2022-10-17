import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import App from "./App";
import {createBrowserRouter} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Scores from "./pages/Scores";
import {RouterProvider} from "react-router";
import FIREBASE_CONFIG from "./firebaseconfig";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import QuizEditor from "./pages/QuizEditor";
import RequireElevated from "./components/RequireElevated";
import Onboard from "./pages/Onboard";
import Landing from "./pages/Landing";
import Updates from "./pages/Updates";

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
				// element: (<RequireAuth children={<Home/>}><Home/></RequireAuth>)
				element: (<RequireAuth><Scores/></RequireAuth>)
			},
		/*	{
				path: "landing",
				// element: (<RequireAuth children={<Home/>}><Home/></RequireAuth>)
				element: (<Landing/>)
			},*/
			{
				path: "scores",
				element: (<RequireAuth><Scores/></RequireAuth>)
			},
		/*	{
				path: "quizeditor",
				element: (<RequireElevated><QuizEditor/></RequireElevated>)
			},
			{
				path: "updates",
				element: (<RequireElevated><Updates/></RequireElevated>)
			},*/
			{
				path: "onboard",
				element: (<Onboard/>)
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
)
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
