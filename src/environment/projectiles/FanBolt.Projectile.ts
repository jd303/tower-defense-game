import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { CharacterAsset } from '../assets/CharacterAsset';
import { PathService } from '../../game/PathService';
import { Projectile, ProjectileArguments } from './Projectile';

export class FanBoltProjectile extends Projectile {
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
		
		this.endPoint = (this.target as CharacterAsset).getExpectedPositionAt(this.projectileFlightDuration);
		
		if (!this.isAccurate) {
			this.endPoint.x += Math.random() * 4 - 2;
			this.endPoint.z += Math.random() * 4 - 2;
		}

		// Fly in a straight line from current hovering point to target
		this.projectilePath.add(new THREE.LineCurve3(this.startingPoint, this.endPoint));
		this.pathLength = this.projectilePath.getLength();
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		this.animateProjectile(timeProperties);

		if (this.pathProgress >= 1) {
			this.pathComplete = true;

			if (this.isAccurate) {
				this.tower.resolveHit(this);
				this.tower.disposeProjectile(this);
			}

			// Otherwise it's a miss
			else {
				this.missCallback();
			}
		}
	}

	animateProjectile(timeProperties: TickTimeProperties) {
		const timestamp = new Date().getTime() - this.creationTime;
		const pathProgress = timestamp / (this.projectileFlightDuration / timeProperties.gameSpeed);
		this.pathProgress = Math.min(1, pathProgress);

		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);
		
		const lookAhead = Math.min(1, this.pathProgress + 0.01);
		const targetPoint = this.projectilePath.getPoint(lookAhead);
		if (targetPoint) {
			this.projectileGroup.lookAt(targetPoint as THREE.Vector3);
		}
	}

	missCallback() {
		this.projectileGroup.position.set(this.endPoint.x, 0.75, this.endPoint.z - 0.05);
		setTimeout(() => {
			this.tower.disposeProjectile(this);
		}, 1000);
	}
}
