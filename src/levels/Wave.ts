import { Creep } from '../environment/creeps/Creep';
import { CreepGroup } from '../environment/creeps/CreepGroup';
import { LevelPath } from './LevelPath';
import { WaveDefinition } from './WaveDefinition';

export class Wave {
	/**
	 * Wave Properties
	 * */
	id: number;
	difficulty: number;
	corePath: LevelPath;
	waveStartTime: number;
	creepGroups: CreepGroup[] = [];

	/**
	 * Constructor
	 * */
	constructor(waveDefinition: WaveDefinition) {
		this.id = waveDefinition.id;
		this.waveStartTime = waveDefinition.waveStartTime;
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
