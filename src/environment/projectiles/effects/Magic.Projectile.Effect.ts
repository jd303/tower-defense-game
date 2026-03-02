import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class MagicProjectileEffect extends Effect {
	static assetName = 'MagicProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, MagicProjectileEffect.assetName);

		this.createMesh(new THREE.SphereGeometry(0.5, 6), new THREE.MeshBasicMaterial({ color: 0xFF0083 }));
	}
}
