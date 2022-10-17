import React, {useEffect} from "react";
import {Button, ChevronRightIcon, Icon} from "evergreen-ui";
import '../assets/css/Landing.scss';

import cu1 from '../assets/img/cu1.png';
import cu2 from '../assets/img/cu2.png';
import cu3 from '../assets/img/cu3.png';
import cu4 from '../assets/img/cu4.png';
import cu5 from '../assets/img/cu5.png';
import screenshot from '../assets/img/Magazine 2.png';
import NavigationBar from "../components/NavigationBar";

const Landing = () => {

	return (
		<>
			<NavigationBar/>
			<div className={"landingMain"}>

				<section className={"heading"}>
			{/*		<div className={"clippy"}>

					</div>*/}
					<div style={{paddingRight: 40, paddingLeft: 50, flex: 1}}>
						<h1 className={"intro"}>The Platform for Hospitality</h1>
						<hr className={"dashed"}/>
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
					<div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
						<img src={screenshot} width={400} alt={''}/>
					</div>

				</section>

				<section>
					<h2>Who we're working with:</h2>
					<hr className={"solid"}/>
					<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
						<img src={cu1} alt={''}/>
						<img src={cu2} alt={''}/>
						<img src={cu3} alt={''}/>
						<img src={cu4} alt={''}/>
						<img src={cu5} alt={''}/>
					</div>
				</section>


			</div>
		</>
	)
}

export default Landing;
