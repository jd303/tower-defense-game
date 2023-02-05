import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from './core/Main';
import { OrbitController } from './core/OrbitController';

export class CameraManager {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Objects
	 * */
	orbitController: OrbitController;
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
		zoom: 0.5,
		x: 0,
		y: 40,
		z: 50,
	};
	orthographicCameraDefaults = {
		near: 0.01,
		far: 1000,
		zoom: 0.65,
		x: 0,
		y: 75,
		z: 120,
		//z: 0, // Top down
		minPolarAngle: Math.PI * 0.2,
		maxPolarAngle: Math.PI * 0.4,
		minAzimuthAngle: Math.PI * -0.25,
		maxAzimuthAngle: Math.PI * 0.25,
		minZoom: 0.5,
		maxZoom: 1.1,
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
		camera.settings = settings;
		camera.isMain = isMain;
		camera.threeCamera = new THREE.OrthographicCamera(
			(0.04 * this.main.sizes.width) / -2,
			(0.04 * this.main.sizes.width) / 2,
			(0.04 * this.main.sizes.height) / 2,
			(0.04 * this.main.sizes.height) / -2,
			settings.near,
			settings.far
		);

		camera.threeCamera.position.set(settings.x, settings.y, settings.z);
		camera.threeCamera.zoom = settings.zoom;

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
		camera.threeCamera.zoom = settings.zoom;

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

			this.removeOrbitControls();
			this.setupOrbitControls();
		}
	}

	/**
	 * Sets up orbit handling
	 * */
	setupOrbitControls() {
		this.orbitController = new OrbitController(this.main.cameraManager.mainCamera.threeCamera, this.main.canvas);
		this.main.tick.registerCallback(() => {
			this.orbitController.controls.update();
		}, false);

		// Set a max pan
		var minPan = new THREE.Vector3(-1, -1, -1);
		var maxPan = new THREE.Vector3(1, 1, 1);
		this.orbitController.controls.target = new Vector3(0, 0, 0);
		this.orbitController.controls.target.clamp(minPan, maxPan);

		// Set a max rotate
		//this.orbitController.controls.enableRotate = false;
		this.orbitController.controls.minPolarAngle = this.mainCamera.settings.minPolarAngle;
		this.orbitController.controls.maxPolarAngle = this.mainCamera.settings.maxPolarAngle;
		this.orbitController.controls.minAzimuthAngle = this.mainCamera.settings.minAzimuthAngle;
		this.orbitController.controls.maxAzimuthAngle = this.mainCamera.settings.maxAzimuthAngle;
		this.orbitController.controls.minZoom = this.mainCamera.settings.minZoom;
		this.orbitController.controls.maxZoom = this.mainCamera.settings.maxZoom;
	}

	/**
	 * Deletes and orbit controller
	 * */
	removeOrbitControls() {
		this.orbitController.controls.dispose();
	}

	/**
	 * The window was resized
	 * */
	resizeEvent() {
		this.cameras.forEach((cam) => {
			if (cam.threeCamera instanceof THREE.PerspectiveCamera) {
				cam.threeCamera.aspect = this.main.sizes.width / this.main.sizes.height;
				cam.threeCamera.updateProjectionMatrix();
			} else if (cam.threeCamera instanceof THREE.OrthographicCamera) {
				(cam.threeCamera.left = (0.04 * this.main.sizes.width) / -2),
					(cam.threeCamera.right = (0.04 * this.main.sizes.width) / 2),
					(cam.threeCamera.top = (0.04 * this.main.sizes.height) / 2),
					(cam.threeCamera.bottom = (0.04 * this.main.sizes.height) / -2),
					cam.threeCamera.updateProjectionMatrix();
			}
		});
	}
}

class Camera {
	isMain: boolean;
	settings: any;
	threeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
}
