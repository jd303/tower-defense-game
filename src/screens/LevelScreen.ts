import { Main } from '../core/Main';
import { UIRegions } from '../game/UIProperties';
import { UIService } from '../game/UIService';
import { Level } from '../levels/Level';
import { LevelService } from '../levels/LevelService';
import { Screen } from '../screens/Screen';

export class LevelScreen extends Screen {

	/**
	 * Core
	 */
	level: Level;

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		super(main);

		this.loadLevel();
	}

	/**
	 * Loads the level
	 */
	loadLevel() {
		const sLevel: LevelService = this.main.s('Level');
		this.level = sLevel.loadLevel('Level_1');
		this.createUI();
		this.startTick();
	}

	/**
	 * Go UI!
	 */
	createUI() {
		const sUI: UIService = this.main.s('UI');
		const button = sUI.createIconButton('assets/common/ico.home.png', UIRegions.Menu);
		button.addClickBehaviour(() => {
			window.location.hash = 'map';
		});
		sUI.addButtonToUI(button);
	}

	/**
	 * Disposes of everything
	 */
	dispose() {
		this.disposeLevelCommons();
		this.level.disposeLevel();

	}
}