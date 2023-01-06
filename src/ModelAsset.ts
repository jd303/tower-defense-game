import * as THREE from 'three';
import { Group, Scene } from 'three';
import { Main } from './core/Main';

export class ModelAsset {
	/**
	 * Setup Properties
	 * */
	assetPath: string;

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Three Properties
	 * */
	geometry: any;
	material: any;
	mesh: THREE.Mesh;
	groupMain: THREE.Group; // Outermost group - transforms the whole model
	groupTransforms: THREE.Group; // Inner group - applies minor transformations
	groupModel: THREE.Group; // Innermost group - applies status transforms

	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Loads the model
	 * */
	loadModel() {
		this.main.glTFLoader.loadModel(this.assetPath, this.loadComplete.bind(this), this.loadProgress.bind(this), this.loadError.bind(this));
	}

	/**
	 * The assets loaded properly
	 * */
	loadComplete(gltfAsset: any) {
		this.groupModel.add(...gltfAsset.scene.children);
	}

	/**
	 * The assets triggered a progress load
	 * */
	loadProgress() {}

	/**
	 * The assets failed to load
	 * */
	loadError(err: any) {
		console.log('ERR', err);
	}

	/**
	 * Enabled shadows on the model
	 * */
	enableShadows(cast: boolean = true, receive: boolean = false) {
		this.groupModel.children.forEach((child: any) => {
			if (child.isMesh) {
				console.log(child);
				if (cast) child.castShadow = true;
				if (receive) child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}
}
