import { Level } from './Level';
import { Main } from '../core/Main';
import { levelDetails } from './levels/Level_1_MVP_JSON';

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
			case 'Level_0_MVP':
				this.currentLevel = new Level(levelDetails, this.main);
				break;
		}

		// Fog of war
		/*const sFog: FogOfWarService = this.main.s('FogOfWar');
		sFog.createFogOfWar();*/
	}
}
