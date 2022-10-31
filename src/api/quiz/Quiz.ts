import {IQuestion, LiveQuestion, Question} from "./Question";

export class Quiz implements IQuiz {

	public name: string;
	topicId: string;
	questions: Question[];

	constructor(name: string, topicId: string, questions: Question[]) {
		this.name = name;
		this.topicId = topicId;
		this.questions = questions;
	}
}

export class LiveQuiz implements IQuiz {

	public name: string;
	quizId: string;
	restaurantId: string;
	topicId: string;
	numQuestions: number;
	totalScore: number;
	questions: LiveQuestion[];

	constructor(name: string, quizId: string, restaurantId: string, topicId: string, numQuestions: number, totalScore: number, questions: LiveQuestion[]) {
		this.name = name;
		this.quizId = quizId;
		this.restaurantId = restaurantId;
		this.topicId = topicId;
		this.numQuestions = numQuestions;
		this.totalScore = totalScore;
		this.questions = questions;
	}

	public toEditable(): Quiz {
		return new Quiz(this.name, this.topicId, this.questions.map((a) => a.toQuestion()));
	}
}

export interface IQuiz {

	name: string;
	questions: IQuestion[];

}
