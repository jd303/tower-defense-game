import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class BoulderProjectileEffect extends Effect {
	static assetName = 'BoulderProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, BoulderProjectileEffect.assetName);

		// Use a basic SphereGeometry for the boulder, maybe a gray color to look like stone
		this.createMesh(new THREE.SphereGeometry(1.5, 6, 6), new THREE.MeshLambertMaterial({ color: 0x888888 }));
		// Raise it slightly so it looks like it's rolling on the ground
		this.mesh.position.y = 1.5;
	}
}
