import * as THREE from 'three';
import { Main } from '../core/Main';
import { TickTimeProperties } from '../core/Tick';
import { LevelPathDefinition } from '../data/PathInterfaces';
import { CreepStates, CreepStats } from './CreepStats';

export class Creep {
	/**
	 * Stats
	 * */
	stats: CreepStats;

	/**
	 * Three Assets
	 * */
	groupMain: THREE.Group; // Outermost group - transforms the whole model
	groupTransforms: THREE.Group; // Inner group - applies minor transformations
	groupStatus: THREE.Group; // Innermost group - applies status transforms
	mesh: THREE.Mesh;

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Level Properties
	 * */
	path: LevelPathDefinition;
	pathTravelPercentagePerSec: number;
	pathProgress: number = 0;

	/**
	 * Status
	 * */
	states: CreepStates;

	/**
	 * Construtor
	 * */
	constructor(main: Main) {
		this.main = main;
		this.groupMain = new THREE.Group();
		this.groupTransforms = new THREE.Group();
		this.groupStatus = new THREE.Group();
		this.groupTransforms.add(this.groupStatus);
		this.groupMain.add(this.groupTransforms);
	}

	/**
	 * Creates and groups the Three objects
	 * */
	createCreep(mesh: THREE.Mesh) {
		this.groupStatus.add(mesh);
		this.main.scene.add(this.groupMain);
	}

	resolveAttack(damage: number) {
		console.log('Aw I was attacked', damage);
		this.stats.damage_taken += damage;
		if (this.stats.damage_taken >= this.stats.hp_total) {
			this.main.level.removeCreep(this);
		} else {
			this.stateTakeDamage();
		}
	}

	/**
	 * Sets a path for a creep
	 * */
	setPath(path: LevelPathDefinition) {
		this.path = path;
		this.pathTravelPercentagePerSec = this.stats.move_speed / path.pathLength;
	}

	/**
	 * Overridden functions
	 * */
	animate(timeProperties: TickTimeProperties) {}
	stateTakeDamage() {}
}
