import * as THREE from 'three';
import { Main } from './core/Main';

export class CameraManager {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Objects
	 * */
	cameras: Camera[] = [];
	mainCamera: Camera;

	/**
	 * Defaults
	 * */
	perspectiveCameraDefaults = {
		/*fov: 50,
		near: 0.1,
		far: 250,
		x: 0,
		y: 40,
		z: 50,*/
		fov: 25,
		near: 0.1,
		far: 350,
		x: 0,
		y: 40,
		z: 50,
	};
	orthographicCameraDefaults = {
		near: 0.01,
		far: 1000,
		x: 0,
		y: 40,
		//z: 75, // Angled
		z: 0, // Top down
	};

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Creates an orthographic camera
	 * */
	createOrthographicCamera(isMain: boolean = false) {
		const settings = this.orthographicCameraDefaults;
		const camera = new Camera();
		camera.isMain = isMain;
		camera.threeCamera = new THREE.OrthographicCamera(
			(0.04 * this.main.sizes.width) / -2,
			(0.04 * this.main.sizes.width) / 2,
			(0.04 * this.main.sizes.height) / 2,
			(0.04 * this.main.sizes.height) / -2,
			settings.near,
			settings.far
		);

		console.log(settings);
		camera.threeCamera.position.set(settings.x, settings.y, settings.z);
		//camera.threeCamera.position.y = 100;

		this.cameras.push(camera);
		if (isMain) this.mainCamera = camera;
	}

	/**
	 * Creates a perspective camera
	 * */
	createPerspectiveCamera(isMain: boolean = false) {
		const settings = this.perspectiveCameraDefaults;
		const camera = new Camera();
		camera.isMain = isMain;
		console.log(this.main.sizes);
		camera.threeCamera = new THREE.PerspectiveCamera(settings.fov, this.main.sizes.width / this.main.sizes.height, settings.near, settings.far);

		camera.threeCamera.position.set(settings.x, settings.y, settings.z);

		this.cameras.push(camera);
		if (isMain) this.mainCamera = camera;
	}

	/**
	 * Set main camera
	 * */
	setMainCamera(mainCamera: Camera) {
		this.mainCamera = mainCamera;
	}

	/**
	 * Switch cameras (currently assumes 2, during dev)
	 * */
	switchCameras() {
		if (this.mainCamera) {
			const newMainCam = this.cameras.find((cam) => cam !== this.mainCamera);
			console.log(newMainCam);
			this.setMainCamera(newMainCam as Camera);

			this.main.interactionManager.removeOrbitControls();
			this.main.interactionManager.setupOrbitControls();
		}
	}

	/**
	 * The window was resized
	 * */
	resizeEvent() {
		this.cameras.forEach((cam) => {
			if (cam.threeCamera instanceof THREE.PerspectiveCamera) {
				cam.threeCamera.aspect = this.main.sizes.width / this.main.sizes.height;
				cam.threeCamera.updateProjectionMatrix();
			}
		});
	}
}

class Camera {
	isMain: boolean;
	threeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
}
