import * as THREE from 'three';
import { Main } from './Main';
import { Timer } from './Timer';

export class TickService {
	main: Main;
	clock = new THREE.Clock();
	tickFrameCallbacksGame: Function[] = [];
	tickFrameCallbacksUI: Function[] = [];
	tickSecCallbacksGame: Function[] = [];
	tickSecCallbacksUI: Function[] = [];
	tickHalfSecCallbacksGame: Function[] = [];
	tickHalfSecCallbacksUI: Function[] = [];
	timersGame: Timer[] = [];
	timersUI: Timer[] = [];

	/**
	 * State
	 * */
	gameTime: number = 0;
	pausedTick = false;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
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
			const deltaTime = this.clock.getDelta();
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
	runTickAnimations(callbacks: Function[], elapsedTime: number, deltaTime: number, time: string = 'frame') {
		callbacks.forEach((callback) => callback.bind(this, { elapsedTime, deltaTime })());
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
	 * Register a Tick callback
	 * */
	registerCallback = function (callback: Function, gameCallback = true, time: TickTimeTypes = TickTimeTypes.frame) {
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
	deregisterCallback(callback: Function, game = true) {
		if (game) this.tickFrameCallbacksGame = this.tickFrameCallbacksGame.filter((thisCallback: Function) => thisCallback !== callback);
		else this.tickFrameCallbacksUI = this.tickFrameCallbacksUI.filter((thisCallback: Function) => thisCallback !== callback);
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

export interface TickTimeProperties {
	elapsedTime: number;
	deltaTime: number;
}

export enum TickTimeTypes {
	frame,
	second,
	halfsecond,
}
