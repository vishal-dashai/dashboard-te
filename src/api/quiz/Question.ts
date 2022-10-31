import {Answer, IAnswer, LiveAnswer} from "./Answer";

export class Question implements IQuestion {

	answerOptions: Answer[];
	questionId: string;
	questionText: string;
	id: number;

	constructor(questionText: string, answerOptions: Answer[], id: number) {
		this.answerOptions = answerOptions;
		this.id = id;
		this.questionText = questionText;
	}
}

export class LiveQuestion implements IQuestion {

	questionId: string;
	answerOptions: LiveAnswer[];
	questionText: string;
	correctAnswerId: string;

	constructor(questionText: string, questionId: string, correctAnswerId: string, answerOptions: LiveAnswer[]) {
		this.answerOptions = answerOptions;
		this.correctAnswerId = correctAnswerId;
		this.questionText = questionText;
		this.questionId = questionId;
	}

	public toQuestion(): Question {
		let t: Answer[] = [];
		let i: number = 0;
		let ans = this.answerOptions;
		ans.forEach((r) => t.push(new Answer(r.answerOptionText, r.answerOptionId === this.correctAnswerId)))
		let quest = new Question(this.questionText, t, i++);
		quest.questionId = this.questionId ?? null;
		return quest;
	}

}

export interface IQuestion {

	questionText: string;
	answerOptions: IAnswer[];

}
