import React, {useEffect} from "react";
import {Button} from "evergreen-ui";

const Home = () => {
	const PROJECT_ID = "z5pf5y46";
	const DATASET = "development";

	useEffect(() => {

		let bo = ''
		let QUERY = encodeURIComponent('*[_type == "topic" && restaurant._ref == "6fe01656-67a6-47e3-a40f-56328fc75787"]');
		let URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;
		fetch(URL)
			.then((res) => res.json())
			.then(({result}) => {
				console.log(result)
				bo = result[0].content[0]._ref;
			})
			.catch((err) => console.error(err)).then(() => {


			let QUERY2 = encodeURIComponent('*[_type == "content" && _id == "' + bo + '"]');
			let URL2 = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY2}`;
			fetch(URL2)
				.then((res) => res.json())
				.then(({result}) => {
					console.log(result)
				})
				.catch((err) => console.error(err));


		});

//9776e260-6d85-45cf-9368-df66d10cabda
	}, [])

	return (
		<div>
			<Button onClick={() => {
/*
				var metadata = {
					'title': fileData.fileName,
					'mimeType': contentType,
					'parents':["0B6NmmF3ovpsbExuOEc1R2JzSFEp"] // It is one of my folder's id.
				};

				var base64Data = btoa(reader.result);
				var multipartRequestBody =
					delimiter +
					'Content-Type: application/json\r\n\r\n' +
					JSON.stringify(metadata) +
					delimiter +
					'Content-Type: ' + contentType + '\r\n' +
					'Content-Transfer-Encoding: base64\r\n' +
					'\r\n' +
					base64Data +
					close_delim;

				var request = gapi.client.request({
					'path': '/upload/drive/v2/files',
					'method': 'POST',
					'params': {'uploadType': 'multipart'},
					'headers': {
						'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
					},
					'body': multipartRequestBody});

				request.execute(callback);
*/


			/*	const drive = google.drive({
					version: 'v2',
					auth: 'AIzaSyDeNo4kNp0B3Oo5cMZF8IjfZ5drIHKIhWE'
				});*/

			}}></Button>
		</div>
	)
}

export default Home;
