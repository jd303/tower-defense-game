import { Vector3 } from 'three';
import { Level } from './Level';
import { Wave } from './Wave';
import { WaveDefinition } from './WaveDefinition';
import { CreepGenerator } from '../environment/creeps/CreepGenerator';
import { Timer } from '../core/Timer';
import { Main } from '../core/Main';

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
	nextWaveTime: number = 0;
	nextWave: Wave;
	waveTimer: any;
	waves: Wave[] = []; // Ephemeral - they are deleted from here once they launch and handled elsewhere

	/**
	 * Constructor
	 * */
	constructor(waveDefinitions: WaveDefinition[], level: Level, main: Main) {
		this.main = main;
		this.level = level;
		this.waves = this.prepareWaveDefinitions(waveDefinitions);
		//this.startWaveTimer();
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
			console.log("TODO:: You added 'toString' to path.id below, which feels wrong....");
			const wavePath = this.level.levelPaths.find((path) => path.id.toString() == waveDefinition.pathID);
			if (wavePath) wave.corePath = wavePath;
			else return; // Just break if no path exists

			// Create a Timer for this wave
			const waveTimer = new Timer(this.triggerWave.bind(this, wave), wave.waveStartTime, this.main);

			waves.push(wave);
		});

		return waves;
	}

	startWaveTimer() {
		this.getNextWave();
		this.waveTimer = setInterval(this.checkWaves.bind(this), 250);
	}

	stopWaveTimer() {
		clearInterval(this.waveTimer);
	}

	getNextWave() {
		if (this.waves[0]) {
			this.nextWaveTime = new Date().getTime() + this.waves[0].waveStartTime;
			this.nextWave = this.waves[0];
		} else {
			this.stopWaveTimer();
		}
	}

	checkWaves() {
		const now = new Date().getTime();
		if (now >= this.nextWaveTime) {
			this.triggerWave(this.nextWave);
			this.waves.shift();
			this.getNextWave();
		}
	}

	/**
	 * Triggers a wave
	 * */
	triggerWave(wave: Wave) {
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
				this.level.addCreep(creep);
			});
		});
	}
}
