import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { LevelDefinition } from '../../data/LevelInterfaces';
import { InteractionService2 } from '../../game/InteractionService2';
import { Creep } from './Creep';
import { CreepPath } from './CreepPath';

export class CreepManager {
	/**
	 * Core
	 */
	main: Main;
	defaultCreepClickEnabled: boolean = false;

	/**
	 * Objects
	 */
	creeps: Creep[] = [];
	creepPaths: CreepPath[] = [];

	/**
	 * Construtor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Creates creep paths 
	 */
	setupCreepPaths(levelDetails: LevelDefinition) {
		levelDetails.paths.forEach((path) => {
			const creepPath = new CreepPath(path, this.main);
			this.creepPaths.push(creepPath);
			this.main.scene.add(creepPath.groupMain);
		});
	}

	/**
	 * Adds a creep to the level
	 * */
	addCreep(creep: Creep) {
		this.creeps.push(creep);
		this.main.scene.add(creep.groupMain);

		if (!this.defaultCreepClickEnabled) this.registerDefaultCreepListener();
	}

	/**
	 * Removes a creep from the level
	 * */
	removeCreep(removedCreep: Creep) {
		this.creeps = this.creeps.filter((creep) => creep !== removedCreep);
		this.main.scene.remove(removedCreep.groupMain);
	}

	/**
	 * Registers a default callback for all creep.  Uses the first creep's callback, with the context of the provided creep
	 */
	registerDefaultCreepListener() {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		console.log("TODO: Consider a better place to put this!!");
		sInteraction2.registerInteractableListener('creep', 'creepClickedDefault', this.creeps[0].creepClicked);
		this.defaultCreepClickEnabled = true;
	}

	/**
	 * Animate objects based on time
	 */
	tick(timeProperties: TickTimeProperties) {
		this.creeps.forEach((creep) => creep.animateCore(timeProperties));
	}
}
