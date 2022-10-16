import { Creep } from './creeps/Creep';
import { CreepGroup } from './creeps/CreepGroup';
import { LevelPath } from './LevelPath';
import { WaveDefinition } from './WaveDefinition';

export class Wave {
	/**
	 * Wave Properties
	 * */
	id: number;
	difficulty: number;
	corePath: LevelPath;
	delayFromLastWave: number;
	creepGroups: CreepGroup[] = [];

	/**
	 * Constructor
	 * */
	constructor(waveDefinition: WaveDefinition) {
		this.id = waveDefinition.id;
		this.delayFromLastWave = waveDefinition.delayFromLastWave;
		this.difficulty = waveDefinition.difficulty;
		this.creepGroups = waveDefinition.creepGroups;
	}

	/**
	 * Add Creep
	 * */
	addCreep(creep: Creep, groupID: string) {
		let group = this.creepGroups.find((group) => group.id == groupID);
		if (!group) {
			const newGroup = new CreepGroup(groupID);
			this.creepGroups.push(newGroup);
		} else {
			this.creepGroups.push(group);
		}
	}

	/**
	 * Launches a wave
	 * */
	launchWave() {}
}
