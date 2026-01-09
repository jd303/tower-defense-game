import THREE from 'three';
import { Main } from '../../core/Main';
import { Effect } from '../Effect';

export class MagicBolt extends Effect {
	assetName: 'MagicBolt';

	/**
	 * Prop Properties
	 * */
	assetPath: string = 'assets/models/nature/Tree_Cone_1.glb';

	constructor(main: Main) {
		super(main, MagicBolt.assetName);

		this.createMesh(new THREE.SphereGeometry(0.5, 6), new THREE.MeshBasicMaterial({ color: 0xFF0083 }));
	}
}
