import * as THREE from 'three';
import { Main } from './Main';
import { Timer } from './Timer';
import { Service } from './Service';

export class TickService extends Service {
	main: Main;
	clock = new THREE.Clock();
	tickFrameCallbacksGame: TickCallback[] = [];
	tickFrameCallbacksUI: TickCallback[] = [];
	tickSecCallbacksGame: TickCallback[] = [];
	tickSecCallbacksUI: TickCallback[] = [];
	tickHalfSecCallbacksGame: TickCallback[] = [];
	tickHalfSecCallbacksUI: TickCallback[] = [];
	timersGame: Timer[] = [];
	timersUI: Timer[] = [];

	/**
	 * State
	 * */
	gameTime: number = 0;
	pausedTick = false;

	/**
	 * Debugs
	 * */
	masterSpeed: TickSpeed = TickSpeed.default;
	previousMasterSpeed: TickSpeed = TickSpeed.default;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
	}

	/**
	 * Starts the Tick Service
	 * */
	start() {
		this.clock.start();
		this.gameTime = 0;
		this.tick();
	}

	/**
	 * Starts the Tick Service
	 * */
	end() {
		this.pauseTick();
		this.tickFrameCallbacksGame = [];
		this.tickFrameCallbacksUI = [];
		this.tickSecCallbacksGame = [];
		this.tickSecCallbacksUI = [];
		this.tickHalfSecCallbacksGame = [];
		this.tickHalfSecCallbacksUI = [];
		this.timersGame = [];
		this.timersUI = [];
	}

	/**
	 * Animates and updates objects
	 * */
	tick = function () {

		// If running
		if (!this.pausedTick) {
			// Setup time properties
			const deltaTime = this.clock.getDelta() * this.masterSpeed;
			this.gameTime += deltaTime;
			const { isTickSecond, isTickHalfSecond } = this.checkTickFraction(deltaTime);

			// Tick Game Callback
			this.runTickAnimations(this.tickFrameCallbacksGame, this.gameTime, deltaTime);
			this.runGameTimers();
			if (isTickSecond) this.runTickAnimations(this.tickSecCallbacksGame, this.gameTime, deltaTime, 'Sec');
			if (isTickHalfSecond) this.runTickAnimations(this.tickHalfSecCallbacksGame, this.gameTime, deltaTime, 'Halfsec');

			// Tick UI Callback
			this.runTickAnimations(this.tickFrameCallbacksUI, this.gameTime, deltaTime);
			this.runUITimers();
			if (isTickSecond) this.runTickAnimations(this.tickSecCallbacksUI, this.gameTime, deltaTime, 'Sec');
			if (isTickHalfSecond) this.runTickAnimations(this.tickHalfSecCallbacksUI, this.gameTime, deltaTime, 'Halfsec');
		}

		// Render
		this.main.renderer.render(this.main.scene, this.main.s('Camera').mainCamera.threeCamera);

		// Loop
		window.requestAnimationFrame(this.tick.bind(this));
	};

	/**
	 * Checks delta time for second fractions
	 * */
	checkTickFraction() {
		const accuracy = 0.01;

		const isTickSecond = Math.abs(this.gameTime - Math.round(this.gameTime)) <= accuracy;
		const isTickHalfSecond = Math.abs(this.gameTime - Math.round(this.gameTime * 2) / 2) <= accuracy;

		return { isTickSecond, isTickHalfSecond };
	}

	/**
	 * Runs animations on a given tick timeframe
	 * */
	runTickAnimations(callbacks: TickCallback[], elapsedTime: number, deltaTime: number, time: string = 'frame') {
		callbacks.forEach((callback) => callback.callback.bind(this, { elapsedTime, deltaTime })());
	}

	/**
	 * Check and trigger Game Timers
	 * */
	runGameTimers() {
		this.timersGame.forEach(timer => {
			if (timer.completeGameTime <= this.gameTime) timer.trigger();
		});
	}

	/**
	 * Check and trigger UI Timers
	 * */
	runUITimers() {
	}

	/**
	 * Gets the current game time
	 * */
	getCurrentGameTime() {
		return this.gameTime;
	}

	/**
	 * Pauses game objects
	 * */
	pauseTick() {
		this.clock.stop();
		this.pausedTick = true;
	}

	/**
	 * Unpauses game objects
	 * */
	unpauseTick() {
		this.clock.start();
		this.pausedTick = false;
	}

	/**
	 * Unpauses game objects
	 * */
	setGameSpeed(gameSpeed?: TickSpeed) {
		if (gameSpeed) {
			this.previousMasterSpeed = this.masterSpeed;
			this.masterSpeed = gameSpeed;
		} else {
			this.masterSpeed = this.previousMasterSpeed;
		}
	}

	/**
	 * Register a Tick callback
	 * */
	registerCallback = function (callback: TickCallback, gameCallback = true, time: TickTimeTypes = TickTimeTypes.frame) {
		let destinationArray;

		if (gameCallback) {
			if (time == TickTimeTypes.frame) destinationArray = this.tickFrameCallbacksGame;
			if (time == TickTimeTypes.second) destinationArray = this.tickSecCallbacksGame;
			if (time == TickTimeTypes.halfsecond) destinationArray = this.tickHalfSecCallbacksGame;
		}

		if (!gameCallback) {
			if (time == TickTimeTypes.frame) destinationArray = this.tickFrameCallbacksUI;
			if (time == TickTimeTypes.second) destinationArray = this.tickSecCallbacksUI;
			if (time == TickTimeTypes.halfsecond) destinationArray = this.tickHalfSecCallbacksUI;
		}

		destinationArray.push(callback);
	};

	/**
	 * Deregister a Tick callback
	 * */
	deregisterCallback(callbackName: string, game = true) {
		if (game) {
			this.tickFrameCallbacksGame = this.tickFrameCallbacksGame.filter((thisCallback: TickCallback) => thisCallback.name !== callbackName);
			this.tickHalfSecCallbacksGame = this.tickHalfSecCallbacksGame.filter((thisCallback: TickCallback) => thisCallback.name !== callbackName);
			this.tickSecCallbacksGame = this.tickSecCallbacksGame.filter((thisCallback: TickCallback) => thisCallback.name !== callbackName);
		}
		else {
			this.tickFrameCallbacksUI = this.tickFrameCallbacksUI.filter((thisCallback: TickCallback) => thisCallback.name !== callbackName);
			this.tickHalfSecCallbacksUI = this.tickHalfSecCallbacksUI.filter((thisCallback: TickCallback) => thisCallback.name !== callbackName);
			this.tickSecCallbacksUI = this.tickSecCallbacksUI.filter((thisCallback: TickCallback) => thisCallback.name !== callbackName);
		}
	}

	/**
	 * Register a Timer which clears when run
	 * */
	registerTimer(timer: Timer, game = true) {
		if (game) this.timersGame.push(timer);
		else this.timersUI.push(timer);
	}

	/**
	 * Register a Timer which clears when run
	 * */
	deregisterTimer(removedTimer: Timer) {
		this.timersGame = this.timersGame.filter(timer => timer !== removedTimer);
	}
}

export class TickCallback {
	name: string;
	callback: Function;

	constructor(name: string, callback: Function) {
		this.name = name;
		this.callback = callback;
	}
}

export interface TickTimeProperties {
	elapsedTime: number;
	deltaTime: number;
}

export enum TickSpeed {
	slowest = 0.1,
	slower = 0.33,
	slow = 0.5,
	default = 1,
	fast = 2,
	faster = 2.5,
	fastest = 3
}

export enum TickTimeTypes {
	frame = "frame",
	second = "second",
	halfsecond = "halfsecond",
}
