export default class TopicInfo {

	name: string;
	restaurantID: number;
	topicID: number;

	constructor(name: string, restaurantID: number, topicID: number) {
		this.name = name;
		this.restaurantID = restaurantID;
		this.topicID = topicID;
	}

	/*	static parseArray(data) {
			const top = [];
			for (let i in data) {
				const theTopic = new TopicInfo(data[i]);
				top.push(theTopic);
			}
			return top;
		}*/
}


