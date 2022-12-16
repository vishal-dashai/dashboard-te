import React, {useState} from "react";
import {ITopic} from "@thedashboardai/train-edu-front-end-api-wrapper";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../assets/logo.png";
import DeviceMessage from "../assets/svg/device-message.svg";
import {useLocation} from "react-router-dom";
import {ChevronDownIcon, ChevronUpIcon, Icon, SearchInput} from "evergreen-ui";
import faqContent from '../assets/data/faq.json';
import Collapse from 'react-bootstrap/Collapse';
import {Divider} from "@mui/material";

export default function FAQ() {
	const [isLoading, setLoading] = useState(true);
	const location = useLocation();
	const [searchKey, setSearchKey] = useState<string>('');


	return (
		<>
			<div className="App">

				<Navbar collapseOnSelect expand="xxl">
					<Container>
						<Navbar.Brand>
							{/*<Nav.Link href="home"><img
						src={logo}
						width="50"
						height="50"
						className="d-inline-block align-top"
						alt=''/></Nav.Link>*/}
							<Nav.Link><img
								src={logo}
								width="50"
								height="50"
								className="d-inline-block align-top"
								alt='sinatra logo'/></Nav.Link>
						</Navbar.Brand>
						<Navbar.Toggle aria-controls="responsive-navbar-nav"/>
						<Navbar.Collapse id="responsive-navbar-nav">
							<Nav className="me-auto">
								<Nav.Link href="/faq">
									<div className={'linker'} id={location.pathname === '/faq' ? 'red' : ''}>
										<img id={location.pathname === '/faq' ? 'red' : ''} src={DeviceMessage}
											 alt=""/>
										<p id={location.pathname === '/faq' ? 'red' : ''}
										   className={"linkerText"}>FAQ</p>
									</div>
								</Nav.Link>
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>

				<div className="content">

					<div className={'tileHeader'}>
						<h3>FAQ</h3>
					</div>

					<div className={'searchBar'}>
						<SearchInput placeholder="Search" value={searchKey}
									 onChange={(e: { target: { value: any; }; }) => {
										 setSearchKey(e.target?.value ?? '')
									 }}
						/>
					</div>

					{faqContent.groups.map((a, i) => {
						return (
							<div style={{}}>
								<h4 style={{
									fontWeight: 700,
									fontSize: 18,
								}}>{a.title}</h4>
								{
									a.content.map((b: any, c: number) => {
										return (
											<>
												<CollpaseArea content={b}/>
												<Divider light/>
											</>
										)
									})
								}
							</div>
						)
					})}

				</div>
			</div>
		</>
	);
}

function CollpaseArea({content}: { content: any }) {
	const [isExpanded, setExpanded] = useState(false);

	return (
		<div className={'collapseArea'}>
			<div className={'clickableSection'} onClick={() => {
				setExpanded(!isExpanded)
			}}>
				<h5>{content.title}</h5>
				<Icon icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
					  size={24}/>
			</div>

			<Collapse in={isExpanded}>
				<div>
					<p style={{marginBottom: 10}}>
						{content.description}
					</p>
					{content.image && <img src={require('../assets/img/' + content.image)} width={'100%'}/>}
				</div>
			</Collapse>
		</div>)

}
