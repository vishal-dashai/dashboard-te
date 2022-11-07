import API from "../api";
import {IScoreInfo, IUser} from "./Data";

export class ContentRequest {

	static async getUserProfile(userId: string): Promise<IUser> {
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

	static async getAllScores(restaurantId: string): Promise<IScoreInfo[]> {
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

	static async getAndStripNote(restaurantId: string): Promise<string> {
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

}
