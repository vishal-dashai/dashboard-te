import React, {useContext} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo.png'
import {Button, LogOutIcon} from "evergreen-ui";
import {getAuth} from "firebase/auth";
import {NavDropdown} from "react-bootstrap";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";

export default function NavigationBar() {
	const {user} = useContext(AuthenticatedUserContext);

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
						<Nav.Link href="scores">Scores</Nav.Link>
						<NavDropdown title="Dropdown" id="collasible-nav-dropdown">
							<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">
								Another action
							</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider/>
							<NavDropdown.Item href="#action/3.4">
								Separated link
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
					<Nav>
						{user && <Button className="logoutBtn" size="large" appearance="primary" intent="danger"
										 iconAfter={LogOutIcon}
										 onClick={() => {
											 getAuth().signOut().then(r => window.location.href = "login")
										 }}
						>
							Sign out
						</Button>}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
