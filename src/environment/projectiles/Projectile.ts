import * as THREE from 'three';
import { Vector } from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from '../creeps/Creep';
import { Tower } from '../towers/Tower';
import { Effect, EffectConstructor } from '../Effect';

export interface ProjectileArguments {
	main: Main;
	tower: Tower;
	startingPoint: THREE.Vector3;
	target: Creep;
	isAccurate: boolean;
	hitType: ProjectileHitTypes;
	projectileAsset: EffectConstructor | Effect;
	projectileFlightDuration: number;
	hitCallback?: Function,
	ricochet?: {
		times: number,
		maxTimes: number,
	}
}

export abstract class Projectile {
	/**
	 * Core Properties
	 * */
	main: Main;
	tower: Tower;

	/**
	 * Visual Asset Properties
	 * */
	projectileGroup: THREE.Group;
	projectileAssetInstance: Effect;

	/**
	 * Path properties
	 * */
	creationTime: number = new Date().getTime();
	startingPoint: THREE.Vector3;
	endPoint: THREE.Vector3;
	projectilePath: THREE.CurvePath<Vector>;
	pathLength: number;
	pathComplete: boolean = false;

	/**
	 * Definitions
	 * */
	hitType: ProjectileHitTypes;
	projectileFlightDuration: number; // Expressed as time in seconds
	pathProgress: number = 0;
	target: Creep;
	isAccurate: boolean;
	yRange: { low: number, high: number, distance: number };

	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback }: ProjectileArguments) {
		this.main = main;
		this.tower = tower;
		this.startingPoint = startingPoint;
		this.target = target;
		this.isAccurate = isAccurate;
		this.hitType = hitType;
		this.projectileAssetInstance = projectileAsset instanceof Effect ? projectileAsset : new projectileAsset(main);
		this.projectileFlightDuration = projectileFlightDuration;
		this.projectileGroup = this.projectileAssetInstance.groupMain;

		this.projectileGroup.position.set(startingPoint.x, startingPoint.y, startingPoint.z);
		this.main.scene.add(this.projectileGroup);
		this.setup();
		return this;
	}

	/**
	 * Setup the projectile, usually by creating a path
	 * */
	abstract setup(): void;

	/**
	 * Calculates animation properties
	 * */
	abstract animate(timeProperties: TickTimeProperties): void;

	/**
	 * Gets rid of the Projectile
	 * */
	dispose() {
		this.main.scene.remove(this.projectileGroup);
	}
}

export enum ProjectileHitTypes {
	direct,
	splash,
	ricochet
}

// Define a generic type for classes that extend Projectile
export type ProjectileConstructor = new (args: ProjectileArguments) => Projectile;