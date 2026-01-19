import * as THREE from 'three';
import { Main } from './Main';
import { OrbitController } from './OrbitController';
import { FPSController, FPSControlsType } from './FPSController';
import { TickCallback } from './TickService';
import { Service } from './Service';

export class CameraService extends Service {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Objects
	 * */
	orbitController: OrbitController;
	fpsController: FPSController;
	cameras: Camera[] = [];
	mainCamera: Camera;

	defaultCameraSettings: CameraSettings = {
		name: 'default',
		fov: 25,
		near: 0.1,
		far: 350,
		zoom: 0.5,
		x: 0,
		y: 0,
		z: 0,
		clampingEnabled: false
	};

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
	}

	/**
	 * Creates an orthographic camera
	 * */
	createOrthographicCamera(isMain: boolean = false, settings: CameraSettings = this.defaultCameraSettings, groupForCustomControls: boolean = false) {
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
		camera.threeCamera.zoom = settings.zoom;

		// If we want to group the camera for custom controls
		if (groupForCustomControls) {
			const cameraPan = new THREE.Group();
			const cameraTilt = new THREE.Group();

			camera.groupPan = cameraPan;
			camera.groupTilt = cameraTilt;

			camera.groupPan.add(camera.groupTilt);
			camera.groupTilt.add(camera.threeCamera);
			camera.groupPan.position.set(settings.x, settings.y, settings.z);

			// We don't need camera groups, or want to use Orbit controls
		} else {
			camera.threeCamera.position.set(settings.x, settings.y, settings.z);
		}

		this.cameras.push(camera);
		if (isMain) this.mainCamera = camera;
		return camera;
	}

	/**
	 * Creates a perspective camera
	 * */
	createPerspectiveCamera(isMain: boolean = false, settings: CameraSettings, groupForCustomControls: boolean = false) {
		if (!settings) settings = this.defaultCameraSettings;
		const camera = new Camera();
		camera.settings = settings;
		camera.isMain = isMain;
		camera.threeCamera = new THREE.PerspectiveCamera(settings.fov, this.main.sizes.width / this.main.sizes.height, settings.near, settings.far);
		camera.threeCamera.zoom = settings.zoom;

		// If we want to group the camera for custom controls
		if (groupForCustomControls) {
			const cameraPan = new THREE.Group();
			const cameraTilt = new THREE.Group();

			camera.groupPan = cameraPan;
			camera.groupTilt = cameraTilt;

			camera.groupPan.add(camera.groupTilt);
			camera.groupTilt.add(camera.threeCamera);
			camera.groupPan.position.set(settings.x, settings.y, settings.z);

			// We don't need camera groups, or want to use Orbit controls
		} else {
			camera.threeCamera.position.set(settings.x, settings.y, settings.z);
		}

		this.cameras.push(camera);
		if (isMain) this.mainCamera = camera;
		return camera;
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
		}
	}

	/**
	 * Updates the camera by a position and rotation (and maybe zoom in the future, or refactor to split position, rotation and zoom)
	 * */
	updateCameraPositionBy(positionUpdate: CameraPositionProperties) {
		this.mainCamera.threeCamera.position.set(positionUpdate.x, positionUpdate.y, positionUpdate.z);
		this.mainCamera.threeCamera.position.set(positionUpdate.rotX, positionUpdate.rotY, positionUpdate.rotZ);
	}

	/**
	 * Sets up orbit handling
	 * */
	setupOrbitControls() {
		this.orbitController = new OrbitController(this.main.s('Camera').mainCamera.threeCamera, this.main.canvas, this.main.s('Camera').mainCamera.settings.clampingEnabled, this.main);
		this.main.s('Tick').registerCallback(new TickCallback('OrbitController', () => {
			this.orbitController.controls.update();
		}), false);

		// Set a max pan
		/*var minPan = new THREE.Vector3(-1, -1, -1);
		var maxPan = new THREE.Vector3(1, 1, 1);
		this.orbitController.controls.target = new Vector3(0, 0, 0);
		this.orbitController.controls.target.clamp(minPan, maxPan);*/

		// Set a max rotate
		this.orbitController.controls.minPolarAngle = this.mainCamera.settings.minPolarAngle || -Infinity;
		this.orbitController.controls.maxPolarAngle = this.mainCamera.settings.maxPolarAngle || Infinity;
		this.orbitController.controls.minAzimuthAngle = Number.isFinite(this.mainCamera.settings.minAzimuthAngle) ? this.mainCamera.settings.minAzimuthAngle : -Infinity;
		this.orbitController.controls.maxAzimuthAngle = Number.isFinite(this.mainCamera.settings.maxAzimuthAngle) ? this.mainCamera.settings.maxAzimuthAngle : -Infinity;
		this.orbitController.controls.minZoom = this.mainCamera.settings.minZoom || 0.1;
		this.orbitController.controls.maxZoom = this.mainCamera.settings.maxZoom || 5;

		// Call reset, which sets zoom properly
		this.orbitController.controls.reset();
	}

	/**
	 * Deletes and orbit controller
	 * */
	removeOrbitControls() {
		this.orbitController.controls.dispose();
	}

	/**
	 * Convenience method to reset orbit controls
	 */
	resetOrbitControls() {
		this.removeOrbitControls();
		this.setupOrbitControls();
	}

	/**
	 * Sets up orbit handling
	 * */
	setupFPSControls() {
		this.fpsController = new FPSController(this.main, FPSControlsType.fpsAdvancedControls, this.main.s('Camera').mainCamera);
	}

	/**
	 * Deletes and orbit controller
	 * */
	removeFPSControls() {
		this.fpsController.controls.dispose();
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

	/**
	 * Disposes all cameras
	 */
	disposeAll() {
		this.cameras.forEach(camera => {
			camera.threeCamera.parent?.remove();
		});
		this.cameras = [];
	}
}

export class Camera {
	isMain: boolean;
	settings: any;
	groupPan: THREE.Group;
	groupTilt: THREE.Group;
	threeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
}

export interface CameraSettings {
	name: string;
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
	clampingEnabled: boolean;
}

export interface CameraPositionProperties {
	x: number;
	y: number;
	z: number;
	rotX: number;
	rotY: number;
	rotZ: number;
}
