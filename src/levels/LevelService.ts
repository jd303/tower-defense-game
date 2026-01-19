import { Level } from './Level';
import { Main } from '../core/Main';
import { levelDetails as level0 } from './levels/Level_0_MVP_JSON';
import { levelDetails as level1 } from './levels/Level_1_MVP_JSON';

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
	loadLevel(levelName: string) {
		console.log('Load Level', levelName);

		switch (levelName) {
			case 'Level_1':
				this.currentLevel = new Level(level1, this.main);
				break;
			default:
				this.currentLevel = new Level(level0, this.main);
				break;
		}

		return this.currentLevel;

		// Fog of war
		/*const sFog: FogOfWarService = this.main.s('FogOfWar');
		sFog.createFogOfWar();*/
	}
}
