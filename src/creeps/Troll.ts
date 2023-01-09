import { Vector3 } from 'three';
import { Main } from '../core/Main';
import { TickTimeProperties } from '../core/Tick';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';

export class Troll extends Creep {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/creeps/creep_troll.glb';
	assetScale: number = 0.007;

	/**
	 * Stats
	 * */
	stats = new CreepStats({
		hp_total: 20,
		move_speed: 4,
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: 0,
		},
	});
	healthBarY: 2;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.loadModel();

		// Set Creep States
		this.states = {
			moving: {
				isMoving: true,
			},
			hurting: {
				isHurting: false,
				hurtStartTime: 0,
				hurtingStateLength: 750,
			},
			hurt: false,
		};

		super.createCreep(this.mesh);

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) {
		if (this.states.moving.isMoving) {
			// Calculate travel distance
			let distanceSinceLastFrame = timeProperties.deltaTime * this.pathTravelPercentagePerSec;

			this.pathProgress = Math.min(1, this.pathProgress + distanceSinceLastFrame);
			const point = this.path.path.getPoint(this.pathProgress) as Vector3;
			this.groupMain.position.set(point.x, point.y, point.z);

			this.groupTransforms.position.y = Math.sin(timeProperties.elapsedTime * 50) / 20;
		}

		if (this.states?.hurting?.isHurting) {
			if (this.states.hurting.hurtStartTime + this.states.hurting.hurtingStateLength < new Date().getTime()) {
				this.states.hurting.isHurting = false;
				this.groupModel.position.x = 0;
			} else {
				this.groupModel.position.x = Math.sin(timeProperties.elapsedTime * 50) / 20;
			}
		}
	}
}
