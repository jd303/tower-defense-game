export class Timer {
	timer: any;
	durationInMS: number;
	startTime: number;
	pauseStartTime: number;
	callback: Function;

	/**
	 * Constructor
	 * */
	constructor(callback: Function, durationInMS: number) {
		this.durationInMS = durationInMS;
		this.callback = callback;
		this.set(durationInMS);
	}

	/**
	 * Sets the timer
	 * */
	set(durationInMS: number) {
		this.timer = setTimeout(this.callback, durationInMS);
	}

	/**
	 * Pauses the timer
	 * */
	pause() {
		clearTimeout(this.timer);
		this.pauseStartTime = new Date().getTime();
	}

	/**
	 * Unpauses the timer
	 * */
	unpause() {
		const elapsed = this.pauseStartTime - this.startTime;
		const newDuration = this.durationInMS - elapsed;
		this.set(newDuration);
	}

	/**
	 * Clears and removes the Timer
	 * */
	dispose() {
		clearTimeout(this.timer);
	}
}
