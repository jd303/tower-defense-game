import * as THREE from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';
import { CharacterAsset } from '../assets/CharacterAsset';
import { BeamProjectileEffect } from './effects/Beam.Projectile.Effect';

export class BeamProjectile extends Projectile {

	progressSteps: number[] = [0.2, 0.4, 0.6, 0.8];

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
		const { lineCurve } = this.updatePath();
		this.projectilePath = new THREE.CurvePath();
		(this.projectileAssetInstance as BeamProjectileEffect).createLine(lineCurve);

		// Move the groupMain as this seems to be off (unsure why, but this fixes)
		this.projectileGroup.position.x = -1 * this.startingPoint.x;
		this.projectileGroup.position.y = -1 * this.startingPoint.y;
		this.projectileGroup.position.z = -1 * this.startingPoint.z;

		console.log(this.projectileGroup);
	}
	updatePath() {
		const projectilePath = new THREE.CurvePath();
		this.projectilePath = projectilePath;
		this.endPoint = (this.target as CharacterAsset).groupMain.position;
		const lineCurve = new THREE.LineCurve3(
			new THREE.Vector3(this.startingPoint.x, this.startingPoint.y, this.startingPoint.z),
			new THREE.Vector3(this.endPoint.x, this.endPoint.y + this.target.assetScale / 2, this.endPoint.z)
		);
		this.projectilePath.add(lineCurve);

		return { lineCurve };
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		this.updatePath();

		// Only act if the creature hasn't died
		const targetHealth = this.target.stats.activeStats.life?.current;
		if (targetHealth && targetHealth > 0) {
			this.animateProjectile(timeProperties);

			const isBeamPulseAccurate = Math.random() < this.tower.stats.activeStats.attack!.accuracy;

			// Limit calculations to progress steps
			if (this.pathProgress > this.progressSteps[0]) {
				this.progressSteps = this.progressSteps.slice(1);
				if (this.target.groupMain.position.distanceTo(this.tower.groupMain.position) >= this.tower.stats.activeStats.attack!.range!) {
					this.tower.disposeProjectile(this)
				} else {
					isBeamPulseAccurate && this.tower.resolveHit(this);
				}
			}

			if (this.pathProgress >= 1) {
				isBeamPulseAccurate && this.tower.resolveHit(this);
				this.tower.disposeProjectile(this);
			}
		} else {
			this.tower.disposeProjectile(this);
		}
	}

	// Is Overwritten by the projectile type
	animateProjectile(timeProperties: TickTimeProperties) {
		this.pathProgress += 0.01;

		const effectInstance = (this.projectileAssetInstance as BeamProjectileEffect);

		const positionAttribute = effectInstance.lineGeometry.getAttribute('position');
		const positions = positionAttribute.array as Float32Array;

		// Overwrite the existing array with your new erratic points
		const points = this.projectilePath.getSpacedPoints(effectInstance.linePointsDetail);
		points.forEach((point, i) => {
			const vectorPoint = point as THREE.Vector3;
			positions[i * 3] = vectorPoint.x + this.pointRandom();
			positions[i * 3 + 1] = vectorPoint.y + this.pointRandom();
			positions[i * 3 + 2] = vectorPoint.z + this.pointRandom();
		});

		positionAttribute.needsUpdate = true;
	}
	pointRandom() {
		return (Math.random() / 5) - 0.1;
	}
}