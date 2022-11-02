import TopicInfo from "../TopicInfo";
import {ILiveQuiz, LiveQuiz, Quiz} from "./Quiz";
import API from "../../api";
import {Question} from "./Question";

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

	static validateQuiz(edited: Quiz): { message: string, errorQuestion: Question } | null {
		// let error: { message: string; errorQuestion: Question; } = null;

		for (let question of edited.questions) {
			if (!question.questionText) {
				return {
					message: "No question text! Please give this question a title or delete the question. Then publish again.",
					errorQuestion: question
				}
			}

			let hasAnswer = false;

			for (let answer of question.answerOptions) {
				if (answer.isCorrect) {
					hasAnswer = true;
				}
				if (!answer.answerOptionText) {
					return {
						message: "One or more answers does not have text. Please add text and then publish again.",
						errorQuestion: question
					}
				}
			}

			if (!hasAnswer) {
				return {
					message: "This question does not have an answer! Please add a correct answer or delete the question. Then publish again.",
					errorQuestion: question
				}
			}

		}
		return null;
	}

	static compareAndBuildData(live: LiveQuiz, edited: Quiz) {
		let result = []
		let editIds: string[] = []
		let newQuestions: { questionText: any; answerOptions: any[]; }[] = []
		let updateQuestions: {
			actionType: string,
			questionId: string,
			updateQuestion: {
				questionText: string,
				answerOptions: any[]
			}
		}[] = []
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
				let options: { answerOptionText: string; isCorrect: boolean; }[] = []
				ele.answerOptions.forEach((cho) => {
					if (cho.answerOptionText !== '') {
						options.push({
							answerOptionText: cho.answerOptionText,
							isCorrect: cho?.isCorrect ?? false
						})
					}
				})

				if (options.length !== 0) {
					newQuestions.push({
						questionText: ele.questionText,
						answerOptions: options
					})
				}
			} else if (type === 'UPDATE') {
				let options: { answerOptionText: string; isCorrect: boolean; }[] = []
				ele.answerOptions.forEach((cho) => {
					if (cho.answerOptionText !== '') {
						options.push({
							answerOptionText: cho.answerOptionText,
							isCorrect: cho?.isCorrect ?? false
						})
					}
				})

				updateQuestions.push({
					actionType: "UPDATE",
					questionId: id,
					updateQuestion: {
						questionText: ele.questionText,
						answerOptions: options
					}
				})
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
