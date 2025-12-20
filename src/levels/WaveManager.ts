import { Vector3 } from 'three';
import { Level } from './Level';
import { Wave } from './Wave';
import { WaveDefinition } from './WaveDefinition';
import { CreepGenerator } from '../environment/creeps/CreepGenerator';
import { Timer } from '../core/Timer';
import { Main } from '../core/Main';
import { LevelDefinition } from '../data/LevelInterfaces';

export class WaveManager {
	/**
	 * Core Properties
	 * */
	main: Main;

	/**
	 * Level Properties
	 * */
	level: Level;

	/**
	 * Wave Properties
	 * */
	waveTimer: Timer | null;
	waves: Wave[] = []; // Ephemeral - they are deleted from here once they launch and handled elsewhere

	/**
	 * Constructor
	 * */
	constructor(level: Level, main: Main) {
		this.main = main;
		this.level = level;
		//this.startWaveTimer();
	}

	/**
	 * Sets up waves
	 */
	setup(levelDetails: LevelDefinition) {
		this.waves = this.prepareWaveDefinitions(levelDetails.waves);
	}

	/**
	 * Prepare the assets and requireemnts of the wave
	 * */
	prepareWaveDefinitions(waveDefinitions: WaveDefinition[]) {
		let waves: Wave[] = [];

		// Create waves
		waveDefinitions.forEach((waveDefinition) => {
			// Setup a Wave
			const wave = new Wave(waveDefinition);

			// Check that the path exists
			const wavePath = this.level.creepManager.creepPaths.find((path) => path.id == waveDefinition.pathID);
			if (wavePath) wave.corePath = wavePath;
			else return console.error("No CreepPath to attach Wave to."); // Just break if no path exists

			waves.push(wave);
		});

		return waves;
	}

	/**
	 * Starts the Wave Timer
	 */
	startWaveTimer() {
		if (this.waves.length) {
			this.waveTimer = new Timer(this.triggerWave.bind(this), this.waves[0].waveStartTime, this.main);
		}
	}

	/**
	 * Stops the wave timer
	 */
	stopWaveTimer() {
		this.waveTimer?.cancel();
		this.waveTimer = null;
	}

	/**
	 * Clears the wave timer, and forgets all waves
	 */
	disposeWaves() {
		this.stopWaveTimer();
		this.waves = [];
	}

	/**
	 * Triggers a wave
	 * */
	triggerWave() {
		const wave = this.waves[0];
		this.waves = this.waves.splice(1);
		console.log("TRIGGER WAVE", wave);
		const curveStart = wave.corePath.corePath.path.getPoint(0) as Vector3;

		// Create creep groups
		wave.creepGroups.forEach((creepGroup) => {
			// Create creeps
			creepGroup.creeps.forEach((creepDefinition: any) => {
				const creep = CreepGenerator.createCreep(creepDefinition, this.level.main);
				creep.groupMain.position.set(curveStart.x, curveStart.y, curveStart.z);

				const pathVariant = wave.corePath.createVariantPath();
				//creep.setPath(pathVariant);
				creep.movePathManager.addPath(pathVariant);
				creep.movePathManager.setActivePath(pathVariant.id);

				// Brute force animators in
				this.level.creepManager.addCreep(creep);
			});
		});

		const nextWave = this.waves[0];
		if (nextWave) this.waveTimer = new Timer(this.triggerWave.bind(this), nextWave.waveStartTime, this.main);
	}
}
