import {Dispatch} from "react";

export class Answer implements IAnswer {

	isCorrect: boolean;
	answerOptionText: string;
	choiceId: number;

	constructor(answerOptionText: string, isCorrect: boolean, choiceId: number) {
		this.isCorrect = isCorrect;
		this.choiceId = choiceId;
		this.answerOptionText = answerOptionText;
	}

}

export class LiveAnswer implements IAnswer {

	isCorrect: boolean;
	answerOptionText: string;
	answerOptionId: string;

	constructor(answerOptionText: string, isCorrect: boolean, optionId: string) {
		this.isCorrect = isCorrect;
		this.answerOptionText = answerOptionText;
		this.answerOptionId = optionId;
	}
}

export interface IAnswer {

	answerOptionText: string;
	isCorrect: boolean;

}
