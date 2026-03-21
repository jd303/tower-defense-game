import * as THREE from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';

export class AirstrikeProjectile extends Projectile {
	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback }: ProjectileArguments) {
		super({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback });
		return this;
	}

	/**
	 * Sets up custom logic, bypasses the CurvePath setup
	 * */
	setup() {
		// Define an end point above the target or randomly near it if inaccurate
		if (this.target) {
			const targetPos = this.target.groupMain.position;
			// Simple hit accuracy evaluation
			if (this.isAccurate) {
				this.endPoint = new THREE.Vector3(targetPos.x, 0, targetPos.z);
			} else {
				this.endPoint = new THREE.Vector3(targetPos.x + (Math.random() * 4 - 2), 0, targetPos.z + (Math.random() * 4 - 2));
			}
		} else {
			this.endPoint = this.startingPoint.clone();
		}

		this.projectileGroup.position.copy(this.startingPoint);
		// Initially point up
		this.projectileGroup.lookAt(this.startingPoint.x, 80, this.startingPoint.z);
	}

	/**
	 * Custom Animate: Upwards to y=80, then downwards to endPoint
	 * */
	animate(timeProperties: TickTimeProperties) {
		if (this.pathComplete) return;

		// Calculate progress
		const distanceSinceLastFrame = timeProperties.deltaTime / (this.projectileFlightDuration / 1000);
		this.pathProgress = Math.min(1, this.pathProgress + distanceSinceLastFrame);

		if (this.pathProgress <= 0.5) {
			// Phase 1: Going UP
			// Map 0 -> 0.5 progress to 0 -> 1 interpolation factor
			const lerpFactor = this.pathProgress * 2;
			const currentY = THREE.MathUtils.lerp(this.startingPoint.y, 80, lerpFactor);
			this.projectileGroup.position.set(this.startingPoint.x, currentY, this.startingPoint.z);
			
			// Always look up
			this.projectileGroup.lookAt(this.startingPoint.x, 800, this.startingPoint.z);

		} else {
			// Phase 2: Going DOWN
			// Map 0.5 -> 1.0 progress to 0 -> 1 interpolation factor
			const lerpFactor = (this.pathProgress - 0.5) * 2;
			
			// We only want to snap to the horizontal position of the target once we reach the top
			if (lerpFactor < 0.05) {
				// Snap horizontal position
				this.projectileGroup.position.x = this.endPoint.x;
				this.projectileGroup.position.z = this.endPoint.z;
			}

			// Lerp downwards
			const currentY = THREE.MathUtils.lerp(80, this.endPoint.y, lerpFactor);
			this.projectileGroup.position.set(this.endPoint.x, currentY, this.endPoint.z);

			// Always look down
			this.projectileGroup.lookAt(this.endPoint.x, -100, this.endPoint.z);
		}

		// When complete
		if (this.pathProgress >= 1) {
			this.pathComplete = true;
			this.tower.resolveHit(this);
			this.dispose();
		}
	}
}
