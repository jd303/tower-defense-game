import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class PulseProjectileEffect extends Effect {
	static assetName = 'RingProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, PulseProjectileEffect.assetName);

		this.createMesh(new THREE.TorusGeometry(1.5, 0.3, 8, 30), new THREE.MeshLambertMaterial({ color: 0xaa22ff }));

		// Rotate it to lie flat on the ground
		this.mesh.rotation.x = -Math.PI / 2;
		this.mesh.scale.set(0.5, 0.5, 0.5);
	}
}
