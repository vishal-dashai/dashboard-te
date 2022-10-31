export default class QuizUploader {

	static compareAndBuildData(live, edited) {
		let result = []

		let editIds = []

		let newQuestions = []
		let updateQuestions = []
		let deletes = []

		edited.forEach((ele) => {
			const r = ele.questionId;
			if (r)
				editIds.push(r)
		});

		live.questions.forEach((r) => {
			if (!editIds.includes(r.questionId)) {
				deletes.push({actionType: 'DELETE', questionId: r.questionId})
			}
		})

		edited.forEach((ele) => {
			let id = ele.questionId;
			let type = id === undefined || id === null ? 'CREATE' : 'UPDATE'

			if (type === 'CREATE') {
				let options = []
				ele.choices.forEach((cho) => options.push({answerOptionText: cho.text, isCorrect: cho?.isCorrect ?? false}))

				if(options.length !== 0) {
					newQuestions.push({
						questionText: ele.title,
						answerOptions: options
					})
				}
			} else if (type === 'UPDATE') {
				let options = []
				ele.choices.forEach((cho) => options.push({answerOptionText: cho.text, isCorrect: cho?.isCorrect ?? false}))

				let toBe = {
					actionType: "UPDATE",
					questionId: id,
					updateQuestion: {
						questionText: ele.title,
						answerOptions: options
					}
				}

				updateQuestions.push(toBe)
			}
		});

		updateQuestions.forEach(i => result.push(i))
		if(newQuestions.length !== 0) {
			result.push({
				actionType: "CREATE",
				newQuestions: newQuestions
			})
		}
		deletes.forEach(i => result.push(i))

		console.log(result)
		return result;
	}

	//True if they are the same
	static compareQuestions(old, edit){
		if(old.questionText !== edit.title){
			return false;
		}

	/*	old.questions.forEach((r) => {


		})*/

	}


}
