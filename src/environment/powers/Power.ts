import * as THREE from "three";
import { Main } from '../../core/Main';
import { Level } from "../../levels/Level";

export class Power {
	/**
	 * System Properties
	 * */
	main: Main;
	position: THREE.Vector3;
	level: Level;

	/**
	 * Static properties
	 */
	static assetName: string;
	static buttonIcon: string;
	static powerCost: number;

	/**
	 * Construtor
	 * */
	constructor(main: Main, level: Level, position: THREE.Vector3) {
		this.main = main;
		this.level = level;
		this.position = position;
	}
}

/**
 * Common geometries and meshes for Powers
 */
export abstract class PowerCommons {

	/** Selection commons */
	static activityCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x4298B5 });
	static activityCircleGeometry = new THREE.CircleGeometry(2, 32);

	static activityCircle = (width: number = 4, thickness: number = 0.25) => {
		const geometry = new THREE.RingGeometry(width - thickness, width, 32); // inner radius, outer radius, segments
		const mesh = new THREE.Mesh(geometry, this.activityCircleMaterial);
		mesh.rotation.x = -Math.PI / 2;
		return mesh;
	}
}