import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class BombProjectileEffect extends Effect {
	static assetName = 'BombProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, BombProjectileEffect.assetName);

		this.createMesh(new THREE.SphereGeometry(0.5, 8), new THREE.MeshBasicMaterial({ color: 'red' }));
	}
}
