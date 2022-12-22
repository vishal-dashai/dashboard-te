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
import NavigationBar from "../components/NavigationBar";

export default function FAQ() {
	const [isLoading, setLoading] = useState(true);
	const location = useLocation();
	const [searchKey, setSearchKey] = useState<string>('');

	return (
		<>
			<div className="App">

				<NavigationBar/>

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

					{faqContent.groups.filter((r) => {

						if(r.content.filter(b => b.title.toLowerCase().includes(searchKey.toLowerCase())).length !== 0)
							return true

						return false;
					}).map((a, i) => {
						return (
							<div style={{}}>
								<h4 style={{
									fontWeight: 700,
									fontSize: 18,
								}}>{a.title}</h4>
								{
									a.content.filter(r => {
										if(r.title.toLowerCase().includes(searchKey.toLowerCase()))
											return true
										return false
									}).map((b: any, c: number) => {
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
