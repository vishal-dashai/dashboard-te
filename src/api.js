const API = (() => {
    if(process.env.REACT_APP_MODE === 'production') {
        return "https://training-and-education-prod.herokuapp.com"
    } else {
        return "https://train-edu-testing.herokuapp.com"
    }
})()

export default API
