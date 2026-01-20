import { Level } from './Level';
import { Main } from '../core/Main';
import { levelDetails as sandboxLevel } from './levels/Level_Sandbox';
import { levelDetails as level1 } from './levels/Level_Test_1';
import { levelDetails as level2 } from './levels/Level_Test_2';

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
			case 'Level_2':
				this.currentLevel = new Level(level2, this.main);
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
