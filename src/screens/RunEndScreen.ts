import * as THREE from 'three';
import { Main } from '../core/Main';
import { Screen } from '../screens/Screen';
import { CameraService, CameraSettings } from '../core/CameraService';
import { LightingService } from '../core/LightingService';
import { UIService } from '../game/UIService';
import { UIRegions } from '../game/UIProperties';
import { LoaderService } from '../core/LoaderService';
import { ThreeDeeButton } from './_ThreeDeeButton';
import { RunFailedPopup } from './RunFailedPopup';

export class RunEndScreen extends Screen {
	/**
	 * System Properties
	 * */
	main: Main;
	cameraSettings: CameraSettings = {
		name: 'cam-map-ortho',
		near: 0.01,
		far: 1000,
		zoom: 1,
		x: 0,
		y: 0,
		z: 150,
		minPolarAngle: 1.5,
		maxPolarAngle: 1.5,
		minAzimuthAngle: -0.5,
		maxAzimuthAngle: 0.5,
		minZoom: 0.7,
		maxZoom: 1.2
	}

	/**
	 * Assets
	 */
	toggleButtons: ThreeDeeButton[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.createCamera();
		this.createLighting();
		this.createUI();
		this.createBackground();

		this.startTick();
		this.main.s('Camera').setupOrbitControls();

		// Main Popup
		const sUI: UIService = this.main.s('UI');
		/*const popup: RunFailedPopup = */sUI.openPopup(RunFailedPopup, 'pause') as RunFailedPopup;
	}

	/**
	 * Go Camera!
	 */
	createCamera() {
		const sCamera: CameraService = this.main.s('Camera');
		sCamera.createPerspectiveCamera(true, this.cameraSettings);
	}

	/**
	 * Go Lights!
	 */
	createLighting() {
		const sLighting: LightingService = this.main.s('Lighting');
		const ambientLight = sLighting.createAmbientLight("WorldAmbient");
		sLighting.enableLight(ambientLight);
		const directionalLight = sLighting.createDirectionalLight("Directional");
		directionalLight.threeLight.intensity = 3;
		sLighting.enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');
	}

	/**
	 * Go UI!
	 */
	createUI() {
		const sUI: UIService = this.main.s('UI');
		const button = sUI.createIconButton('assets/common/ico.home.png', UIRegions.TopLeft);
		button.addClickBehaviour(() => {
			window.location.hash = 'map';
		});
		sUI.addButtonToUI(button);
	}

	/**
	 * Creates a caravan scene
	 */
	async createBackground() {
		const sLoader: LoaderService = this.main.s('Loader');
		const wallTexture = await sLoader.loadTexture('/assets/textures/texture.ash.jpg');
		wallTexture.wrapS = THREE.RepeatWrapping;
		wallTexture.wrapT = THREE.RepeatWrapping;
		wallTexture.repeat.set(5, 5);

		const wall = new THREE.PlaneGeometry(200, 200);
		const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x84643D, map: wallTexture, bumpMap: wallTexture });
		const wallMesh = new THREE.Mesh(wall, wallMaterial);
		this.geometries.push(wall);
		this.materials.push(wallMaterial);
		this.meshes.push(wallMesh);
		this.main.scene.add(wallMesh);
	}

	/**
	 * When unloading this 
	 */
	dispose() {
		this.disposeScreenCommons();
		this.toggleButtons.forEach(toggleButton => toggleButton.dispose());
		this.toggleButtons = []
	}
}