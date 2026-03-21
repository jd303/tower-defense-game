import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class MineProjectileEffect extends Effect {
	static assetName = 'MineProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, MineProjectileEffect.assetName);

		// Use a flat cylinder for the mine
		this.createMesh(new THREE.CylinderGeometry(1.5, 1.5, 1, 16), new THREE.MeshLambertMaterial({ color: 0x880000 }));

		// Set it slightly above ground to prevent z-fighting
		this.mesh.position.y = 0.1;
	}
}
