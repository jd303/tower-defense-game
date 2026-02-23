import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from '../creeps/Creep';
import { Tower } from '../towers/Tower';
import { Effect } from '../Effect';
import { CharacterAsset } from '../assets/CharacterAsset';
import { PathService } from '../../game/PathService';

export class Projectile {
	/**
	 * Core Properties
	 * */
	main: Main;
	tower: Tower;

	/**
	 * Visual Asset Properties
	 * */
	static travelType: ProjectileTravelTypes;
	projectileGroup: THREE.Group;
	projectileAsset: Effect;
	projectileGroupLeavings: THREE.Group;
	projectileGroupLeavingsTimeout: ReturnType<typeof setTimeout>;

	/**
	 * Path properties
	 * */
	startingPoint: THREE.Vector3;
	endPoint: THREE.Vector3;
	projectilePath: THREE.CurvePath<Vector>;
	pathLength: number;

	/**
	 * Definitions
	 * */
	projectileType: ProjectileTravelTypes;
	hitType: ProjectileHitTypes;
	projectileSpeed: number; // Expressed as a float that will be multiplied, e.g. 1.1 is faster and 0.9 is slower
	pathProgress: number = 0;
	target: Creep;
	isAccurate: boolean;
	hitCallback?: Function;
	missCallback?: Function;
	yRange: { low: number, high: number, distance: number };

	/**
	 * Constructor
	 * */
	constructor(main: Main, tower: Tower, startingPoint: THREE.Vector3, target: Creep, isAccurate: boolean, travelType: ProjectileTravelTypes, hitType: ProjectileHitTypes, asset: Effect, projectileSpeed: number = 1, hitCallback?: Function) {
		this.main = main;
		this.tower = tower;
		this.startingPoint = startingPoint;
		this.target = target;
		this.isAccurate = isAccurate;
		this.projectileType = travelType;
		this.hitType = hitType;
		this.projectileAsset = asset;
		this.projectileSpeed = projectileSpeed;
		this.hitCallback = hitCallback;
		this.projectileGroup = new THREE.Group();

		this.projectileGroup.add(asset.groupMain);

		this.projectileGroup.position.set(startingPoint.x, startingPoint.y, startingPoint.z);
		this.main.scene.add(this.projectileGroup);
		this.createPath();
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
		const arcUp = 10;
		let arcControlPoint1: THREE.Vector3 = new THREE.Vector3();
		let arcControlPoint2: THREE.Vector3 = new THREE.Vector3();
		let arcControlPoint3: THREE.Vector3 = new THREE.Vector3();
		let arcControlPoint4: THREE.Vector3 = new THREE.Vector3();

		// Create a path based on its type
		switch (this.projectileType) {
			// Arc Projectiles
			case ProjectileTravelTypes.arc: {
				this.animateProjectile = this.animateArc;
				distanceToTarget = this.startingPoint.distanceTo(this.target.groupMain.position);
				this.endPoint = (this.target as CharacterAsset).getExpectedPositionAt(2000 * (distanceToTarget / this.projectileSpeed));
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

				// Create a hit callback
				if (!this.isAccurate) {
					this.missCallback = () => {
						this.projectileGroupLeavings = this.projectileGroup.clone();
						this.projectileGroupLeavings.position.set(this.endPoint.x, 0.75, this.endPoint.z);
						const rotate = Math.abs(this.startingPoint.x - this.endPoint.x) > 5 ? this.startingPoint.x < this.endPoint.x && Math.PI / 8 || -Math.PI / 8 : 0
						this.projectileGroupLeavings.rotation.y += rotate;
						this.main.scene.add(this.projectileGroupLeavings);

						this.projectileGroupLeavingsTimeout = setTimeout(() => {
							this.main.scene.remove(this.projectileGroupLeavings);
						}, 2500);
					}
				}

				break;
			}

			// Direct Projectiles
			case ProjectileTravelTypes.direct: {
				this.animateProjectile = this.animateDefault;
				distanceToTarget = this.startingPoint.distanceTo(this.target.groupMain.position);
				this.endPoint = this.target.getExpectedPositionAt(2000 * (distanceToTarget / this.projectileSpeed));
				if (!this.isAccurate) {
					this.endPoint.x += Math.random() * 4 - 2;
					this.endPoint.z += Math.random() * 4 - 2;
				}

				curveSegments.push(new THREE.LineCurve3(this.startingPoint, this.endPoint));

				break;
			}

			// Homing projectiles
			case ProjectileTravelTypes.homing:
			default:
				this.animateProjectile = this.animateDefault;
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
				break;
		}

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
				this.runHitCallback();
				this.tower.resolveHit(this);
			} else {
				this.runMissCallback();
			}
		}
	}

	// Is Overwritten by the projectile type
	animateProjectile(timeProperties: TickTimeProperties) { }

	// Animate an Arc Projectile Travel Type
	animateArc(timeProperties: TickTimeProperties) {
		const fastPosition = 0.7;
		const slowPosition = 0.4;
		const slowRange = 0.3;
		const slowIntensity = 0.6; // lower is more intense
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

		let distanceMovedThisFrame = timeProperties.deltaTime * this.projectileSpeed * speedMultiplier;
		let progressIncrement = distanceMovedThisFrame / this.pathLength;
		this.pathProgress = Math.min(1, this.pathProgress + progressIncrement);

		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);

		// Now look where we're going
		const lookAhead = Math.min(1, this.pathProgress + 0.01);
		const targetPoint = this.projectilePath.getPoint(lookAhead);
		this.projectileGroup.lookAt(targetPoint as THREE.Vector3);
	}

	// Animate any other projectile travel types
	animateDefault(timeProperties: TickTimeProperties) {
		let distanceMovedThisFrame = timeProperties.deltaTime * this.projectileSpeed;
		let progressIncrement = distanceMovedThisFrame / this.pathLength;
		this.pathProgress = Math.min(1, this.pathProgress + progressIncrement);

		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);
	}

	/**
	 * Runs the hit callback
	 * */
	runHitCallback() {
		this.hitCallback && this.hitCallback();
	}

	runMissCallback() {
		this.missCallback && this.missCallback();
	}

	/**
	 * Gets rid of the Projectile
	 * */
	dispose(includeLeavings: boolean = false) {
		this.main.scene.remove(this.projectileGroup);

		if (includeLeavings) {
			if (this.projectileGroupLeavings) {
				this.main.scene.remove(this.projectileGroupLeavings);
			}
			clearTimeout(this.projectileGroupLeavingsTimeout);
		}
	}
}

export enum ProjectileTravelTypes {
	arc,
	direct,
	instant,
	homing,
	spread,
}

export enum ProjectileHitTypes {
	direct,
	splash,
}
