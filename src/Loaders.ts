import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export class GLTFLoadController {
	dracoLoader: DRACOLoader;
	gltfLoader: GLTFLoader;

	/**
	 * Constructor
	 * */
	constructor() {
		this.dracoLoader = new DRACOLoader();
		this.dracoLoader.setDecoderPath('/static/draco/');

		this.gltfLoader = new GLTFLoader();
		this.gltfLoader.setDRACOLoader(this.dracoLoader);
	}

	/**
	 * Loads a model and calls given callbacks
	 * Uses 'any' for the Function types due to types given in library
	 * */
	loadModel(path: string, success: any, progress: any, failure: any) {
		this.gltfLoader.load(path, success, progress, failure);
	}
}
