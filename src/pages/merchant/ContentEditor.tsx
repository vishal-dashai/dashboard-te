import React, {Fragment, useContext, useEffect, useState} from "react";
import {AuthenticatedUserContext} from "../../provider/AuthenticatedUserProvider";
import ManagerBar from "../../components/ManagerBar";
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {useSearchParams} from "react-router-dom";
import {ContentRequest, IPostContent, ITopic} from "@thedashboardai/train-edu-front-end-api-wrapper";
import LoadingIndc from "../../components/elements/LoadingIndc";
import {useFilePicker} from 'use-file-picker';
import API from "../../api";
import frame from '../../assets/wine.png';
import {PopupContext, PopupContextProps} from "../../provider/PopupProvider";
import {IPopup} from "../../components/Popup";
import {useMediaQuery} from "react-responsive";

export default function ContentEditor() {
	const {user, profile} = useContext(AuthenticatedUserContext);
	const [isLoading, setLoading] = useState(true);
	const [searchParams] = useSearchParams();

	const [topic, setTopic] = useState<ITopic>(null);
	const [livePost, setLivePost] = useState<IPostContent>(null);
	const [post, setPost] = useState<IPostContent>(null);
	const {setPopups} = useContext(PopupContext) as PopupContextProps;
	const isSmaller = useMediaQuery({query: '(max-width: 900px)'})

	const [openFileSelector, {clear, filesContent, loading, errors}] = useFilePicker({
		readAs: 'DataURL',
		accept: ['.jpeg', '.jpg'],
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
		let id: string | null = searchParams.get('id');

		// convertPost(post)


		if (post?.file_id !== null) {
			id = post.file_id;
		}
		console.log(id)

		const popup: IPopup = {
			title: 'Uploading Content',
			loadingText: 'Uploading Content',
			subText: null,
			isInProgress: true,
		}
		setPopups(a => [...a, popup])

		if (id !== null && livePost !== null) {
			if (livePost.title !== post.title || livePost.description !== post.description) {
				convertPost(post)

				await fetch(`${API}/updateContentTextById/` + id, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						title: post.title,
						description: post.description
					})
				}).then((r) => r.json()).then((a) => {
					console.log(a)
					const re: IPostContent = JSON.parse(JSON.stringify(a));
					setLivePost(re)
					setPost(re)
				}).catch((e) => {
					console.log(e)
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
				}).then((r) => r.json()).then((a) => {
					console.log(a)
					const re: IPostContent = JSON.parse(JSON.stringify(a));
					setLivePost(re)
					setPost(re)
				}).catch((e) => {
					console.log(e)
				})
			}
			await setLivePost(post)
		} else {
			const blob = dataURItoBlob(filesContent[0].content);
			let form = new FormData();
			form.append('file', blob);

			convertPost(post)

			await fetch(`${API}/uploadFile?title=${post.title}&description=${post.description}&chapter_number=${12}&topic_id=${searchParams.get('topic')}&restaurant_id=${profile.restaurantId}`, {
				method: 'POST',
				body: form
			}).then((r) => r.json()).then((a) => {
				console.log(a)
				console.log('AAAAAAAAAAAAAAAAAAAAAA')
				console.log(JSON.stringify(a))
				const re: IPostContent = JSON.parse(JSON.stringify(a));
				console.log(re.s3FileUrl)
				console.log(re)

				window.open('contentedit?topic=' + re.topic_id + '&id=' + re.file_id, '_self')

				// setLivePost(re)
				// setPost(re)
			}).catch((e) => {
				console.log(e)
			})
		}
		clear()

		setPopups(a => a?.filter((b) => b.title !== popup.title))
	}

	function convertPost(post: IPostContent) {
		let content = '';
		let inList = false;
		post.description.split('\n').forEach((s) => {
			console.log(s + " | ")
			if (s.startsWith('-')) {
				if (!inList)
					content += '<ul>'
				inList = true
				content += `<li>${s.substring(1)}</li>`
			} else {
				if (inList)
					content += '</ul>'
				if (s.length > 0)
					content += `<p>${s}</p>`
			}
		})
		post.description = content;
		console.log(content)
	}

	function cleanPost(post: IPostContent){
		let content = '';
		post.description.split('<').forEach((s) => {
			if(s.startsWith('p')){
				content += s.substring(2) + '\n';
			}
			else if(s.startsWith('u')){

			}
			else if(s.startsWith('l')){
				content += '-' + s.substring(3) + '\n';
			}
		})
		console.log(content)
		post.description = content
	}

	useEffect(() => {
		if (user !== null && profile !== null) {
			const a = async () => {
				setLoading(true)
				await setTopic(await ContentRequest.getTopic(searchParams.get('topic')))
				if (searchParams.has('id')) {
					const li = await ContentRequest.getPost(searchParams.get('id'))
					cleanPost(li)
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

				<div className="content">

					{isLoading ? <LoadingIndc message={'Loading content'}/> :
						<div style={{
							flexDirection: 'column',
							minWidth: '70%',
							gap: isSmaller ? 10 : 40,
							marginTop: 20,
							marginRight: 20,
							marginLeft: 20,
							display: 'flex',
							alignItems: 'center'
						}}>
							<div style={{
								display: "flex",
								flexDirection: isSmaller ? 'column' : 'row',
								alignItems: 'center',
								justifyContent: isSmaller ? 'center' : 'space-between',
								gap: isSmaller ? 10 : 40,
								marginTop: 20,
								marginLeft: 30,
								marginRight: 30,
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

								<div style={{
									display: 'flex',
									flexDirection: isSmaller ? 'row-reverse' : 'row',
									alignItems: 'center',
									gap: isSmaller ? 10 : 30,

								}}>
									{/*	<button className={'dangerButton'}><Icon icon={TrashIcon}
																			 color={'#ffffff'}/>
									</button>*/}
									<button className={'nextButton'} id={'blue'} onClick={() => {
										publishChanges()
									}
									}>Save Changes
									</button>
								</div>
							</div>

							<div className={'contentEditorArea'} style={{
								flexDirection: isSmaller ? 'column' : 'row',
								display: 'flex',
								justifyContent: 'center',
								width: '90%'
							}}>
								<div style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: isSmaller ? 5 : 10,
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

								{/*<Editor
										editorState={editorState}
										toolbarClassName="toolbarClassName"
										wrapperClassName="wrapperClassName"
										editorClassName="editorClassName"
										onEditorStateChange={this.onEditorStateChange}
									/>*/}
								<textarea placeholder={'Enter your content description'}
										  defaultValue={post?.description} onChange={(e) => {
									setPost(a => {
										return {...a, description: e.target.value}
									})
								}}/>

								{/*	<textarea placeholder={'Enter your content description'}
										  defaultValue={post?.description} onChange={(e) => {
									setPost(a => {
										return {...a, description: e.target.value}
									})
								}}/>*/}
							</div>
						</div>}
				</div>
			</div>
		</>
	);
}
