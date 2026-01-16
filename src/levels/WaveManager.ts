import { Level } from './Level';
import { Wave } from './Wave';
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
	waves: Wave[] = [];

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
	setup(levelDetails: LevelDefinition) { }

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

		// Create creeps
		wave.creepNames.forEach((creepName: string) => {
			const creepPath = wave.corePath.createVariantPath();
			this.level.creepManager.addCreep(creepName, creepPath);
		});

		const nextWave = this.waves[0];
		if (nextWave) this.waveTimer = new Timer(this.triggerWave.bind(this), nextWave.waveStartTime, this.main);
	}

	/**
	 * Creates waves for a particular difficulty
	 */
	createLevelWaves(difficulty: number, includedCreeps: IncludedCreepDefinitions[]) {
		difficulty = 1;
		const numberOfWaves = 2 * difficulty;
		const creepDifficulty = difficulty * 20;
		const creepWaveDifficulty = Math.ceil(creepDifficulty / numberOfWaves);
		/*const minWaveTime = 2000 - (difficulty * 100);
		const maxWaveTime = Math.max(5000 - (difficulty * 1000), minWaveTime);*/
		//const waveTime = 20000 / difficulty;
		const waveTime = 5000 / difficulty;

		const waves = Array.from({ length: numberOfWaves }, (_, i) => {
			let thisCreepWaveDifficulty = 0;
			const creeps = [];

			while (thisCreepWaveDifficulty < creepWaveDifficulty) {
				const newCreep = includedCreeps[Math.floor(Math.random() * includedCreeps.length)]
				creeps.push(newCreep.name);
				thisCreepWaveDifficulty += newCreep.difficulty
			}

			console.log("TODO: SETUP CREEP / WAVE PATHS PROPERLY");
			const wavePathID = '1';
			const wavePath = this.level.creepManager.creepPaths.find((path) => path.id == wavePathID);

			const wave = new Wave({
				id: i,
				waveStartTime: waveTime,
				pathID: wavePathID,
				difficulty: 1,
				creepNames: creeps
			});

			if (wavePath) wave.corePath = wavePath;

			return wave;
		});

		this.waves = waves;
		return waves;
	}
}

export interface IncludedCreepDefinitions {
	difficulty: number,
	name: string
}[];