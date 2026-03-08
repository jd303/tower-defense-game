import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';

export class MagicOrbProjectile extends Projectile {
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
		// Points 2 and 3 should be control points, not starting and target
		this.projectilePath = new THREE.CurvePath();
		let curveSegments: THREE.Curve<Vector>[] = [];

		// Create a path
		this.endPoint = this.target.groupMain.position; // Keep this reference to creep's position, to force homing
		if (!this.isAccurate) {
			this.endPoint.x += Math.random() * 4 - 2;
			this.endPoint.z += Math.random() * 4 - 2;
		}

		curveSegments.push(new THREE.CubicBezierCurve3(
			this.startingPoint,
			this.startingPoint,
			this.endPoint,
			this.endPoint
		));

		curveSegments.forEach(segment => this.projectilePath.add(segment));
		this.pathLength = this.projectilePath.getLength();
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		this.animateProjectile(timeProperties);

		if (this.pathProgress >= 1) {
			this.tower.disposeProjectile(this);

			if (this.isAccurate) {
				this.tower.resolveHit(this);
			}
		}
	}

	// Is Overwritten by the projectile type
	animateProjectile(timeProperties: TickTimeProperties) {
		const timestamp = new Date().getTime() - this.creationTime;
		const pathProgress = timestamp / (this.projectileFlightDuration / timeProperties.gameSpeed);
		this.pathProgress = Math.min(1, pathProgress);

		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);
	}
}