import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import THREE, { TextureLoader } from 'three';

export class LoaderController {
	dracoLoader: DRACOLoader;
	gltfLoader: GLTFLoader;
	textureLoader: TextureLoader;

	/**
	 * Constructor
	 * */
	constructor() {
		this.dracoLoader = new DRACOLoader();
		this.dracoLoader.setDecoderPath('/static/draco/');

		this.gltfLoader = new GLTFLoader();
		this.gltfLoader.setDRACOLoader(this.dracoLoader);

		this.textureLoader = new THREE.TextureLoader();
	}

	/**
	 * Loads a model, returning an awaitable promise
	 * Uses 'any' for the Function types due to types given in library
	 * */
	loadModel(path: string) {
		return new Promise((resolve, reject) => {
			this.gltfLoader.load(path, resolve, progress, reject);

			function progress() { }
		});
	}

	/**
	 * Loads a texture, returning an awaitable promise
	 * Uses 'any' for the Function types due to types given in library
	 * */
	loadTexture(path: string) {
		return new Promise((resolve, reject) => {
			this.textureLoader.load(path, resolve, progress, reject);

			function progress() { }
		});
	}
}
