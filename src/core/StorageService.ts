import { StorageKey } from '../config/storageKeys';
import { Main } from '../core/Main';

export class StorageService {
	/**
	 * System Properties
	 */
	main: Main;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Reads loadout from storage
	 */
	async read(storageKey: StorageKey) {
		return localStorage.getItem(storageKey);
	}

	/**
	 * Writes data
	 */
	async write(storageKey: StorageKey, jsonString: string) {
		try {
			await localStorage.setItem(storageKey, jsonString);
			return true;
		} catch (e) {
			return false;
		}
	}
}