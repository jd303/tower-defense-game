import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class GLTFLoadController {
	gltfLoader: GLTFLoader;

	/**
	 * Constructor
	 * */
	constructor() {
		this.gltfLoader = new GLTFLoader();
	}

	/**
	 * Loads a model and calls given callbacks
	 * Uses 'any' for the Function types due to types given in library
	 * */
	loadModel(path: string, success: any, progress: any, failure: any) {
		this.gltfLoader.load(path, success, progress, failure);
	}
}
