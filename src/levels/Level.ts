import * as THREE from 'three';
import { Creep } from '../creeps/Creep';
import { Tower } from '../towers/Tower';
import { Prop } from '../environment/Prop';
import { Terrain } from '../environment/Terrain';
import { Main } from '../core/Main';
import { LevelPath } from '../LevelPath';

export class Level {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Path
	 * */
	levelPaths: LevelPath[] = [];

	/**
	 * Level Assets
	 * */
	terrain: Terrain;
	creeps: Creep[] = [];
	towers: Tower[] = [];
	props: Prop[] = [];

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;
		this.main.level = this;
	}

	/**
	 * Adds a creep to the level
	 * */
	addCreep(creep: Creep) {
		// if (!this.creeps.find((creep) => creep)) this.creeps.push(creep);
		this.creeps.push(creep);
	}

	/**
	 * Removes a creep from the level
	 * */
	removeCreep(removedCreep: Creep) {
		this.creeps = this.creeps.filter((creep) => creep.mesh.uuid !== removedCreep.mesh.uuid);
		this.main.scene.remove(removedCreep.groupMain);
	}

	/**
	 * Adds a tower to the level
	 * */
	addTower(tower: Tower, point: THREE.Vector3) {
		// if (!this.towers.find((tower) => tower)) this.towers.push(tower);
		this.towers.push(tower);
		this.main.scene.add(tower.groupMain);
		tower.groupMain.position.set(point.x, point.y, point.z);
	}

	/**
	 * Adds a prop to the level
	 * */
	addProp(prop: Prop, point: THREE.Vector3) {
		this.props.push(prop);
		this.main.scene.add(prop.groupMain);
		prop.groupMain.position.set(point.x, point.y, point.z);
	}
}
