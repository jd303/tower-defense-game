import * as THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class VolcanicProjectileEffect extends Effect {
	static assetName = 'VolcanicProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, VolcanicProjectileEffect.assetName);

		this.createMesh(new THREE.SphereGeometry(0.5, 8), new THREE.MeshBasicMaterial({ color: '#ff6600' }));
	}
}
