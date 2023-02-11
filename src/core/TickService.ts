import * as THREE from 'three';
import { Main } from './Main';

export class TickService {
	main: Main;
	clock = new THREE.Clock();
	game_callbacks: Function[] = [];
	ui_callbacks: Function[] = [];

	/**
	 * State
	 * */
	pausedTick = false;
	pausedUI = false;
	lastTimeUpdate: number = 0;

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

		// Pause Game Feature
		if (!this.pausedTick) {
			this.game_callbacks.forEach((callback: Function) => callback.bind(this, { elapsedTime, deltaTime })());
		}

		// Pause UI Feature
		if (!this.pausedUI) {
			this.ui_callbacks.forEach((callback: Function) => callback.bind(this, { elapsedTime, deltaTime })());
		}

		// Loop
		window.requestAnimationFrame(this.tick.bind(this));

		// Render
		this.main.renderer.render(this.main.scene, this.main.s('Camera').mainCamera.threeCamera);
	};

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
	registerCallback = function (callback: Function, game = true) {
		if (game) this.game_callbacks.push(callback);
		else this.ui_callbacks.push(callback);
	};

	/**
	 * Deregister a Tick callback
	 * */
	deregisterCallback(callback: Function, game = true) {
		if (game) this.game_callbacks = this.game_callbacks.filter((thisCallback: Function) => thisCallback !== callback);
		else this.ui_callbacks = this.ui_callbacks.filter((thisCallback: Function) => thisCallback !== callback);
	}
}

export interface TickTimeProperties {
	elapsedTime: number;
	deltaTime: number;
}
