import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from '../creeps/Creep';
import { Tower } from '../towers/Tower';
import { Effect } from '../Effect';

export class Projectile {
	/**
	 * Core Properties
	 * */
	main: Main;
	tower: Tower;

	/**
	 * Visual Asset Properties
	 * */
	projectileGroup: THREE.Group;
	projectileAsset: Effect;

	/**
	 * Path properties
	 * */
	startingPoint: THREE.Vector3;
	projectilePath: THREE.CurvePath<Vector>;

	/**
	 * Definitions
	 * */
	projectileType: ProjectileTypes;
	hitType: ProjectileHitTypes;
	projectileSpeed: number; // Expressed as a float that will be multiplied, e.g. 1.1 is faster and 0.9 is slower
	pathProgress: number = 0;
	target: Creep;
	hitCallback?: Function;

	/**
	 * Constructor
	 * */
	constructor(main: Main, tower: Tower, startingPoint: THREE.Vector3, target: Creep, type: ProjectileTypes, hitType: ProjectileHitTypes, asset: Effect, projectileSpeed: number = 1, hitCallback?: Function) {
		this.main = main;
		this.tower = tower;
		this.startingPoint = startingPoint;
		this.target = target;
		this.projectileType = type;
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
		let arcedUpStart: THREE.Vector3;

		// Create a path based on its type
		switch (this.projectileType) {
			// Arc Projectiles
			case ProjectileTypes.arc:
				arcedUpStart = this.startingPoint.clone();
				arcedUpStart.y = arcedUpStart.y + 10;

				curveSegment = new THREE.CubicBezierCurve3(
					this.startingPoint,
					arcedUpStart,
					this.target.getExpectedPositionAt(1000),
					this.target.getExpectedPositionAt(1000)
				);
				break;

			// Direct Projectiles
			case ProjectileTypes.direct:
				curveSegment = new THREE.LineCurve3(this.startingPoint, this.target.groupMain.position);
				break;

			// Homing projectiles
			case ProjectileTypes.homing:
			default:
				curveSegment = new THREE.CubicBezierCurve3(
					this.startingPoint,
					this.startingPoint,
					this.target.groupMain.position,
					this.target.groupMain.position
				);
				break;
		}

		this.projectilePath.add(curveSegment);
		console.log('NEXT UP: FINISH PROJETILE');
		console.log('ALSO NEXT UP: MOVE PATH AND CURVE CODE INTO OWN CLASS, SO NOT REPEATING IN PROJECTILE AND CREEP');
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		let distanceSinceLastFrame = timeProperties.deltaTime * this.projectileSpeed;
		this.pathProgress = Math.min(1, this.pathProgress + distanceSinceLastFrame);
		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileGroup.position.set(point.x, point.y, point.z);

		if (this.pathProgress >= 1) {
			this.remove();
			this.runHitCallback();
			this.tower.resolveHit(this);
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
	remove() {
		this.main.scene.remove(this.projectileGroup);
		this.tower.removeProjectile(this);
	}
}

export enum ProjectileTypes {
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
