import * as THREE from 'three';
import { Main } from '../core/Main';

export class MeshAsset {
	/**
	 * Setup Properties
	 * */
	shadowsEnabled: boolean = false;
	assetPath: string;
	assetScale: number = 1;

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Three Properties
	 * */
	geometry: any;
	material: any;
	groupMain: THREE.Group;
	meshes: THREE.Mesh[] = [];

	/**
	 * Timing Properties
	 */
	loadCompletePromise: Promise<boolean>;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
		this.groupMain = new THREE.Group();
		this.loadCompletePromise = new Promise(() => console.log("DONE"));
	}

	/**
	 * Loads the model
	 * */
	loadModel() {
		this.main.s('Loader').loadModel(this.assetPath, this.loadModelComplete.bind(this), this.loadProgress.bind(this), this.loadError.bind(this));
	}

	/**
	 * The assets loaded properly
	 * */
	loadModelComplete(gltfAsset: any) {
		this.groupMain.scale.set(this.assetScale, this.assetScale, this.assetScale);
		this.groupMain.add(...gltfAsset.scene.children);
		this.enableShadows();
	}

	/**
	 * The assets triggered a progress load
	 * */
	loadProgress() { }

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
		this.meshes.forEach(mesh => mesh.castShadow = cast);
		this.meshes.forEach(mesh => mesh.receiveShadow = receive);
		this.meshes.forEach(mesh => {
			if (Array.isArray(mesh.material)) {
				mesh.material.forEach(meshMaterial => meshMaterial.needsUpdate = true);
			} else {
				mesh.material.needsUpdate = true;
			}
		});
	}
}