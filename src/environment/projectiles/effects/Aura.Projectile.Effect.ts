import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class AuraProjectileEffect extends Effect {
	static assetName = 'AuraProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, AuraProjectileEffect.assetName);

		this.createMesh(new THREE.RingGeometry(0.98, 1, 20), new THREE.MeshBasicMaterial({ color: 'pink' }));
		this.mesh.rotation.x = -Math.PI / 2;

		console.log("APE", this.mesh, this.groupMain);
	}
}
