import { UserLoadout } from './UserLoadout';

// TEMP
import { tempUserLoadoutData, newUserData } from './_userLoadoutData';

export class UserDataHandler {
	/**
	 * System Properties
	 * */
	maxHeroes: number = 1;
	maxPowers: number = 2;
	maxTowers: number = 3;

	/**
	 * Statics
	 */
	static storageKey = 'user_loadout';

	/**
	 * Constructor
	 */
	constructor() { }

	/**
	 * Reads loadout from storage
	 */
	async read() {
		if (!localStorage.getItem(UserDataHandler.storageKey)) {
			console.log("%c Loading from tempUserLoadoutData", "color: pink");
			return await new UserLoadout(tempUserLoadoutData);
		} else {
			const storageData = localStorage.getItem(UserDataHandler.storageKey);
			if (storageData) return await new UserLoadout(JSON.parse(storageData));
			else return new UserLoadout(newUserData);
		}
	}

	/**
	 * Writes data
	 */
	async write(userLoadout: UserLoadout) {
		await localStorage.setItem(UserDataHandler.storageKey, userLoadout.serialise());
	}
}