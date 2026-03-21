import * as THREE from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';
import { Creep } from '../creeps/Creep';

export class MineProjectile extends Projectile {
	isDetonated: boolean = false;

	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback }: ProjectileArguments) {
		super({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback });
		return this;
	}

	/**
	 * Sets up the static position on the ground
	 * */
	setup() {
		this.projectilePath = new THREE.CurvePath();
		this.endPoint = this.startingPoint.clone();

		this.projectileGroup.position.copy(this.startingPoint);
	}

	/**
	 * Detonates the mine
	 */
	detonate(creepTarget: Creep) {
		if (this.isDetonated) return;
		this.isDetonated = true;

		this.target = creepTarget;
		this.tower.resolveHit(this);
		this.tower.disposeProjectile(this);
	}

	/**
	 * Animate override, no movement
	 * */
	animate(timeProperties: TickTimeProperties) {
		this.pathComplete = true;
	}
}
