import * as THREE from 'three';
import { Vector3 } from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';
import { CharacterAsset } from '../assets/CharacterAsset';
import { LevelService } from '../../levels/LevelService';
import { PositionService } from '../PositionService';

export class RicochetProjectile extends Projectile {
	static ricochetDistance: number = 5;
	ricochetTimes: number;
	maximumRichochetTimes: number;

	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback, ricochet }: ProjectileArguments) {
		super({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback });

		this.ricochetTimes = ricochet?.times || 0;
		this.maximumRichochetTimes = ricochet?.maxTimes || 1;

		return this;
	}

	/**
	 * Creates a projectile path
	 * */
	setup() {
		this.projectilePath = new THREE.CurvePath();
		this.endPoint = (this.target as CharacterAsset).getExpectedPositionAt(this.projectileFlightDuration);

		// Create a path
		if (!this.isAccurate) {
			this.endPoint.x += Math.random() * 4 - 2;
			this.endPoint.z += Math.random() * 4 - 2;
			this.endPoint.y = 0;
		} else {
			this.endPoint.y = this.target.assetScale / 2;
		}

		this.projectilePath.add(new THREE.LineCurve3(
			new THREE.Vector3(this.startingPoint.x, this.startingPoint.y, this.startingPoint.z),
			new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z)
		));
		this.pathLength = this.projectilePath.getLength();
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		if (this.pathComplete) return;

		this.animateProjectile(timeProperties);

		if (this.pathProgress >= 1) {
			this.pathComplete = true;

			if (this.isAccurate) {
				this.tower.resolveHit(this);

				// Ricochet baby
				if (this.ricochetTimes < this.maximumRichochetTimes) {
					const sPosition: PositionService = this.main.s('Position');
					const creepsInRange = sPosition.getCreepsInRadiusFromPosition(this.endPoint, RicochetProjectile.ricochetDistance);
					const newCreepTarget = creepsInRange.find(creep => creep !== this.target);

					if (newCreepTarget) {
						this.tower.projectiles.push(new RicochetProjectile({
							main: this.main,
							tower: this.tower,
							startingPoint: new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z),
							target: newCreepTarget,
							isAccurate: true,
							hitType: this.hitType,
							projectileAsset: this.projectileAssetInstance,
							projectileFlightDuration: 150,
							ricochet: {
								times: this.ricochetTimes + 1,
								maxTimes: this.maximumRichochetTimes
							}
						}));
					}
				}

				this.tower.disposeProjectile(this);
			}

			// Otherwise it's a miss
			else {
				this.missCallback();
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

	/**
	 * The arrow misses
	 * */
	missCallback() {
		this.projectileGroup.position.set(this.endPoint.x, 0.75, this.endPoint.z - 0.05);
		this.projectileGroup.rotation.y = Math.PI / 4;
		setTimeout(() => {
			this.tower.disposeProjectile(this);
		}, 2500);
	}
}