import { Level } from './Level';
import { Wave } from './Wave';
import { Timer } from '../core/Timer';
import { Main } from '../core/Main';
import { AssetGenerator } from '../environment/assets/AssetGenerator';
import { Creep } from '../environment/creeps/Creep';
import { CreepPath } from '../environment/creeps/CreepPath';

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
	constructor(main: Main, level: Level) {
		this.main = main;
		this.level = level;
	}

	/**
	 * Starts the Wave Timer
	 */
	startWaveTimer() {
		console.log("START WAVE TIMER", this.waves);
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

		// Create a wave grid
		const cols = Math.min(5, Math.sqrt(wave.creepNames.length));
		const rows = Math.ceil(wave.creepNames.length / cols);
		const spacing = CreepPath.pathWidth * 0.85 / cols
		const waveGrid = this.createWaveGridPositions(cols, rows, spacing, 0);

		// Apply randomness to the waveGrid
		waveGrid.map(point => ({
			x: point.x + Math.random() * spacing / 1.5,
			z: point.z > 0 && point.z - Math.random() / 2 || point.z + Math.random() / 2
		}));

		// Create creeps
		wave.creepNames.forEach((creepName: string, index: number) => {
			const creepPath = wave.corePath.createVariantPath(waveGrid[index]);
			this.level.creepManager.addCreep(creepName, creepPath);
		});

		const nextWave = this.waves[0];
		if (nextWave) this.waveTimer = new Timer(this.triggerWave.bind(this), nextWave.waveStartTime, this.main);
	}

	/**
	 * Creates waves for a particular difficulty
	 */
	async createLevelWaves(difficulty: number, includedCreeps: IncludedCreepDefinitions[]) {
		difficulty = 1;
		const numberOfWaves = 3 * difficulty;
		const creepDifficulty = difficulty * 56;
		const creepWaveDifficulty = Math.ceil(creepDifficulty / numberOfWaves);
		/*const minWaveTime = 2000 - (difficulty * 100);
		const maxWaveTime = Math.max(5000 - (difficulty * 1000), minWaveTime);*/
		//const waveTime = 20000 / difficulty;
		const waveTime = 6500 / difficulty;

		const waves: Wave[] = [];
		for (let x = 0; x < numberOfWaves; x++) {
			let thisCreepWaveDifficulty = 0;
			let creeps: IncludedCreepDefinitions[] = [];

			while (thisCreepWaveDifficulty < creepWaveDifficulty) {
				const random = Math.random();
				let sum = 0;
				const pickedItem = includedCreeps.find(item => (sum += item.chance) >= random);
				if (pickedItem) {
					const creepClass = await AssetGenerator.getAssetAsSpriteAsset(pickedItem.name) as typeof Creep;
					pickedItem.difficulty = creepClass.waveDifficulty;
					creeps.push(pickedItem);
					thisCreepWaveDifficulty += creepClass.waveDifficulty;
				}
			}

			// Order creeps such that difficulty errs towards the end, with randomness
			const difficultyRandomOverlap = 4;
			creeps = creeps.sort((creepA, creepB) =>
				(creepA.difficulty! - creepB.difficulty!)
				+ (Math.random() * -difficultyRandomOverlap)
			);

			const creepPathID = '1';
			const creepPath = this.level.creepManager.creepPaths.find((path) => path.id == creepPathID);

			const wave = new Wave({
				id: x,
				waveStartTime: waveTime,
				pathID: creepPathID,
				difficulty: 1,
				creepNames: creeps.map(creep => creep.name)
			});

			if (creepPath) wave.corePath = creepPath;
			waves.push(wave);
		}

		this.waves = waves;
		return waves;
	}

	/**
	 * Creates a grid arrangement for wave creeps
	 */
	createWaveGridPositions(
		cols: number,
		rows: number,
		spacing: number,
		rotationDegrees: number
	): { x: number, z: number }[] {
		const offsets: { x: number, z: number }[] = [];

		// Convert degrees to radians for JS Math functions
		const radians = (rotationDegrees * Math.PI) / 180;
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);

		// Calculate the local center of the grid
		// (e.g. if we have 3 cols, the center is at index 1.0 * spacing)
		const centerX = ((cols - 1) * spacing) / 2;
		const centerZ = ((rows - 1) * spacing) / 2;

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				// 1. Get the raw position relative to 0,0
				const rawX = c * spacing;
				const rawZ = r * spacing;

				// 2. Translate so 0,0 is the center of the formation
				const localX = rawX - centerX;
				const localZ = rawZ - centerZ;

				// 3. Apply the rotation matrix
				// This gives the difference relative to the center after rotation
				const rotatedX = localX * cos - localZ * sin;
				const rotatedZ = localX * sin + localZ * cos;

				offsets.push({
					x: Number(rotatedX.toFixed(4)), // Clean up floating point noise
					z: Number(rotatedZ.toFixed(4))
				});
			}
		}

		return offsets;
	}
}

export interface IncludedCreepDefinitions {
	chance: number;
	difficulty?: number;
	name: string;
}[];