import {IQuestion} from "./Question";

export class Quiz implements IQuiz {

	title: string;
	topicId: string;
	questions: IQuestion[];

	constructor(title: string, topicId: string, questions: IQuestion[]) {
		this.title = title;
		this.topicId = topicId;
		this.questions = questions;
	}
}

export class LiveQuiz implements IQuiz {

	title: string;
	quizId: string;
	restaurantId: string;
	topicId: string;
	numQuestions: number;
	totalScore: number;
	questions: IQuestion[];

	constructor(title: string, quizId: string, restaurantId: string, topicId: string, numQuestions: number, totalScore: number, questions: IQuestion[]) {
		this.title = title;
		this.quizId = quizId;
		this.restaurantId = restaurantId;
		this.topicId = topicId;
		this.numQuestions = numQuestions;
		this.totalScore = totalScore;
		this.questions = questions;
	}
}

export interface IQuiz {

	title: string;
	questions: IQuestion[];

}
