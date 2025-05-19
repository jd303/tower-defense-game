import THREE from 'three';
import { Main } from '../../core/Main';
import { Effect } from '../Effect';

export class MagicBolt extends Effect {
	/**
	 * Prop Properties
	 * */
	assetPath: string = 'assets/models/nature/Tree_Cone_1.glb';

	constructor(main: Main) {
		super(main);

		this.createMesh(new THREE.CircleGeometry(0.2, 8), new THREE.MeshBasicMaterial({ color: 0xFF0083 }));
	}
}
