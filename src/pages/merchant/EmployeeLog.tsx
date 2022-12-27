import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {AuthContextType, AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {ContentRequest, ContentSender} from "@thedashboardai/train-edu-front-end-api-wrapper";
import LoadingIndc from "../../components/elements/LoadingIndc";
import Form from 'react-bootstrap/Form';
import {IPopup} from "../../components/Popup";
import {PopupContext, PopupContextProps} from "../../provider/PopupProvider";

export default function EmployeeLog() {
	const {user, profile} = useContext(AuthenticatedUserContext) as AuthContextType;
	const {setPopups} = useContext(PopupContext) as PopupContextProps;

	const [employees, setEmployees] = useState<{ isManager: boolean, name: string, userId: string }[]>([]);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		if (user !== null && profile !== null) {
			const a = async () => {
				setLoading(true)
				let token = await user.getIdToken()
				setEmployees(await ContentRequest.getAllUsers(token, profile.restaurantId))
				setLoading(false)
			}
			a()
		}
	}, [user, profile])


	return (
		<>
			<ManagerBar/>

			{isLoading ? <LoadingIndc message={'Loading employees'}/> :
				<div>
					<div style={{
						display: 'flex',
						justifyContent: 'center',
						alignContent: 'center',
						marginTop: 40,
					}}>
						<h4>Granting manager access will allow access to the admin dashboard.</h4>

					</div>

					<div className={'topics'}>
						{employees?.map((a, i) => {
							return (
								<div className={'topicSection'} key={i}>
									<div style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										gap: 20,
										width: '70%'
									}}>
										<h3>{a.name}</h3>
									</div>

									<div style={{
										display: 'flex',
										flexDirection: 'row-reverse',
										alignItems: 'center',
										gap: 20
									}}>

										<Form.Check
											checked={a.isManager}
											onChange={async (b: ChangeEvent) => {
												const token = await user.getIdToken()

												if (!a.isManager) {
													const popup: IPopup = {
														title: 'Promote ' + a.name + '?',
														subText: 'Are you sure want to make ' + a.name + ' a manager?',
														isInProgress: false,
														confirmType: 'go',
														cancelText: 'Cancel',
														confirmText: 'Confirm',
														onConfirmed: async () => {
															await ContentSender.giveManagerAccess(token, a.userId, profile.restaurantId)
															a.isManager = !a.isManager;
															setEmployees([...employees])
															setPopups(a => a?.filter((b) => b.title !== popup.title))
														}
													}
													setPopups(a => [...a, popup])
												} else {
													const popup: IPopup = {
														title: 'Demote ' + a.name + '?',
														subText: 'Are you sure want to remove manager access for ' + a.name + '?',
														isInProgress: false,
														confirmType: 'go',
														cancelText: 'Cancel',
														confirmText: 'Confirm',
														onConfirmed: async () => {
															await ContentSender.revokeManagerAccess(token, a.userId, profile.restaurantId)
															a.isManager = !a.isManager;
															setEmployees([...employees])
															setPopups(a => a?.filter((b) => b.title !== popup.title))
														}
													}
													setPopups(a => [...a, popup])
												}
											}}
											type="switch"
											id="custom-switch"
											label="Is Manager"
										/>

									</div>
								</div>
							)
						})}
					</div>
				</div>}
		</>

	);
}
