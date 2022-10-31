import {ILiveQuestion, IQuestion, LiveQuestion, Question} from "./Question";

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

export class LiveQuiz implements ILiveQuiz {

	public name: string;
	quizId: string;
	restaurantId: string;
	topicId: string;
	numQuestions: number;
	totalScore: number;
	questions: ILiveQuestion[];

	constructor(private data: ILiveQuiz) {
		this.name = data.name;
		this.quizId = data.quizId;
		this.restaurantId = data.restaurantId;
		this.topicId = data.topicId;
		this.numQuestions = data.numQuestions;
		this.totalScore = data.totalScore;
		this.questions = data.questions;
	}

	public toEditable(): Quiz {
		return new Quiz(this.name, this.topicId, this.questions.map((a) => {
			return new LiveQuestion(a).toQuestion();//TODO lets skip the middleman at some point
		}));
	}
}

export interface ILiveQuiz {

	name: string;
	quizId: string;
	restaurantId: string;
	topicId: string;
	numQuestions: number;
	totalScore: number;
	questions: ILiveQuestion[];

}

export interface IQuiz {

	name: string;
	questions: IQuestion[];

}
