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
		this.groupModel = new THREE.Group();
		this.groupMain.add(this.groupModel);
	}
}
