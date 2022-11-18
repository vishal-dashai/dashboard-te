import React, {Fragment, useContext, useEffect, useState} from "react";
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {Icon, TrashIcon} from "evergreen-ui";
import {useSearchParams} from "react-router-dom";
import {ContentRequest, IPostContent, ITopic} from "@thedashboardai/train-edu-front-end-api-wrapper";
import LoadingIndc from "../../components/elements/LoadingIndc";
import {useFilePicker} from 'use-file-picker';
import API from "../../api";
import frame from '../../assets/wine.png';

export default function ContentEditor() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [isLoading, setLoading] = useState(true);
	const [searchParams] = useSearchParams();

	const [topic, setTopic] = useState<ITopic>(null);
	const [livePost, setLivePost] = useState<IPostContent>(null);
	const [post, setPost] = useState<IPostContent>(null);

	const [openFileSelector, {clear, filesContent, loading, errors}] = useFilePicker({
		readAs: 'DataURL',
		accept: 'image/*',
		multiple: false,
		limitFilesConfig: {max: 1},
		// minFileSize: 0.1, // in megabytes
		maxFileSize: 50,
	});

	function dataURItoBlob(dataURI: string) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], {type: mimeString});
	}

	const publishChanges = async () => {
		const id: string | null = searchParams.get('id');

		/*		if (true)
					return;*/

		if (id !== null) {
			if (livePost.title !== post.title || livePost.description !== post.description) {
				await fetch(`${API}/updateContentTextById/` + id, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						title: post.title,
						description: post.description
					})
				})
			}

			if (filesContent.length > 0) {
				console.log(filesContent[0].content)

				const blob = dataURItoBlob(filesContent[0].content);
				// const resultFile = new File([blob],  filesContent[0].name);

				// const blob = await (await fetch(filesContent[0].content)).blob();
				let form = new FormData();
				form.append('file', blob);

				await fetch(`${API}/updateContentImageById/` + id, {
					method: 'PUT',
					body: form
				}).then((r) => {
					console.log(r)
				}).catch((e) => {
					console.log(e)
				})
			}
			await setLivePost(post)
		} else {
/*			const blob = dataURItoBlob(filesContent[0].content);
			let form = new FormData();
			var file = new File([blob], filesContent[0].name, {lastModified: Date.now()})
			console.log(file.name)
			form.append('file', file);*/

			const blob = dataURItoBlob(filesContent[0].content);
			let form = new FormData();
			form.append('file', blob);

			await fetch(`${API}/uploadFile?title=${post.title}&description=${post.description}&chapter_number=${12}&topic_id=${searchParams.get('topic')}&restaurant_id=${profile.restaurantId}`, {
				method: 'POST',
				body: form
			}).then((r) => {
				console.log(r)
			}).catch((e) => {
				console.log(e)
			})
		}
	}

	useEffect(() => {
		if (user !== null && profile !== null) {
			const a = async () => {
				setLoading(true)
				await setTopic(await ContentRequest.getTopic(searchParams.get('topic')))
				if (searchParams.has('id')) {
					const li = await ContentRequest.getPost(searchParams.get('id'))
					await setPost(li)
					await setLivePost(li)
				} else {
					let ps = {
						title: null as string,
						description: ''
					};
					await setPost(ps as IPostContent)
				}
				setLoading(false)
			}
			a()
		}
	}, [user, profile])

	return (
		<>
			<ManagerBar/>
			<div className="App">

				<div className="content" style={{
					flexDirection: 'row',
					alignItems: 'flex-start',
					width: '70%'
				}}>

					{/*	<div style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 10,
					}}>

						<div style={{
							borderRadius: 12,
							backgroundColor: '#E7EAEF'
						}} className={'catalogue'}>
							<h4>Image Catalogue</h4>
							<div className={'images'}>
								<img alt={''}
									 src={'https://images.unsplash.com/photo-1668067446629-307d4ef9e0f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=697&q=80'}/>
								<img alt={''}
									 src={'https://images.unsplash.com/photo-1668067446629-307d4ef9e0f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=697&q=80'}/>
							</div>
						</div>

						<p style={{
							fontWeight: 600,
							fontSize: 16,
							marginTop: 10,
						}}>OR</p>
						<button className={'nextButton'}>Browse Files</button>
					</div>*/}

					{isLoading ? <LoadingIndc message={'Loading content'}/> :
						<div style={{
							flex: 1,
							flexDirection: 'column'
						}}>
							<div style={{
								display: "flex",
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 40,
								marginTop: 20,
								marginLeft: 30,
								width: '100%',
							}}>
								<div>
									<Breadcrumbs aria-label="breadcrumb">
										<Link
											underline="hover"
											color="inherit"
											href="/merchant/content"
										>
											Your Content
										</Link>
										<Link
											underline="hover"
											color="inherit"
											href={("/merchant/contentview?id=" + searchParams.get('topic'))}
										>
											{topic.name}
										</Link>
										<Typography color="text.primary">{post?.title}</Typography>
									</Breadcrumbs>

									<textarea className={"contentTitleEdit"} placeholder={"Enter content title"}
											  defaultValue={post.title} onChange={(e) => {
										setPost(a => {
											return {...a, title: e.target.value}
										})
									}}/>
								</div>

								<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 30}}>
									<button className={'dangerButton'}><Icon icon={TrashIcon}
																			 color={'#ffffff'}/>
									</button>
									<button className={'nextButton'} id={'blue'} onClick={() => {
										publishChanges()
									}
									}>Save Changes
									</button>
								</div>
							</div>

							<div className={'contentEditorArea'}>
								<div style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 10,
								}}>

									{filesContent.length > 0 && !loading && !errors.length ?
										filesContent.map((file, indx) => {
											return (
												<Fragment key={indx}>
													<img alt={''}
														 src={file.content}/>
													<button className={'pillButton'} id={'selected'} onClick={() => {
														clear()
													}}>Remove Upload
													</button>
												</Fragment>)
										}) :

										<img alt={''} src={post?.s3FileUrl ?? frame}/>}

									<button className={'nextButton'} onClick={() => {
										openFileSelector()
									}}>Browse Files
									</button>
								</div>

								<textarea placeholder={'Enter your content description'}
										  defaultValue={post?.description} onChange={(e) => {
									setPost(a => {
										return {...a, description: e.target.value}
									})
								}}/>
							</div>
						</div>}
				</div>
			</div>
		</>
	);
}
