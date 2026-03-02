import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class ArrowProjectileEffect extends Effect {
	static assetName = 'ArrowProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, ArrowProjectileEffect.assetName);

		this.createMesh(new THREE.BoxGeometry(1.6, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 'brown' }));
		this.mesh.rotation.set(0, Math.PI / 2, 0);
	}
}
