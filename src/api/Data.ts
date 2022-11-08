export interface IUser {

	bio: string;
	currentPosition: string;
	email: string;
	isActive: boolean;
	name: string;
	profileImageURL: string;
	restaurantId: string;
	restaurantName: string;
	userId: string;

}

export class User implements IUser {

	bio: string;
	currentPosition: string;
	email: string;
	isActive: boolean;
	name: string;
	profileImageURL: string;
	restaurantId: string;
	restaurantName: string;
	userId: string;

	constructor(private data: IUser) {
		this.bio = data.bio;
		this.currentPosition = data.currentPosition;
		this.email = data.email;
		this.isActive = data.isActive;
		this.name = data.name;
		this.profileImageURL = data.profileImageURL;
		this.restaurantId = data.restaurantId;
		this.restaurantName = data.restaurantName;
		this.userId = data.userId;
	}

}


export interface IScoreInfo {

	certificate_url: string;
	restaurant_name: string;
	score_id: string;
	score_percentage: number;
	topic_name: string;
	user_id: string;
	user_name: string;

}
