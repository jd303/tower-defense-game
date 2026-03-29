import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';
import { Creep } from '../creeps/Creep';
import { PositionService } from '../PositionService';

export class BoulderProjectile extends Projectile {
	hitCreeps: Set<Creep> = new Set();

	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback }: ProjectileArguments) {
		super({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback });
		return this;
	}

	/**
	 * Creates a projectile path
	 * */
	setup() {
		this.projectilePath = new THREE.CurvePath();

		// Determine the direction vector from the starting point to the target
		const direction = new THREE.Vector3().subVectors(this.target.groupMain.position, this.startingPoint).normalize();

		// The end point is simply the starting point plus the direction vector multiplied by the tower's range
		const range = this.tower.stats.activeStats.attack!.range!;
		this.endPoint = new THREE.Vector3().copy(this.startingPoint).add(direction.multiplyScalar(range));

		// Keep it low to the ground
		this.endPoint.y = 0;
		this.startingPoint.y = 0;

		const lineCurve = new THREE.LineCurve3(this.startingPoint, this.endPoint);
		this.projectilePath.add(lineCurve);
		this.pathLength = this.projectilePath.getLength();
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		this.animateProjectile(timeProperties);

		// Rotate the mesh to simulate rolling
		if (this.projectileAssetInstance?.mesh) {
			this.projectileAssetInstance.mesh.rotation.x += timeProperties.deltaTime * 5;
		}

		// Check for hits
		const sPositioning: PositionService = this.main.s('Position');
		const collisionRadius = 2.0;

		const creepsInRange = sPositioning.getCreepsInRadiusFromPosition(this.projectileGroup.position, collisionRadius);

		creepsInRange.forEach((creep: Creep) => {
			if (!this.hitCreeps.has(creep)) {
				this.hitCreeps.add(creep);

				// Apply current damage
				const attackStats = { ...this.tower.stats.activeStats.attack! };
				attackStats.damage = Math.ceil(attackStats.damage / (this.hitCreeps.size + 1));
				creep.resolveAttack(attackStats);
			}
		});

		if (this.pathProgress >= 1) {
			this.pathComplete = true;
			this.tower.disposeProjectile(this);
		}
	}

	// Animate along the path
	animateProjectile(timeProperties: TickTimeProperties) {
		const timestamp = new Date().getTime() - this.creationTime;
		const pathProgress = timestamp / (this.projectileFlightDuration / timeProperties.gameSpeed);
		this.pathProgress = Math.min(1, pathProgress);

		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);

		// Now look where we're going
		const lookAhead = Math.min(1, this.pathProgress + 0.01);
		const targetPoint = this.projectilePath.getPoint(lookAhead);
		this.projectileGroup.lookAt(targetPoint as THREE.Vector3);
	}
}
