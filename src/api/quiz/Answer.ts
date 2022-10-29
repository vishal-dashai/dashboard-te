export class Answer implements IAnswer {

	isCorrect: boolean;
	text: string;
	id: string;

	constructor(text: string, isCorrect: boolean, id: string) {
		this.isCorrect = isCorrect;
		this.text = text;
		this.id = id;
	}

}

export class LiveAnswer implements IAnswer {

	isCorrect: boolean;
	text: string;
	optionId: string;

	constructor(text: string, isCorrect: boolean, optionId: string) {
		this.isCorrect = isCorrect;
		this.text = text;
		this.optionId = optionId;
	}
}

export interface IAnswer {

	text: string;
	isCorrect: boolean;

}
