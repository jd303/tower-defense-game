import * as THREE from 'three';
import { Vector, Vector3 } from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from '../creeps/Creep';

export class Projectile {
	/**
	 * Core Properties
	 * */
	main: Main;

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
	projectileSpeed: number;
	pathProgress: number = 0;
	projectileTarget: Creep;

	/**
	 * Constructor
	 * */
	constructor(main: Main, startingPoint: THREE.Vector3, target: Creep, type: ProjectileTypes, asset: THREE.Mesh) {
		this.main = main;
		this.startingPoint = startingPoint;
		this.projectileTarget = target;
		this.projectileType = type;
		this.projectileAsset = asset;

		console.log('NEW PROJ');

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

		console.log("ARC ISN'T RIGHT YET, Plus I need to add accuracy and to resolve damage on hit");
		switch (this.projectileType) {
			// Arc Projectiles
			case ProjectileTypes.arc:
				curveSegment = new THREE.CubicBezierCurve3(
					this.startingPoint,
					this.startingPoint,
					this.projectileTarget.groupMain.position.clone(),
					this.projectileTarget.groupMain.position.clone()
				);
				break;

			// Direct Projectiles
			case ProjectileTypes.direct:
				curveSegment = new THREE.LineCurve3(this.startingPoint, this.projectileTarget.groupMain.position);
				break;

			// Homing projectiles
			case ProjectileTypes.homing:
			default:
				curveSegment = new THREE.CubicBezierCurve3(
					this.startingPoint,
					this.startingPoint,
					this.projectileTarget.groupMain.position,
					this.projectileTarget.groupMain.position
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
	}
}

export enum ProjectileTypes {
	arc,
	direct,
	homing,
}
