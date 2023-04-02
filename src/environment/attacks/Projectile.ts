import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from '../creeps/Creep';
import { Tower } from '../towers/Tower';

export class Projectile {
	/**
	 * Core Properties
	 * */
	main: Main;
	tower: Tower;

	/**
	 * Visual Asset Properties
	 * */
	projectileAsset: THREE.Mesh;

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
	projectileSpeed: number;
	pathProgress: number = 0;
	target: Creep;

	/**
	 * Constructor
	 * */
	constructor(main: Main, tower: Tower, startingPoint: THREE.Vector3, target: Creep, type: ProjectileTypes, hitType: ProjectileHitTypes, asset: THREE.Mesh) {
		this.main = main;
		this.tower = tower;
		this.startingPoint = startingPoint;
		this.target = target;
		this.projectileType = type;
		this.hitType = hitType;
		this.projectileAsset = asset;

		this.projectileAsset.position.set(startingPoint.x, startingPoint.y, startingPoint.z);
		this.main.scene.add(this.projectileAsset);
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
		let distanceSinceLastFrame = timeProperties.deltaTime;
		this.pathProgress = Math.min(1, this.pathProgress + distanceSinceLastFrame);
		const point = this.projectilePath.getPoint(this.pathProgress) as Vector3;
		this.projectileAsset.position.set(point.x, point.y, point.z);

		if (this.pathProgress >= 1) {
			this.remove();
			this.tower.resolveHit(this);
		}
	}

	/**
	 * Gets rid of the Projectile
	 * */
	remove() {
		this.main.scene.remove(this.projectileAsset);
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
