import * as THREE from 'three';
import { Main } from './Main';

export class TickService {
	main: Main;
	clock = new THREE.Clock();
	tickFrameCallbacksGame: Function[] = [];
	tickFrameCallbacksUI: Function[] = [];
	tickSecCallbacksGame: Function[] = [];
	tickSecCallbacksUI: Function[] = [];
	tickHalfSecCallbacksGame: Function[] = [];
	tickHalfSecCallbacksUI: Function[] = [];

	/**
	 * State
	 * */
	pausedTick = false;
	pausedUI = false;
	lastTimeUpdate: number = 0;
	lastTickSecs: number = 0;
	lastTickHalfSecs: number = 0;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Animates and updates objects
	 * */
	tick = function () {
		const elapsedTime = this.clock.getElapsedTime();
		const deltaTime = elapsedTime - this.lastTimeUpdate;
		this.lastTimeUpdate = elapsedTime;
		const { isTickSecond, isTickHalfSecond } = this.checkTickFraction(deltaTime);

		// Loop
		window.requestAnimationFrame(this.tick.bind(this));

		// Render
		this.main.renderer.render(this.main.scene, this.main.s('Camera').mainCamera.threeCamera);

		// Tick Game Callback
		if (!this.pausedTick) {
			this.runTickAnimations(this.tickFrameCallbacksGame, elapsedTime, deltaTime);
			if (isTickSecond) this.runTickAnimations(this.tickSecCallbacksGame, elapsedTime, deltaTime, 'Sec');
			if (isTickHalfSecond) this.tickHalfSeconds(this.tickHalfSecCallbacksGame, elapsedTime, deltaTime, 'Halfsec');
		}

		// Tick UI Callback
		if (!this.pausedUI) {
			this.runTickAnimations(this.tickFrameCallbacksUI, elapsedTime, deltaTime);
			if (isTickSecond) this.runTickAnimations(this.tickSecCallbacksUI, elapsedTime, deltaTime, 'Sec');
			if (isTickHalfSecond) this.tickHalfSeconds(this.tickHalfSecCallbacksUI, elapsedTime, deltaTime, 'Halfsec');
		}
	};

	/**
	 * Checks delta time for second fractions
	 * */
	checkTickFraction(deltaTime: number) {
		this.lastTickSecs += deltaTime;
		this.lastTickHalfSecs += deltaTime;

		let isSec = false;
		let isHalfSec = false;

		if (this.lastTickSecs > 1) {
			isSec = true;
			this.lastTickSecs = 0;
		}

		if (this.lastTickHalfSecs > 0.5) {
			isHalfSec = true;
			this.lastTickHalfSecs = 0;
		}

		return { isSec, isHalfSec };
	}

	/**
	 * Runs animations on a given tick timeframe
	 * */
	runTickAnimations(callbacks: Function[], elapsedTime: number, deltaTime: number, time: string = 'frame') {
		callbacks.forEach((callback) => callback.bind(this, { elapsedTime, deltaTime })());
	}

	/**
	 * Pauses game objects
	 * */
	pauseTick() {
		this.pausedTick = true;
	}

	/**
	 * Unpauses game objects
	 * */
	unpauseTick() {
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
