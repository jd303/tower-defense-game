import * as THREE from 'three';
import { Main } from '../core/Main';

export class ModelAsset {
	/**
	 * Setup Properties
	 * */
	shadowsEnabled: boolean = false;
	assetPath: string;
	assetScale: number = 1; // default

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

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Loads the model
	 * */
	loadModel() {
		this.main.s('GLTF').loadModel(this.assetPath, this.loadModelComplete.bind(this), this.loadProgress.bind(this), this.loadError.bind(this));
	}

	/**
	 * The assets loaded properly
	 * */
	loadModelComplete(gltfAsset: any) {
		this.groupModel.scale.set(this.assetScale, this.assetScale, this.assetScale);
		this.groupModel.add(...gltfAsset.scene.children);
		this.enableShadows();
	}

	/**
	 * Add mesh manuall
	 * */
	createMesh(geometry: THREE.BufferGeometry, material: THREE.Material) {
		this.mesh = new THREE.Mesh(geometry, material);
		this.groupModel.scale.set(this.assetScale, this.assetScale, this.assetScale);
		this.groupModel.add(this.mesh);
		this.enableShadows();
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
			if (child.isMesh && this.shadowsEnabled) {
				child.castShadow = cast;
				child.receiveShadow = receive;
				child.material.needsUpdate = true;
			}
		});
	}
}
