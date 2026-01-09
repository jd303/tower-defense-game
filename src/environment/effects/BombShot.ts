import THREE from 'three';
import { Main } from '../../core/Main';
import { Effect } from '../Effect';

export class BombShot extends Effect {
	assetName: 'BombShot';

	/**
	 * Effect Properties
	 * */
	constructor(main: Main) {
		super(main, BombShot.assetName);

		this.createMesh(new THREE.SphereGeometry(0.5, 8), new THREE.MeshBasicMaterial({ color: 'red' }));
	}
}
