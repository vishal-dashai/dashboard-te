export class Answer implements IAnswer {

	isCorrect: boolean;
	answerOptionText: string;

	constructor(answerOptionText: string, isCorrect: boolean) {
		this.isCorrect = isCorrect;
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
