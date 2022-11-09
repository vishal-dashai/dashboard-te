import API from "../api";
import {IScoreInfo, IUser} from "./Data";
import TopicInfo from "./TopicInfo";
import {ILiveQuiz, LiveQuiz} from "./quiz/Quiz";

export class ContentRequest {

	static async getUserProfile(userId: string): Promise<IUser | null> {
		let userData: IUser;
		await fetch(`${API}/getUserProfileInfo/` + userId, {
			method: 'GET',
		}).then(d => d.json()).then((data) => {
			if (data?.status) {
				userData = null;
			} else {
				userData = JSON.parse(JSON.stringify(data));
			}
		}).catch((error) => {
			console.log(error)
			userData = null;
		})
		return userData;
	}

	static async getAllScores(restaurantId: string): Promise<IScoreInfo[] | null> {
		let scoreData: IScoreInfo[];
		await fetch(`${API}/getAllEmployeeScoresForRestaurant/${restaurantId}`, {
			method: 'GET',
		}).then(d => d.json()).then((data) => {
			if (data?.status) {
				scoreData = null;
			} else {
				scoreData = JSON.parse(JSON.stringify(data.scores));
			}
		}).catch((error) => {
			console.log(error)
			scoreData = null;
		})
		return scoreData;
	}

	static async getAndStripNote(restaurantId: string): Promise<string | null> {
		let content = null;
		await fetch(`${API}/getDailyNote/${restaurantId}`).then(e => e.json()).then(data => {
			if (!data?.status) {
				let note = data.note.replaceAll('<ul>', '')
				note = note.replaceAll('</ul>', '')
				let q = '';
				note.split('</li>').forEach((e: string) => {
					q += e.substring(4) + '\n';
				})

				content = q;
			}
		}).catch((e) => {
			console.log(e)
		});
		return content;
	}

	static async loadQuizByTopic(restaurantId: string, topicId: string): Promise<LiveQuiz | null> {
		let quiz: ILiveQuiz = null;
		await fetch(`${API}/getQuizByRestTopic?` + new URLSearchParams({
			restaurantId: restaurantId,
			topicId: topicId
		}).toString(), {method: 'GET'}).then(e => e.json()).then(data => {
				if (!data?.status) {
					quiz = JSON.parse(JSON.stringify(data));
				}
			}
		).catch(e => {
			console.log(e)
		})
		return quiz ? new LiveQuiz(quiz) : null;
	}

}
