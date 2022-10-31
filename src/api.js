const API = (() => {
	let ap = '';
	if (process.env.REACT_APP_MODE === 'production') {
		ap = "https://training-and-education-prod.herokuapp.com"
	} else {
		ap = "https://train-edu-testing.herokuapp.com"
	}

	ap += '/api/v1'
	return ap;
})()

export default API
