import React, {useContext} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo.png'
import {Icon, LogOutIcon, Text} from "evergreen-ui";
import {getAuth} from "firebase/auth";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import DeviceMessage from '../assets/svg/device-message.svg';
import SendSquare from '../assets/svg/send-square.svg';
import EditIcon from '../assets/svg/edit.svg';
import Flash from '../assets/svg/flash.svg';
import {useLocation} from "react-router-dom";

export default function ManagerBar() {
	const {user} = useContext(AuthenticatedUserContext);
	const location = useLocation();

	return (
		<Navbar collapseOnSelect expand="xxl">
			<Container>
				<Navbar.Brand href="home">
					<Nav.Link href="home"><img
						src={logo}
						width="50"
						height="50"
						className="d-inline-block align-top"
						alt=''/></Nav.Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/merchant/scores">
							<div className={'linker'} id={location.pathname === '/merchant/scores' ? 'red' : ''}>
								<img id={location.pathname === '/merchant/scores' ? 'red' : ''} src={DeviceMessage}
									 alt=""/>
								<p id={location.pathname === '/merchant/scores' ? 'red' : ''}
								   className={"linkerText"}>Quiz
									Scores</p>
							</div>
						</Nav.Link>
						<Nav.Link href="/merchant/quizviewer">
							<div className={'linker'} id={location.pathname.includes('quiz') ? 'purple' : ''}>
								<img src={EditIcon} id={location.pathname.includes('quiz') ? 'purple' : ''}
									 alt=""/>
								<p className={"linkerText"}
								   id={location.pathname.includes('quiz') ? 'purple' : ''}>Quiz Editor</p>
							</div>
						</Nav.Link>
						<Nav.Link href="/merchant/updates">
							<div className={'linker'} id={location.pathname === '/merchant/updates' ? 'green' : ''}>
								<img src={Flash} id={location.pathname === '/merchant/updates' ? 'green' : ''}
									 alt=""/>
								<p className={"linkerText"}
								   id={location.pathname === '/merchant/updates' ? 'green' : ''}>Instant
									Updates</p>
							</div>
						</Nav.Link>
						<Nav.Link href="/merchant/upload">
							<div className={'linker'} id={location.pathname === '/merchant/upload' ? 'purple' : ''}>
								<img src={SendSquare} id={location.pathname === '/merchant/upload' ? 'purple' : ''}
									 alt=""/>
								<p className={"linkerText"}
								   id={location.pathname === '/merchant/upload' ? 'purple' : ''}>Upload Content</p>
							</div>
						</Nav.Link>
					</Nav>
					<Nav>
						<br/>
						{user && <button className={"fancyButtonPrev fancyButtonFull"} onClick={() => {
							getAuth().signOut().then(r => window.location.href = "/login")
						}}>
							Sign Out
							{<Icon icon={LogOutIcon} height={20} width={20} marginTop={3} marginLeft={3}/>}
						</button>}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
