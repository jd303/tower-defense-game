import THREE from 'three';
import { Main } from '../../core/Main';
import { Effect } from '../Effect';

export class ArrowShot extends Effect {
	assetName: 'ArrowShot';

	/**
	 * Prop Properties
	 * */
	//assetPath: string = 'assets/models/nature/Tree_Cone_1.glb';

	constructor(main: Main) {
		super(main, ArrowShot.assetName);

		this.createMesh(new THREE.BoxGeometry(0.66, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: 'brown' }));
	}
}
