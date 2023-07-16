import THREE from 'three';
import { Main } from '../../core/Main';
import { Effect } from '../Effect';

export class BombShot extends Effect {
	/**
	 * Prop Properties
	 * */
	//assetPath: string = 'assets/models/nature/Tree_Cone_1.glb';

	constructor(main: Main) {
		super(main);

		this.createMesh(new THREE.SphereGeometry(0.3, 8), new THREE.MeshBasicMaterial({ color: 'red' }));
	}
}
