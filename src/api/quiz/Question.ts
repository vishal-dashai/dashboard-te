import {IAnswer} from "./Answer";

export class Question implements IQuestion {

	choices: IAnswer[];
	text: string;

	constructor(text: string, choices: IAnswer[]) {
		this.choices = choices;
		this.text = text;
	}
}

export class LiveQuestion implements IQuestion {

	questionId: string;
	choices: IAnswer[];
	text: string;

	constructor(text: string, questionId: string, choices: IAnswer[]) {
		this.choices = choices;
		this.text = text;
		this.questionId = questionId;
	}

}

export interface IQuestion {

	text: string;
	choices: IAnswer[];

}
