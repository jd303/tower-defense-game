import { Main } from '../../core/Main';
import { EventService } from '../../core/EventService';
import { UserProgress } from './UserProgress';
import { newUserData } from './_userProgressData';
import { StorageService } from '../../core/StorageService';
import { StorageKey } from '../../config/storageKeys';

export class ProgressDataService {
	/**
	 * System Properties
	 * */
	main: Main;
	progressData: UserProgress;

	storageKey: StorageKey = "user_progress";

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;
		this.loadProgressData();
	}

	/**
	 * Load and save data
	 */
	async loadProgressData() {
		const sStorage: StorageService = this.main.s('Storage');
		const progressData = await sStorage.read(this.storageKey);

		if (progressData) {
			console.log("%c Loading User Loadout from storage", "color: pink");
			this.progressData = new UserProgress(JSON.parse(progressData));
		} else {
			console.log("%c Loading User Loadout new user", "color: pink");
			this.progressData = new UserProgress(newUserData);
		}
	}
	async saveProgressData() {
		const sStorage: StorageService = this.main.s('Storage');
		await sStorage.write(this.storageKey, this.progressData.serialise());

		const sEvent: EventService = this.main.s('Event');
		sEvent.fire('user_progress_changed', this.progressData);
	}

	// Dev function
	async awaitDev() {
		console.log("%c Waiting for sProgressData.loadProgressData().  Temp solution, won't need to wait when the game follows the expected screen path", "color: pink");
		await this.loadProgressData();
	}

	/**
	 * Gets the user's Chronos / Upgrading data
	 */
	async getProgressData(): Promise<UserProgress> {
		return this.progressData;
	}

	/**
	 * Writes or removes level Ids from user Progress
	 */
	async updateLevelCompletion(levelId: string, completed: boolean) {
		if (completed) this.progressData.levelsCompleted.add(levelId);
		else this.progressData.levelsCompleted.delete(levelId);

		const sStorage: StorageService = this.main.s('Storage');
		sStorage.write(this.storageKey, this.progressData.serialise());
	}
}