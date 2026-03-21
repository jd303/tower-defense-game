import * as THREE from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';

export class PulseProjectile extends Projectile {
	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback }: ProjectileArguments) {
		super({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback });
		return this;
	}

	/**
	 * Sets up the static position under the target
	 * */
	setup() {
		// Set up stationary points exactly at the target's feet (y=0)
		this.startingPoint = new THREE.Vector3().copy(this.target.groupMain.position);
		this.startingPoint.y = 0;
		this.endPoint = this.startingPoint.clone();

		this.projectileGroup.position.copy(this.startingPoint);
	}

	/**
	 * Animates the ring popping in
	 * */
	animate(timeProperties: TickTimeProperties) {
		const timestamp = new Date().getTime() - this.creationTime;
		this.pathProgress = timestamp / (this.projectileFlightDuration / timeProperties.gameSpeed);

		// Scale the mesh from 50% (0.5) to 100% (1.0)
		if (this.projectileAssetInstance?.mesh) {
			const currentScale = 0.5 + (this.pathProgress * 0.5);
			this.projectileAssetInstance.mesh.scale.set(currentScale, currentScale, currentScale);

			this.projectileAssetInstance.groupMain.position.set(this.target.groupMain.position.x, this.target.groupMain.position.y, this.target.groupMain.position.z);
		}

		if (this.pathProgress >= 1 && !this.pathComplete) {
			this.pathComplete = true;

			// Resolves attack when effect is fully grown
			this.tower.resolveHit(this);
		}

		else if (this.pathProgress >= 3) {
			this.tower.disposeProjectile(this);
		}
	}
}
