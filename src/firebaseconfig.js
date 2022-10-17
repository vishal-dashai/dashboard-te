const FIREBASE_CONFIG = (() => {
	if (process.env.REACT_APP_MODE === 'production') {
		return {
			apiKey: "AIzaSyBBNlBcYf9yajA8bVa0yVud-L6JbjnP9TY",
			authDomain: "training-and-education-prod.firebaseapp.com",
			projectId: "training-and-education-prod",
			storageBucket: "training-and-education-prod.appspot.com",
			messagingSenderId: "1066322959797",
			appId: "1:1066322959797:web:80a8e26b6d8ed223328dfc"
		}
	} else {
		return {
			apiKey: "AIzaSyAWSFmtWze5g7dH67ZN8yH3U6q2eV7Mo2A",
			authDomain: "training-and-education-ff573.firebaseapp.com",
			projectId: "training-and-education-ff573",
			storageBucket: "training-and-education-ff573.appspot.com",
			messagingSenderId: "638550261627",
			appId: "1:638550261627:web:85433d20f76e2a0369c7de"
		}
	}
})()

export default FIREBASE_CONFIG
/*let Firebase;

Firebase = initializeApp(FIREBASE_CONFIG);
initializeAuth(Firebase);

export default Firebase*/
