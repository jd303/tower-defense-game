import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class ShardProjectileEffect extends Effect {
	static assetName = 'ShardProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, ShardProjectileEffect.assetName);

		this.createMesh(new THREE.BoxGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ color: 0xCCA263 }));
	}
}
