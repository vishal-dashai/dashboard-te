import React, {useContext, useEffect, useState} from "react";
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {Icon, TrashIcon} from "evergreen-ui";
import {useSearchParams} from "react-router-dom";
import {ContentRequest, ContentSender, IPostContent, ITopic} from "@thedashboardai/train-edu-front-end-api-wrapper";
import LoadingIndc from "../../components/elements/LoadingIndc";
import {useMediaQuery} from "react-responsive";
import {IPopup} from "../../components/Popup";
import {PopupContext, PopupContextProps} from "../../provider/PopupProvider";
import {cleanPost} from "./ContentEditor";

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
				let token = await user.getIdToken();
				setTopic(await ContentRequest.getTopic(token, searchParams.get('id')))
				const valid = (await ContentRequest.getContentForTopic(token, profile.restaurantId, searchParams.get('id')))?.filter((a) => a.isActive)
				valid.forEach((b) => cleanPost(b))
				console.log(valid)
				setPosts(valid)
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
									src={require('../../assets/logo.png')}
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

								<button className={'wireButton'}
										onClick={() => {
											let title: string = topic.name;

											const popup: IPopup = {
												title: 'Edit Topic',
												subText: 'Enter the new name of this topic.',
												isInProgress: false,
												confirmType: 'blue',
												cancelText: 'Cancel',
												confirmText: 'Confirm',
												body: <>
												<textarea
													className={"contentTitleEdit"}
													placeholder={"Enter new topic title"}
													defaultValue={title}
													onChange={(e) => {
														title = e.target.value;
													}}/>
												</>,
												onConfirmed: async () => {
													const token = await user.getIdToken()
													await ContentSender.updateTopicName(token, topic.topicId, {topicName: title})
													setPopups(a => a?.filter((b) => b.title !== popup.title))
												}
											}
											setPopups(a => [...a, popup])
										}}
								>Edit Topic
								</button>

								<button
									className={'dangerButton'}
									onClick={() => {
										const popup: IPopup = {
											title: 'Delete "' + topic.name + '"?',
											subText: 'Are you sure want to permanently delete this topic? Deleting this will also permanently delete all posts in this section.',
											isInProgress: false,
											confirmType: 'warning',
											cancelText: 'Cancel',
											confirmText: 'Delete',
											onConfirmed: async () => {
												/*ContentSender.deleteContentById(await user.getIdToken(), post.file_id).then(() => {
													setPosts(posts.filter((p) => p.file_id !== post.file_id))
												})*/
												setPopups(a => a?.filter((b) => b.title !== popup.title))
											}
										}
										setPopups(a => [...a, popup])
									}}
								>
									<p>Delete Topic</p>
									<Icon icon={TrashIcon}
										  color={'#ffffff'}/>
								</button>
							</div>

							<div className={'postsArea'}>
								{isLoading ? <LoadingIndc message={'Loading content'}/> :
									(posts?.map((post, idx) => {
										return (
											<div className={'contentBox'} key={idx}>
												<img
													src={post.file_type !== "VIDEO" && post.s3FileUrl ? post.s3FileUrl : require('../../assets/logo.png')}
													placeholder={require('../../assets/logo.png')}
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
																			subText: 'Are you sure want to permanently delete this content?',
																			isInProgress: false,
																			confirmType: 'warning',
																			cancelText: 'Cancel',
																			confirmText: 'Delete',
																			onConfirmed: async () => {
																				ContentSender.deleteContentById(await user.getIdToken(), post.file_id).then(() => {
																					setPosts(posts.filter((p) => p.file_id !== post.file_id))
																					setPopups(a => a?.filter((b) => b.title !== popup.title))
																				})
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
