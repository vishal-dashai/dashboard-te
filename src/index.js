import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import App from "./App";
import {RouterProvider} from "react-router";
import FIREBASE_CONFIG from "./firebaseconfig";
import './App.scss';
import {createBrowserRouter} from "react-router-dom";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";
import Scores from "./pages/merchant/Scores";
import Login from "./pages/Login";
import RequireElevated from "./components/RequireElevated";
import QuizEdit from "./pages/QuizEdit";
import QuizView from "./pages/merchant/quiz/QuizView";
import Updates from "./pages/Updates";
import Upload from "./pages/merchant/Upload";
import TopicViewer from "./pages/merchant/TopicViewer";
import ContentViewer from "./pages/merchant/ContentViewer";
import ContentEditor from "./pages/merchant/ContentEditor";
import Forms from "./pages/merchant/Forms";
import Onboard from "./pages/Onboard";
import Forgot from "./pages/Forgot";
import Landing from "./pages/Landing";

const app = firebase.initializeApp(FIREBASE_CONFIG);


export const router = createBrowserRouter([
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
			{
				path: "landing",
				element: (<RequireAuth><Landing/></RequireAuth>)
			},
			{
				path: "merchant/scores",
				element: (<RequireAuth><Scores/></RequireAuth>)
			},
			{
				path: "merchant/quizeditor",
				element: (<RequireElevated><QuizEdit/></RequireElevated>)
			},
			{
				path: "merchant/quizviewer",
				element: (<RequireElevated><QuizView/></RequireElevated>)
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
				path: "merchant/content",
				element: (<RequireElevated><TopicViewer/></RequireElevated>)
			},
			{
				path: "merchant/contentview",
				element: (<RequireElevated><ContentViewer/></RequireElevated>)
			},
			{
				path: "merchant/contentedit",
				element: (<RequireElevated><ContentEditor/></RequireElevated>)
			},
			{
				path: "merchant/forms",
				element: (<RequireElevated><Forms/></RequireElevated>)
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
	}
]);

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
