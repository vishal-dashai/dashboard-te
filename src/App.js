import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import wine from './assets/wine.png'
import logo from './assets/logo.png'
import './App.css'
import { ArrowTopLeftIcon, ArrowTopRightIcon, Button, ChevronForwardIcon, ChevronRightIcon, ExportIcon, LogOutIcon, TextInput, TextInputField } from "evergreen-ui";

export default function App() {
  // 1. Create a state to store the user.
  // When the user's undefined, then the auth isn't initialized.
  // When it's null, then the user is not logged in.
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // 2. Add auth state change listener.
    firebase.auth().onAuthStateChanged(userData => {
      if (userData) {
        // 3. Save the user data to the state if it's logged in.
        setUser(userData);
      } else {
        // 4. Set the user to null to indicate that it's not logged in.
        setUser(null);
      }
    });
  }, []);

  const [songs, setSongs] = useState();

  if (user === undefined) {
    // 5. Display loading.
    return <div className="App">Loading...</div>;
  } else if (user === null) {
    // 6. Display the sign in button.
    return (
      <div className="App">
        <div className="loginWrapper">
          <div className="left">
            <img className="disaplyImg"  src={wine} alt="wine" />
            <img className="logoImg"  src={logo} alt="logo" />
          </div>
          <div className="right">
            <h1 className="title">Login</h1>
            <h2 className="subtitle">Training & Education</h2>
            <TextInputField inputHeight={50} inputWidth={376} label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"/>
            <TextInputField inputHeight={50} inputWidth={376} label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
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
            <img className="logoImg"  src={logo} alt="logo" />
            <h3 className="navTitle">
              Send your weekly content updates here!
            </h3>

            <Button marginRight={12} height={48} iconAfter={ArrowTopRightIcon}>
              Go to Weekly Updates
            </Button>
          </div>

          <div className="content">
            <h1 className="title">Welcome back {user?.email}</h1>
            <Button className="logoutBtn" size="large" appearance="primary" intent="danger" iconAfter={LogOutIcon}
              onClick={() => {
                // Sign out the user
                firebase.auth().signOut();
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        {/* The rest of the App component... */}
      </div>
    );
  }
}