import { CreepPath } from '../environment/creeps/CreepPath';
import { WaveDefinition } from './WaveDefinition';

export class Wave {
	/**
	 * Wave Properties
	 * */
	id: number;
	difficulty: number;
	corePath: CreepPath;
	waveStartTime: number;
	creepNames: string[] = [];

	/**
	 * Constructor
	 * */
	constructor(waveDefinition: WaveDefinition) {
		this.id = waveDefinition.id;
		this.waveStartTime = waveDefinition.waveStartTime;
		this.difficulty = waveDefinition.difficulty;
		this.creepNames = waveDefinition.creepNames;
	}

	/**
	 * Launches a wave
	 * */
	launchWave() { }
}
