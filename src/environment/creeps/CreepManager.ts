import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { LevelDefinition } from '../../dataTypes/LevelInterfaces';
import { Level } from '../../levels/Level';
import { Creep } from './Creep';
import { CreepPath } from './CreepPath';
import { MovePathDefinition } from '../../dataTypes/PathInterfaces';
import { AssetGenerator } from '../assets/AssetGenerator';

export class CreepManager {
	/**
	 * Core
	 */
	main: Main;
	level: Level;
	defaultCreepClickEnabled: boolean = false;

	/**
	 * Objects
	 */
	creepTypes: Creep[] = []; // Stores one reference to each creep, to dispose properly
	creeps: Creep[] = []; // Stores active Creeps on the map
	creepPaths: CreepPath[] = [];

	/**
	 * Construtor
	 * */
	constructor(main: Main, level: Level) {
		this.main = main;
		this.level = level;
	}

	/**
	 * Creates creep paths 
	 */
	setupCreepPaths(levelDetails: LevelDefinition) {
		levelDetails.paths.forEach((path) => {
			const creepPath = new CreepPath(path, this.level, this.main);
			this.creepPaths.push(creepPath);
			this.main.scene.add(creepPath.groupMain);
		});
	}

	/**
	 * Adds a creep to the level
	 * */
	async addCreep(creepName: string, creepPath: MovePathDefinition) {
		const creep = await AssetGenerator.createSpriteAsset(creepName, this.level.main) as Creep;
		creep.setCreepPath(creepPath);

		// Add to active creeps
		this.creeps.push(creep);

		// Add to known creep types
		if (!this.creepTypes.find(creepType => creepType.assetName == creep.assetName)) {
			this.creepTypes.push(creep);
		}
	}

	/**
	 * Removes a creep from the level
	 * */
	removeCreep(removedCreep: Creep, killed: boolean) {
		this.creeps = this.creeps.filter((creep) => creep !== removedCreep);
		this.main.scene.remove(removedCreep.groupMain);

		if (killed) this.level.updateLevelResults('creepsKilled', 1);
	}

	/**
	 * Animate objects based on time
	 */
	tick(timeProperties: TickTimeProperties) {
		this.creeps.forEach((creep) => creep.animateCore(timeProperties));
	}

	/**
	 * Removes all creeps from the scene
	 */
	disposeAll() {
		this.creeps.forEach((creep) => {
			creep.deleteCreep(false);
		});
		this.creeps = [];

		this.creepTypes.forEach(creepType => {
			creepType.dispose();
		});
		this.creepTypes = [];

		this.creepPaths.forEach((creepPath) => {
			creepPath.dispose();
		});
		this.creepPaths = [];
	}
}
