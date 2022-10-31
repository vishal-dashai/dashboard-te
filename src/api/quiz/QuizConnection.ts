import TopicInfo from "../TopicInfo";
import {ILiveQuiz, LiveQuiz, Quiz} from "./Quiz";
import API from "../../api";

export class QuizConnection {

	static async loadQuizByTopic(topic: TopicInfo): Promise<LiveQuiz> {
		let quiz: ILiveQuiz = null;
		await fetch(`${API}/getQuizByRestTopic?` + new URLSearchParams({
			restaurantId: (topic.restaurant_id.toString()),
			topicId: topic.topicId.toString()
		}).toString(), {
			method: 'GET',
		}).then(e => e.json()).then(data => {
				console.log("QUIZ DATA IS HERE")
				console.log(data)
				if (data?.status !== 404 && data?.status !== 500 && data?.status !== 400) {
					quiz = JSON.parse(JSON.stringify(data));
				}
			}
		).catch(e => {
			console.log("Quiz loading error")
			console.log("ERROR: " + e)
		})
		return new LiveQuiz(quiz);
	}

	static compareAndBuildData(live: LiveQuiz, edited: Quiz) {
		let result = []
		let editIds: string[] = []
		let newQuestions: { questionText: any; answerOptions: any[]; }[] = []
		let updateQuestions: string[] = []
		let deletes: { actionType: string, questionId: string }[] = []

		edited.questions.forEach((ele) => {
			const r = ele.questionId;
			if (r !== null) editIds.push(r)
		});

		live.questions.forEach((r) => {
			if (!editIds.includes(r.questionId)) {
				deletes.push({actionType: 'DELETE', questionId: r.questionId})
			}
		})

		edited.questions.forEach((ele) => {
			let id = ele.questionId;
			let type = id === undefined || id === null ? 'CREATE' : 'UPDATE'

			if (type === 'CREATE') {
				/*let options = []
				ele.choices.forEach((cho) => options.push({
					answerOptionText: cho.text,
					isCorrect: cho?.isCorrect ?? false
				}))

				if (options.length !== 0) {
					newQuestions.push({
						questionText: ele.title,
						answerOptions: options
					})
				}*/
			} else if (type === 'UPDATE') {
			/*	let options = []
				ele.choices.forEach((cho) => options.push({
					answerOptionText: cho.text,
					isCorrect: cho?.isCorrect ?? false
				}))

				let toBe = {
					actionType: "UPDATE",
					questionId: id,
					updateQuestion: {
						questionText: ele.title,
						answerOptions: options
					}
				}*/

				// updateQuestions.push(JSON.stringify(toBe))
			}
		});

		updateQuestions.forEach(i => result.push(i))
		if (newQuestions.length !== 0) {
			result.push({
				actionType: "CREATE",
				newQuestions: newQuestions
			})
		}
		deletes.forEach(i => result.push(i))

		console.log(result)
		return result;
	}

}
