import { DebugService } from '../core/DebugService';
import { LightingService } from '../core/LightingService';
import { Main } from '../core/Main';
import { TickService } from '../core/TickService';
import { InteractionService2 } from '../game/InteractionService2';
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
	disposeScreenCommons() {
		const sLighting: LightingService = this.main.s('Lighting');
		const sUI: UIService = this.main.s('UI');
		const sTick: TickService = this.main.s('Tick');
		const sInteraction: InteractionService2 = this.main.s('Interaction2');

		this.stopTick();
		sLighting.disposeAll();
		sUI.clearUI();
		sTick.end();
		sInteraction.clearAll();

		if (this.main.debugMode) {
			const sDebug: DebugService = this.main.s('Debug');
			sDebug.createLilGUI();
		}
	}

	/**
	 * Overridden - Loads the screen
	 */
	loadScreen(screenArgument?: string) { }

	/**
	 * Overriden - Disposes all assets
	 */
	dispose() {
		this.disposeScreenCommons();
	}
}