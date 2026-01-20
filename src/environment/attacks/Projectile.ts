import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from '../creeps/Creep';
import { Tower } from '../towers/Tower';
import { Effect } from '../Effect';
import { CharacterAsset } from '../assets/CharacterAsset';

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

	/**
	 * Path properties
	 * */
	startingPoint: THREE.Vector3;
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
		let curveSegment: THREE.Curve<Vector>;
		let distanceToTarget: number;
		const arcUp = 10;
		const arcControlPoint1: THREE.Vector3 = new THREE.Vector3();
		const arcControlPoint2: THREE.Vector3 = new THREE.Vector3();
		let destination;

		// Create a path based on its type
		switch (this.projectileType) {
			// Arc Projectiles
			case ProjectileTravelTypes.arc:
				distanceToTarget = this.startingPoint.distanceTo(this.target.groupMain.position);
				destination = (this.target as CharacterAsset).getExpectedPositionAt(2000 * (distanceToTarget / this.projectileSpeed));

				if (!this.isAccurate) {
					destination.x += Math.random() * 4 - 2;
					destination.z += Math.random() * 4 - 2;
				}

				arcControlPoint1.x = this.startingPoint.x;
				arcControlPoint1.y = this.startingPoint.y + arcUp;
				arcControlPoint1.z = this.startingPoint.z;

				arcControlPoint2.x = destination.x;
				arcControlPoint2.y = destination.y + arcUp / 2;
				arcControlPoint2.z = destination.z;

				curveSegment = new THREE.CubicBezierCurve3(
					this.startingPoint,
					arcControlPoint1,
					arcControlPoint2,
					destination
				);
				break;

			// Direct Projectiles
			case ProjectileTravelTypes.direct:
				distanceToTarget = this.startingPoint.distanceTo(this.target.groupMain.position);
				destination = this.target.getExpectedPositionAt(2000 * (distanceToTarget / this.projectileSpeed));
				if (!this.isAccurate) {
					destination.x += Math.random() * 4 - 2;
					destination.z += Math.random() * 4 - 2;
				}

				curveSegment = new THREE.LineCurve3(this.startingPoint, destination);
				break;

			// Homing projectiles
			case ProjectileTravelTypes.homing:
			default:
				destination = this.target.groupMain.position; // Keep this reference to creep's position, to force homing
				if (!this.isAccurate) {
					destination.x += Math.random() * 4 - 2;
					destination.z += Math.random() * 4 - 2;
				}

				curveSegment = new THREE.CubicBezierCurve3(
					this.startingPoint,
					this.startingPoint,
					destination,
					destination
				);
				break;
		}

		this.projectilePath.add(curveSegment);
		this.pathLength = this.projectilePath.getLength();
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		let distanceMovedThisFrame = timeProperties.deltaTime * this.projectileSpeed;
		let progressIncrement = distanceMovedThisFrame / this.pathLength;
		this.pathProgress = Math.min(1, this.pathProgress + progressIncrement);

		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);

		if (this.pathProgress >= 1) {
			this.tower.disposeProjectile(this);
			if (this.isAccurate || this.hitType == ProjectileHitTypes.splash) {
				this.runHitCallback();
				this.tower.resolveHit(this);
			}
		}
	}

	/**
	 * Runs the hit callback
	 * */
	runHitCallback() {
		this.hitCallback && this.hitCallback();
	}

	/**
	 * Gets rid of the Projectile
	 * */
	dispose() {
		this.main.scene.remove(this.projectileGroup);
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
