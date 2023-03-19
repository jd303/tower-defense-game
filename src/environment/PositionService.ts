import * as THREE from 'three';
import { Main } from '../core/Main';
import { Creep } from './creeps/Creep';

export class PositionService {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Finds creeps
	 * CONSIDER ADDING GRID SYSTEM TO LIMIT SEARCHING
	 * @param { Vector3 } position Search from this position
	 * @param { number } radius Search this radius
	 * */
	findCreepsByLocation(position: THREE.Vector3, radius: number) {
		const allCreeps = this.main.s('Level').currentLevel.creeps;
		const nearbyCreeps = allCreeps.filter((creep: Creep) => {
			return creep.groupMain.position.distanceTo(position) <= radius;
		});

		return nearbyCreeps;
	}
}
