import React, {useContext, useEffect, useState} from "react";
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {Icon, TrashIcon} from "evergreen-ui";
import {useSearchParams} from "react-router-dom";
import {ContentRequest, IPostContent, ITopic} from "@thedashboardai/train-edu-front-end-api-wrapper";
import LoadingIndc from "../../components/elements/LoadingIndc";
import {useMediaQuery} from "react-responsive";
import {IPopup} from "../../components/Popup";
import {PopupContext, PopupContextProps} from "../../provider/PopupProvider";

export default function ContentViewer() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [isLoading, setLoading] = useState(true);
	const [searchParams] = useSearchParams();
	const {setPopups} = useContext(PopupContext) as PopupContextProps;

	const [topic, setTopic] = useState<ITopic>(null);
	const [posts, setPosts] = useState<IPostContent[] | null>(null);
	const isSmaller = useMediaQuery({query: '(max-width: 900px)'})

	useEffect(() => {
		if (user !== null && profile !== null) {
			const a = async () => {
				setLoading(true)
				setTopic(await ContentRequest.getTopic(searchParams.get('id')))
				setPosts(await ContentRequest.getContentForTopic(profile.restaurantId, searchParams.get('id')))
				setLoading(false)
			}
			a()
		}
	}, [user, profile])

	return (
		<>
			<ManagerBar/>
			<div className="App">

				<div className="content">

					{!topic ? <LoadingIndc message={'Loading content'}/> :
						<>
							<div style={{
								display: "flex",
								flexDirection: isSmaller ? 'column' : 'row',
								alignItems: 'center',
								gap: isSmaller ? 10 : 40,
								marginTop: 20,
								marginRight: 20,
								marginLeft: 20,
							}}>
								{!isSmaller && <img
									src={'data:image/png;base64,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'}
									alt={''}/>}
								<div>
									<Breadcrumbs aria-label="breadcrumb">
										<Link
											underline="hover"
											color="inherit"
											href="/merchant/content"
										>
											Your Content
										</Link>
										<Typography color="text.primary">{topic.name}</Typography>
									</Breadcrumbs>

									<h1 style={{
										fontWeight: 'bold',
									}}>{topic.name}</h1>
									<h4>Click on the content you want to edit or add a new one.</h4>
								</div>

								<button className={'nextButton'} id={'blue'} onClick={() => {
									window.open('contentedit?topic=' + topic.topicId, '_self')
								}}>Add New +
								</button>
							</div>

							<div className={'postsArea'}>
								{isLoading ? <LoadingIndc message={'Loading content'}/> :
									(posts?.map((post, idx) => {
										return (
											<div className={'contentBox'} key={idx}>
												<img
													src={'data:image/png;base64,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'}
													alt={''}/>

												<div style={{
													display: 'flex',
													flexDirection: 'column',
													width: '100%',
													overflow: 'hidden'
												}}>
													<div className={'titleArea'}>
														<h4 style={{
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															maxWidth: 190,
															fontWeight: 'bold'
														}}>{post.title}</h4>
														<div style={{
															display: 'flex',
															flexDirection: 'row',
															gap: 5
														}}>
															<button className={'wireButton'}
																	onClick={() => {
																		window.open('contentedit?topic=' + topic.topicId + '&id=' + post.file_id, '_self')
																	}}
															>Edit
															</button>
															<button className={'dangerButton'}
																	onClick={() => {
																		const popup: IPopup = {
																			title: 'Delete "' + post.title + '"?',
																			subText: 'Are you sure want to permanently delete this topic?',
																			isInProgress: false,
																			confirmType: 'warning',
																			cancelText: 'Cancel',
																			confirmText: 'Delete',
																			onConfirmed: () => {

																			}
																		}
																		setPopups(a => [...a, popup])
																	}}
															><Icon icon={TrashIcon}
																   color={'#ffffff'}/>
															</button>
														</div>
													</div>

													<p style={{
														textOverflow: 'ellipsis',
													}}>
														{post.description}
													</p>
												</div>
											</div>)
									}))}
							</div>
						</>}
				</div>
			</div>
		</>
	);
}
