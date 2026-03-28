import * as THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class FanBoltProjectileEffect extends Effect {
	static assetName = 'FanBoltProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, FanBoltProjectileEffect.assetName);

		// A low-poly sphere
		this.createMesh(new THREE.IcosahedronGeometry(0.8, 0), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
	}
}
