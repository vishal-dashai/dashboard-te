import React, {useContext} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/logo.png'
import {Button, ChevronRightIcon, Icon, LogOutIcon} from "evergreen-ui";
import {getAuth} from "firebase/auth";
import {NavDropdown} from "react-bootstrap";
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";

export default function NavigationBar() {
	const {user} = useContext(AuthenticatedUserContext);

	return (
		<Navbar collapseOnSelect expand="xxl">
			<Container>
				<Navbar.Brand href="/">
					<Nav.Link href="/"><img
						src={logo}
						width="50"
						height="50"
						className="d-inline-block align-top"
						alt=''/></Nav.Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="login">Dashboard Access</Nav.Link>
						<Nav.Link href="faq">FAQ</Nav.Link>
					</Nav>
					<Nav>
						{user ?
							<button className={"fancyButtonPrev fancyButtonFull"} onClick={() => {
								getAuth().signOut()
							}}>
								Sign Out
								{<Icon icon={LogOutIcon} height={20} width={20} marginTop={3} marginLeft={3}/>}
							</button>
							:

							<button className={"fancyButtonFullish"} id={'purpleButton'} onClick={() => {
								window.location.href = "login";
							}}>
								{"Merchant Login"}
								{<Icon icon={ChevronRightIcon} height={20} width={20} marginTop={3}/>}
							</button>

						}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
