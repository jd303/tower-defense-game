export class UserProgress {
	levelsCompleted: Set<string>;

	constructor(data: UserProgressData) {
		this.levelsCompleted = new Set(data.levelsCompleted);
	}

	/**
	 * Serialises the data
	 */
	serialise() {
		// Create a clone, so that we can serialise any Sets
		const clone = JSON.parse(JSON.stringify(this));
		clone.levelsCompleted = [...this.levelsCompleted];

		return JSON.stringify(clone);
	}
}

export interface UserProgressData {
	levelsCompleted: Set<string>;
}