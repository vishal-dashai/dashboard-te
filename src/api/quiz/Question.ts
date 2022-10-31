import {Answer, IAnswer, LiveAnswer} from "./Answer";
import {Dispatch} from "react";

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

	updateOptions(a: Dispatch<Answer[]>): string {
		return a.call(this.answerOptions);
	}

}

export class LiveQuestion implements ILiveQuestion {

	questionId: string;
	answerOptions: LiveAnswer[];
	questionText: string;
	correctAnswerId: string;

	constructor(data: ILiveQuestion) {
		this.answerOptions = data.answerOptions;
		this.correctAnswerId = data.correctAnswerId;
		this.questionText = data.questionText;
		this.questionId = data.questionId;
	}

	public toQuestion(): Question {
		let t: Answer[] = [];
		let i: number = 0;
		let n = 0;
		let ans = this.answerOptions;
		ans.forEach((r) => t.push(new Answer(r.answerOptionText, r.answerOptionId === this.correctAnswerId, n++)))
		let quest = new Question(this.questionText, t, i++);
		quest.questionId = this.questionId ?? null;
		return quest;
	}

}

export interface ILiveQuestion {

	questionId: string;
	answerOptions: LiveAnswer[];
	questionText: string;
	correctAnswerId: string;

}


export interface IQuestion {

	questionText: string;
	answerOptions: IAnswer[];

}
