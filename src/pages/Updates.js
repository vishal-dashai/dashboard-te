import React, {useContext} from "react";
import vector1 from '../assets/vector1.png'
import vector2 from '../assets/vector2.png'
import vector3 from '../assets/vector3.png'
import '../App.scss'
import {AuthenticatedUserContext} from "../provider/AuthenticatedUserProvider";
import ManagerBar from "../components/ManagerBar";
import {Button, Textarea, TickIcon} from "evergreen-ui";

export default function Updates() {
	const {user} = useContext(AuthenticatedUserContext);

	return (
		<>
			<ManagerBar/>

			<div className="App">
				<div className={'coloredHeading'}>
					<h1>Instant Updates</h1>
				</div>

				<div className="content">
					<div style={{marginTop: 10}}>
						<h3>Enter any new or urgent training updates here!</h3>

						<div style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '100%',
							alignContent: 'center',
							alignItems: 'center',
							flex: '1 1 auto',
							marginTop: 20,
						}}>

							<Textarea name="textarea-1" placeholder="Type something here" minHeight={'50vh'}
									  style={{marginBottom: 20}}/>

							<Button iconAfter={TickIcon}
									className="nextButton"
									style={{background: '#44A8FF'}}
									onClick={() => {

									}}
							>{'Submit Update'}</Button>
						</div>

					</div>

					<img className="vector1" src={vector1} alt="design"/>
					<img className="vector2" src={vector2} alt="design"/>
					<img className="vector3" src={vector3} alt="design"/>
				</div>
			</div>
		</>
	);
}
