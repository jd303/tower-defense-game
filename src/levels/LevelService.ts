import { Level } from './Level';
import { Main } from '../core/Main';
import { levelDetails as sandboxLevel } from './levels/Level_Sandbox';
import { levelDetails as level_0 } from './levels/Level_0';
import { levelDetails as level_1_1 } from './levels/Level_1_1';
import { levelDetails as level_1_2 } from './levels/Level_1_2';

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
			case '0_0':
				this.currentLevel = new Level(level_0, this.main);
				break;
			case '1_1':
				this.currentLevel = new Level(level_1_1, this.main);
				break;
			case '1_2':
				this.currentLevel = new Level(level_1_2, this.main);
				break;
			default:
				this.currentLevel = new Level(sandboxLevel, this.main);
				break;
		}

		return this.currentLevel;

		// Fog of war
		/*const sFog: FogOfWarService = this.main.s('FogOfWar');
		sFog.createFogOfWar();*/
	}
}
