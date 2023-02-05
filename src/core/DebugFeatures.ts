import * as lil from 'lil-gui';
import { Light } from '../LightingManager';
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
	addDebugNumber(args: { folder: any; objectParent: any; property: string; min: number; max: number; step: number; name: string | null }) {
		let parent;
		if (args.folder) {
			parent = args.folder;
		} else {
			parent = this.lilGUI;
		}

		parent
			.add(args.objectParent, args.property)
			.min(args.min)
			.max(args.max)
			.step(args.step)
			.name(args.name || args.property);
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

	/**
	 * Adds typical debugs for lights
	 * */
	debugLight(light: Light, label: string) {
		const folder = this.lilGUI.addFolder(label);
		folder.open(false);
		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight,
			property: 'intensity',
			min: 0,
			max: 5,
			step: 0.001,
			name: `${label} Intensity`,
		});
		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight.position,
			property: 'x',
			min: -50,
			max: 50,
			step: 0.001,
			name: `${label} x`,
		});
		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight.position,
			property: 'y',
			min: -50,
			max: 50,
			step: 0.001,
			name: `${label} y`,
		});
		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight.position,
			property: 'z',
			min: -50,
			max: 50,
			step: 0.001,
			name: `${label} z`,
		});
	}
}
