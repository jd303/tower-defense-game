import * as lil from 'lil-gui';
import { Tick } from './Tick';

export class DebugFeatures {
	/**
	 * Properties
	 * */
	lilGUI: lil.GUI;

	/**
	 * Constructor
	 * */
	constructor(debugMode: boolean, tick: Tick) {
		if (debugMode) {
			this.lilGUI = new lil.GUI();

			this.lilGUI.add(tick, 'pauseGame').name('Pause Game');
			this.lilGUI.add(tick, 'unpauseGame').name('Unpause Game');
		}

		return this;
	}

	/**
	 * Adds a debug number control
	 * */
	addDebugNumber(objectParent: any, property: string, min: number, max: number, step: number, name: string | null) {
		this.lilGUI
			.add(objectParent, property)
			.min(min)
			.max(max)
			.step(step)
			.name(name || property);
	}

	addGUIDebugProperty(objectParent: any, property: string, options: any = null) {
		const debugItem = this.lilGUI.add(objectParent, property).name(options?.name || property);

		if (options !== null) {
			console.log(debugItem);
			if (options.min) debugItem.min(options.min);
			if (options.max) debugItem.min(options.max);
			if (options.step) debugItem.min(options.step);
		}
	}

	addGUIDebugFunction(objectParent: any, property: string, callback: Function, name: string | null = null) {
		this.lilGUI.add(objectParent, property).name(name || property);
	}
}
