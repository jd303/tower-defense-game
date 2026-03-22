import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { CharacterAsset } from '../assets/CharacterAsset';
import { PathService } from '../../game/PathService';
import { Projectile, ProjectileArguments, ProjectileHitTypes } from './Projectile';
import { BulletProjectileEffect } from './effects/Bullet.Projectile.Effect';

export class BulletProjectile extends Projectile {
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
		// Calculate the end point directly to the target
		this.endPoint = this.target.groupMain.position.clone();
		this.endPoint.y += 0.5; // Aim slightly above ground level

		if (!this.isAccurate) {
			// Miss jitter - slight horizontal adjustment
			this.endPoint.x += Math.random() * 3 - 1.5;
			this.endPoint.z += Math.random() * 3 - 1.5;
		}

		// Set the impact smoke mesh location relative to the start point
		const effect = this.projectileAssetInstance as BulletProjectileEffect;
		if (effect && effect.impactSmoke) {
			effect.impactSmoke.position.copy(this.endPoint.clone().sub(this.startingPoint));
		}

		// Add a straight line path just for consistency, though we won't follow it
		this.projectilePath = new THREE.CurvePath();
		this.projectilePath.add(new THREE.LineCurve3(this.startingPoint, this.endPoint));
		this.pathLength = this.projectilePath.getLength();
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		this.animateProjectile(timeProperties);

		if (this.pathProgress >= 1) {
			this.tower.disposeProjectile(this);
		}
	}

	// Instant hit logic, animate the smoke spheres dissolving.
	animateProjectile(timeProperties: TickTimeProperties) {
		// Resolve hit on the very first frame of logic
		if (this.pathProgress === 0) {
			if (this.isAccurate || this.hitType == ProjectileHitTypes.splash) {
				this.tower.resolveHit(this);
			}
		}

		let distanceMovedThisFrame = timeProperties.deltaTime * 1000;
		// The "flightDuration" acts as our visual effect duration 
		let progressIncrement = distanceMovedThisFrame / this.projectileFlightDuration;
		this.pathProgress = Math.min(1, this.pathProgress + progressIncrement);

		const effect = this.projectileAssetInstance as BulletProjectileEffect;
		if (effect) {
			const scale = 1 + this.pathProgress * 1.5; // Grow 
			const opacity = 0.8 * (1 - this.pathProgress); // Fade out

			if (effect.muzzleSmoke) {
				effect.muzzleSmoke.scale.set(scale, scale, scale);
				(effect.muzzleSmoke.material as THREE.MeshBasicMaterial).opacity = opacity;
			}

			if (effect.impactSmoke) {
				effect.impactSmoke.scale.set(scale, scale, scale);
				(effect.impactSmoke.material as THREE.MeshBasicMaterial).opacity = opacity;
			}
		}
	}
}
