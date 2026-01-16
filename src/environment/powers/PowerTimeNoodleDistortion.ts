import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Level } from '../../levels/Level';
import { Power } from './Power';
import { TickService, TickSpeed } from '../../core/TickService';

export class PowerTimeNoodleDistortion extends Power {
	/**
	 * Static properties
	 */
	static assetName = 'PowerTimeNoodleDistortion';
	static buttonIcon = 'assets/models/powers/Power.TimeNoodleDistortion.UI.icon.png';
	static powerCost = 5;
	static radiusOfEffect = 5;

	/**
	 * Unique properties for this Power
	 */
	launchTime: number;
	growingMesh: THREE.Mesh;
	shrinkingMesh: THREE.Mesh;

	/**
	 * Constructor
	 * */
	constructor(main: Main, level: Level, position: THREE.Vector3) {
		super(main, level, position);

		this.createTimeDistortion();
	}

	/**
	 * Creates the catapult barrage
	 */
	async createTimeDistortion() {
		console.log("THE TIME NOODLE CREATES A DISTORTION");

		const sTick: TickService = this.main.s('Tick');
		sTick.setGameSpeed(TickSpeed.slowest);

		setTimeout(() => {
			sTick.setGameSpeed();
		}, 10000);
	}
}