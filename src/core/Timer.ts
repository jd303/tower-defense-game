import { Main } from "./Main";
import { TickService } from "./TickService";

/**
 * Creates a Timer that is based on the TickService's gameTime
 * This allows pause events to halt the Timer
 * */
export class Timer {
	tickService: TickService;
	durationInMS: number;
	completeGameTime: number;
	callback: Function;

	/**
	 * Constructor
	 * */
	constructor(callback: Function, durationInMS: number, main: Main) {
		this.durationInMS = durationInMS;
		this.callback = callback;
		this.tickService = main.s('Tick');
		
		const gameTime = this.tickService.gameTime;
		this.completeGameTime = gameTime + durationInMS / 1000;
		this.tickService.registerTimer(this, true);
	}

	/**
	 * Triggers the Timer callback
	 * */
	trigger() {
		this.callback();
		this.tickService.deregisterTimer(this);
	}

	/**
	 * Clears and removes the Timer
	 * */
	dispose() {
		console.log("%c !!!!!!!! Is this still here?  This should be REMOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOVED", "color: red");
		//clearTimeout(this.timer);
	}
}
