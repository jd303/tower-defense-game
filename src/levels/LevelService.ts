import { Level } from './Level';
import { Level0MVP } from './levels/Level_0_MVP';
import { Main } from '../core/Main';

export class LevelService {
	currentLevel: Level;
	main: Main;

	levels = [
		{
			name: 'Menu',
		},
		{
			name: '0mvp',
			object: Level0MVP,
		},
	];

	constructor(main: Main) {
		this.main = main;
	}

	unloadScene() {}

	loadScene(levelName: string) {
		console.log('Load Level', levelName);

		switch (levelName) {
			case 'Level_0_MVP':
				this.currentLevel = new Level0MVP(this.main);
				break;
		}
	}
}
