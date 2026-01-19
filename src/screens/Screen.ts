import { LightingService } from '../core/LightingService';
import { Main } from '../core/Main';
import { TickService } from '../core/TickService';
import { UIService } from '../game/UIService';

export class Screen {
	/**
	 * System Properties
	 * */
	main: Main;


	/**
	 * Properties
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Starts the tick
	 */
	startTick() {
		const sTick = this.main.s('Tick');
		sTick.start();
	}

	/**
	 * Stops the tick
	 */
	stopTick() {
		const sTick = this.main.s('Tick');
		sTick.end();
	}

	/**
	 * Disposes and removes all common screen items
	 */
	disposeLevelCommons() {
		const sLighting: LightingService = this.main.s('Lighting');
		const sUI: UIService = this.main.s('UI');
		const sTick: TickService = this.main.s('Tick');

		this.stopTick();
		sLighting.disposeAll();
		sUI.clearUI();
		sTick.end();
	}

	/**
	 * Overridden - Loads the screen
	 */
	load() { }

	/**
	 * Overriden - Disposes all assets
	 */
	dispose() {
		this.disposeLevelCommons();
	}
}