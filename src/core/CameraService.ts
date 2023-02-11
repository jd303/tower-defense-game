import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from './Main';
import { OrbitController } from './OrbitController';

export class CameraService {
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

	defaultCameraSettings: CameraSettings = {
		fov: 25,
		near: 0.1,
		far: 350,
		zoom: 0.5,
		x: 0,
		y: 40,
		z: 50,
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
	createOrthographicCamera(isMain: boolean = false, settings: CameraSettings = this.defaultCameraSettings) {
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
	createPerspectiveCamera(isMain: boolean = false, settings: CameraSettings = this.defaultCameraSettings) {
		const camera = new Camera();
		camera.settings = settings;
		camera.isMain = isMain;
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
		this.orbitController = new OrbitController(this.main.s('Camera').mainCamera.threeCamera, this.main.canvas);
		this.main.s('Tick').registerCallback(() => {
			this.orbitController.controls.update();
		}, false);

		// Set a max pan
		var minPan = new THREE.Vector3(-1, -1, -1);
		var maxPan = new THREE.Vector3(1, 1, 1);
		this.orbitController.controls.target = new Vector3(0, 0, 0);
		this.orbitController.controls.target.clamp(minPan, maxPan);

		// Set a max rotate
		this.orbitController.controls.minPolarAngle = this.mainCamera.settings.minPolarAngle || -Infinity;
		this.orbitController.controls.maxPolarAngle = this.mainCamera.settings.maxPolarAngle || Infinity;
		this.orbitController.controls.minAzimuthAngle = this.mainCamera.settings.minAzimuthAngle || -Infinity;
		this.orbitController.controls.maxAzimuthAngle = this.mainCamera.settings.maxAzimuthAngle || -Infinity;
		this.orbitController.controls.minZoom = this.mainCamera.settings.minZoom || 0.1;
		this.orbitController.controls.maxZoom = this.mainCamera.settings.maxZoom || 5;
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

export interface CameraSettings {
	near: number;
	far: number;
	zoom: number;
	x: number;
	y: number;
	z: number;
	fov?: number;
	minPolarAngle?: number;
	maxPolarAngle?: number;
	minAzimuthAngle?: number;
	maxAzimuthAngle?: number;
	minZoom?: number;
	maxZoom?: number;
}
