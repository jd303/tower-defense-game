import * as THREE from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';

export class FlameProjectile extends Projectile {
	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback }: ProjectileArguments) {
		super({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback });
		return this;
	}

	/**
	 * Sets up the initial position
	 * */
	setup() {
		this.projectilePath = new THREE.CurvePath();
		this.projectileGroup.position.copy(this.startingPoint);
		
		if (this.target) {
			this.projectileGroup.lookAt(this.target.groupMain.position.x, this.startingPoint.y, this.target.groupMain.position.z);
		}
	}

	/**
	 * Animates the flame to continuously point at the target
	 * */
	animate(timeProperties: TickTimeProperties) {
		if (this.target && this.target.stats.activeStats.life!.current > 0) {
			// Smoothly rotate towards the target or snap to it
			this.projectileGroup.lookAt(this.target.groupMain.position.x, this.startingPoint.y, this.target.groupMain.position.z);
			this.pathComplete = false; // Never naturally completes, managed by TowerFlame
		} else {
			// Target is dead or gone, tower should handle cleanup shortly
		}
	}
}
