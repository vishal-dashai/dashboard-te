export default class User {
	constructor(json) {
		if (json !== null) {
			this.currentPosition = json.currentPosition;
			this.email = json.email;
			this.isActive = json.isActive;
			this.name = json.name;
			this.profileImageURL = json.profileImageURL;
			this.restaurantId = json.restaurantId;
			this.userId = json.userId;
			this.restaurantName = json.restaurantName;
		}
	}
}
