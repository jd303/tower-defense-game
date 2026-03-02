import { Level } from './Level';
import { Main } from '../core/Main';

export class LevelService {
	currentLevel: Level;
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Loads a level and logic
	 * */
	async loadLevel(levelID: string) {
		console.log('Load Level', levelID);

		const levelDetails = await this.loadLevelData(levelID);
		this.currentLevel = new Level(levelDetails, this.main);
		return this.currentLevel;

		// Fog of war
		/*const sFog: FogOfWarService = this.main.s('FogOfWar');
		sFog.createFogOfWar();*/
	}

	/**
	 * Load the level data for a level
	 */
	async loadLevelData(levelID: string) {
		let levelData;

		switch (levelID) {
			case '0_0':
				levelData = await import(`./levels/Level_0`);
				break;
			case '1_1':
				levelData = await import(`./levels/Level_1_1`);
				break;
			case '1_2':
				levelData = await import(`./levels/Level_1_2`);
				break;
			case '2_1':
				levelData = await import(`./levels/Level_2_1`);
				break;
			default:
				levelData = await import(`./levels/Level_Sandbox`);
				break;
		}

		return levelData.levelDetails;
	}
}
