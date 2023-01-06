import * as THREE from 'three';
import { Main } from '../core/Main';
import { ModelAsset } from '../ModelAsset';

export class Prop extends ModelAsset {
	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);
		this.groupMain = new THREE.Group();
		this.groupMain.name = 'main-outer';

		this.groupTransforms = new THREE.Group();
		this.groupTransforms.name = 'transforms-mid';

		this.groupModel = new THREE.Group();
		this.groupModel.name = 'model-inner';

		this.groupTransforms.add(this.groupModel);
		this.groupMain.add(this.groupTransforms);
	}
}
