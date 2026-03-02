import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { CharacterAsset } from '../assets/CharacterAsset';
import { PathService } from '../../game/PathService';
import { Projectile, ProjectileArguments, ProjectileHitTypes } from './Projectile';

export class BombProjectile extends Projectile {
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
	createPath() {
		// Points 2 and 3 should be control points, not starting and target
		this.projectilePath = new THREE.CurvePath();
		let curveSegments: THREE.Curve<Vector>[] = [];
		let distanceToTarget: number;
		const arcUp = 8;
		let arcControlPoint1: THREE.Vector3 = new THREE.Vector3();
		let arcControlPoint2: THREE.Vector3 = new THREE.Vector3();
		let arcControlPoint3: THREE.Vector3 = new THREE.Vector3();
		let arcControlPoint4: THREE.Vector3 = new THREE.Vector3();

		// Create a path
		distanceToTarget = this.startingPoint.distanceTo(this.target.groupMain.position);
		this.endPoint = (this.target as CharacterAsset).getExpectedPositionAt(2000 * (distanceToTarget / this.projectileFlightDuration));
		const midPoint = PathService.getPercentagePositionBetweenPoints(this.startingPoint, this.endPoint, 0.45);
		midPoint.y = this.startingPoint.y + arcUp;

		if (!this.isAccurate) {
			this.endPoint.x += Math.random() * 4 - 2;
			this.endPoint.z += Math.random() * 4 - 2;
		}

		arcControlPoint1 = PathService.getPercentagePositionBetweenPoints(this.startingPoint, midPoint, 0.13);
		arcControlPoint1.y = this.startingPoint.y + 10;

		arcControlPoint2 = PathService.getPercentagePositionBetweenPoints(this.startingPoint, midPoint, 0.66);
		arcControlPoint2.y = midPoint.y + arcUp * 0.1;

		// Create a curve upwards
		curveSegments.push(new THREE.CubicBezierCurve3(
			this.startingPoint,
			arcControlPoint1,
			arcControlPoint2,
			midPoint
		));

		arcControlPoint3 = PathService.getPercentagePositionBetweenPoints(midPoint, this.endPoint, 0.33);
		arcControlPoint3.y = midPoint.y - arcUp * 0.1;

		arcControlPoint4 = PathService.getPercentagePositionBetweenPoints(midPoint, this.endPoint, 0.9);
		arcControlPoint4.y = (midPoint.y - this.endPoint.y) * 0.5;

		// Create a curve downwards
		curveSegments.push(new THREE.CubicBezierCurve3(
			midPoint,
			arcControlPoint3,
			arcControlPoint4,
			this.endPoint
		));

		// Store yRange
		const lowY = Math.min(this.startingPoint.y, this.endPoint.y);
		this.yRange = { low: lowY, high: midPoint.y, distance: midPoint.y - lowY };

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

			if (this.isAccurate || this.hitType == ProjectileHitTypes.splash) {
				this.tower.resolveHit(this);
			}
		}
	}

	// Is Overwritten by the projectile type
	animateProjectile(timeProperties: TickTimeProperties) {
		const fastPosition = 0.7;
		const slowPosition = 0.3;
		const slowRange = 0.15;
		const slowIntensity = 0.25; // lower is more intense
		let speedMultiplier;

		const distance = Math.abs(this.pathProgress - slowPosition);
		if (this.pathProgress > fastPosition) {
			speedMultiplier = 1.5;
		} else if (distance >= slowRange) speedMultiplier = 1;
		else {
			const normalizedDistance = distance / slowRange;
			const t = 0.5 + 0.5 * Math.cos(normalizedDistance * Math.PI);
			speedMultiplier = slowIntensity + (1.0 - slowIntensity) * (1.0 - t);
		}

		let distanceMovedThisFrame = timeProperties.deltaTime * this.projectileFlightDuration * speedMultiplier;
		let progressIncrement = distanceMovedThisFrame / this.pathLength;
		this.pathProgress = Math.min(1, this.pathProgress + progressIncrement);

		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);

		// Now look where we're going
		const lookAhead = Math.min(1, this.pathProgress + 0.01);
		const targetPoint = this.projectilePath.getPoint(lookAhead);
		this.projectileGroup.lookAt(targetPoint as THREE.Vector3);
	}
}
