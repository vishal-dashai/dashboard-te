import React from "react";
import {ChevronRightIcon, Icon} from "evergreen-ui";
import '../assets/css/Landing.scss';

import cu1 from '../assets/img/cu1.png';
import cu2 from '../assets/img/cu2.png';
import cu3 from '../assets/img/cu3.png';
import cu4 from '../assets/img/cu4.png';
import cu5 from '../assets/img/cu5.png';
import screenshot from '../assets/img/Magazine 2.png';
import sinatra from '../assets/img/Group 36366.png';
import labs from '../assets/img/Sinatra labs.png';
import inf from '../assets/img/Group 36359.png';
import inf2 from '../assets/img/Group 36360.png';
import inf3 from '../assets/img/Group 36361.png';
import NavigationBar from "../components/NavigationBar";
import {LogoInstagram, LogoLinkedin} from "react-ionicons";
import {useMediaQuery} from 'react-responsive'


const ComingSoonMobile = () => {
	return (<section style={{
		paddingRight: '5%',
		paddingLeft: '5%',
		flex: 1,
		paddingTop: 1,
		paddingBottom: 10,
		position: 'relative',
		isolation: 'isolate',
		background: '#151F28',
	}}>
		<div>
			<h2 className={'bigMessage'}>Coming Soon...</h2>
			<img src={labs} alt={'Sinatra Labs'} style={{padding: 0}} width={150}/>
		</div>
		<div className={"canvasContainer"}>
		</div>
		<br/>
		<div style={{display: 'flex', flexDirection: 'column', gap: 10, alignContent: 'center', alignItems: 'center'}}>
			<img src={inf} alt={''} style={{maxWidth: 400, width: '90%'}}/>
			<img src={inf2} alt={''} style={{maxWidth: 400, width: '90%'}}/>
			<img src={inf3} alt={''} style={{maxWidth: 400, width: '90%'}}/>
		</div>

		<br/>
		<div className={"canvasContainer2"}>
		</div>
	</section>);
}

const ComingSoonBig = () => {
	return (<section style={{
		paddingRight: '5%',
		paddingLeft: '5%',
		flex: 1,
		paddingTop: 1,
		paddingBottom: 10,
		position: 'relative',
		isolation: 'isolate',
		background: '#151F28',
	}}>
		<div>
			<h2 className={'bigMessage'}>Coming Soon...</h2>
			<img src={labs} alt={'Sinatra Labs'} style={{padding: 0}} width={200}/>
		</div>
		<div style={{marginTop: 100}}>
			<div className={"canvasContainer"}>
			</div>
			<br/>
			<div className={"soonSection"}>
				<img src={inf} alt={''} id={'img1'}/>
				<img src={inf2} alt={''} id={'img2'}/>
			</div>
			<div className={"soonSection2"}>
				<img src={inf3} alt={''} id={'img3'}/>
			</div>

			<div className={"canvasContainer2"}>
			</div>
		</div>

	</section>);
}


const Landing = () => {

	const isSmallerForSection = useMediaQuery({query: '(max-width: 1100px)'})
	const isSmaller = useMediaQuery({query: '(max-width: 950px)'})

	return (
		<>
			<NavigationBar/>
			<div className={"landingMain"}>

				<section className={"heading"}>
					<div style={{paddingRight: '5%', paddingLeft: '5%', flex: 1}}>
						<h1 className={"intro"}>The Platform for Hospitality</h1>
						<hr className={"dashed"}/>
						{!isSmaller && <>
							<h3>Starting with Training & Education:</h3>
							<ul>
								<li>Fully digitized and immersive.</li>
								<li>Real-time content like never before</li>
								<li>Simple and convenient.</li>
							</ul>
							<button className={"fancyButton"} onClick={() => {
								window.location.href = "onboard";
							}}>
								{"Sign up today"}
								{<Icon icon={ChevronRightIcon} height={20} width={20} marginTop={3}/>}
							</button>
						</>}
					</div>
					<div className={'introImage'}>
						<img src={screenshot} alt={''}/>
					</div>

				</section>

				{isSmaller && <div style={{
					paddingRight: '5%',
					paddingLeft: '5%',
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
					alignItems: 'center'
				}}>
					<br/>
					<h3>Starting with Training & Education:</h3>
					<ul>
						<li>Fully digitized and immersive.</li>
						<li>Real-time content like never before</li>
						<li>Simple and convenient.</li>
					</ul>
					<button className={"fancyButtonFullish"} id={'purple'} onClick={() => {
						window.location.href = "login";
					}}>
						{"Merchant Login"}
						{<Icon icon={ChevronRightIcon} height={20} width={20} marginTop={3}/>}
					</button>
					<br/>
					<button className={"fancyButtonFullish"} onClick={() => {
						window.location.href = "onboard";
					}}>
						{"Sign up today"}
						{<Icon icon={ChevronRightIcon} height={20} width={20} marginTop={3}/>}
					</button>
					<br/>
				</div>}

				<section className={'workingWith'}>
					<h2>Who we're working with:</h2>
					<hr className={"solid"}/>
					<div className={'companies'}>
						<img src={cu1} alt={''}/>
						<img src={cu2} alt={''}/>
						<img src={cu3} alt={''}/>
						<img src={cu4} alt={''}/>
						<img src={cu5} alt={''}/>
					</div>
				</section>

				{isSmallerForSection ? <ComingSoonMobile/> : <ComingSoonBig/>}

				<section className={'footerSection'}>
					<div className={'footerLogo'}>
						<img src={sinatra} alt={'Sinatra'} width={200} height={'auto'}/>
						<p>Contact Us</p>
						<a href={'https://www.linkedin.com/company/sinatrainc/'} target={'_blank'}
						   rel="noreferrer"><LogoInstagram
							height="30px"
							width="30px"/>
							Instagram</a>
						<a href={'https://www.linkedin.com/company/sinatrainc/'} target={'_blank'}
						   rel="noreferrer"><LogoLinkedin
							height="30px"
							width="30px"/>
							LinkedIn</a>
					</div>
					<div className={'footerSign'}>
						<h3>Starting with Training & Education:</h3>
						<ul>
							<li>Fully digitized and immersive.</li>
							<li>Real-time content like never before</li>
							<li>Simple and convenient.</li>
						</ul>
						<button className={"fancyButton"} onClick={() => {
							window.location.href = "onboard";
						}}>
							{"Sign up today"}
							{<Icon icon={ChevronRightIcon} height={20} width={20} marginTop={3}/>}
						</button>
					</div>
				</section>

			</div>
		</>
	)
}

export default Landing;
