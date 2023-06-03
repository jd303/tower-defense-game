import { Level } from './Level';
import { Level0MVP } from './levels/Level_0_MVP';
import { Main } from '../core/Main';
import { FogOfWarService } from '../game/FogOfWarService';

export class LevelService {
	currentLevel: Level;
	main: Main;

	/**
	 * Declare levels
	 * */
	levels = [
		{
			name: 'Menu',
		},
		{
			name: '0mvp',
			object: Level0MVP,
		},
	];

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
				this.currentLevel = new Level0MVP(this.main);
				break;
		}

		// Fog of war
		const sFog: FogOfWarService = this.main.s('FogOfWar');
		//sFog.createFogOfWar();
		sFog.createFogOfWar();
	}
}
