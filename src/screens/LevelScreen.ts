import { Main } from '../core/Main';
import { UIRegions } from '../game/UIProperties';
import { UIService } from '../game/UIService';
import { Level } from '../levels/Level';
import { LevelService } from '../levels/LevelService';
import { Screen } from '../screens/Screen';
import { LevelPausePopup } from './LevelPausePopup';

export class LevelScreen extends Screen {

	/**
	 * Core
	 */
	levelCode: string;
	level: Level;

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		super(main);
	}

	/**
	 * Loads the screen
	 */
	async loadScreen(levelCode: string) {
		this.levelCode = levelCode;
		await this.loadLevel();
	}

	/**
	 * Loads the level
	 */
	async loadLevel() {
		const sLevel: LevelService = this.main.s('Level');
		this.level = await sLevel.loadLevel(this.levelCode);
		this.createUI();
		this.startTick();
	}

	/**
	 * Go UI!
	 */
	createUI() {
		const sUI: UIService = this.main.s('UI');
		const button = sUI.createIconButton('assets/common/ico.home.png', UIRegions.TopLeft);
		button.addClickBehaviour(this.confirmExitLevel.bind(this));
		sUI.addButtonToUI(button);
	}

	/**
	 * Confirms that the user wants to leave the level
	 */
	confirmExitLevel() {
		const sUI: UIService = this.main.s('UI');
		const popup: LevelPausePopup = sUI.openPopup(LevelPausePopup, 'pause') as LevelPausePopup;
		//const popup: LevelPausePopup = this.popupManager.openPopup(LevelPausePopup, 'pause') as LevelPausePopup;
		popup.setLevel(this.level);
		popup.setOnCloseCallback(() => this.level.setPaused(false));
		this.level.setPaused(true);
	}

	/**
	 * Disposes of everything
	 */
	dispose() {
		this.disposeScreenCommons();
		this.level.disposeLevel();
	}
}