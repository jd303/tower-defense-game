import * as THREE from 'three';
import { perspectiveCameraDefaults } from '../../config/cameraSettingsDefault';
import { Main } from '../../core/Main';
import { UIService } from '../../game/UIService';
import { CameraService } from '../../core/CameraService';
import { LightingService } from '../../core/LightingService';
import { PropManager } from '../../environment/PropManager';
import { TerrainTypes } from '../../data/LevelInterfaces';

export class SplashScreen {
	/**
	 * System Properties
	 * */
	main: Main;
	propManager: PropManager;

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		this.main = main;

		// 1. Create a scene
		// Backdrop
		const backdropGeometry = new THREE.PlaneGeometry(50, 50, 50);
		const backdropMaterial = new THREE.MeshBasicMaterial({ color: "#56A0E5" });
		const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
		backdrop.position.set(0, 0, -50);
		this.main.scene.add(backdrop);

		// Ground
		const groundGeometry = new THREE.PlaneGeometry(50, 50, 50);
		const groundMaterial = new THREE.MeshBasicMaterial({ color: "#90C429" });
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.position.set(0, -10, -25);
		ground.rotation.set(Math.PI * -0.5, Math.PI * 2, Math.PI);
		this.main.scene.add(ground);

		// Rough Hills
		const hillsGeometry = new THREE.PlaneGeometry(25, 25, 25);
		const hillsMaterial = new THREE.MeshBasicMaterial({ color: "#77AD24" });
		const hill = new THREE.Mesh(hillsGeometry, hillsMaterial);
		hill.position.set(10, -15, -45);
		hill.rotation.set(0, 0, Math.PI * 0.15);
		this.main.scene.add(hill);
		const hill2 = hill.clone(true);
		hill2.position.set(-7, -19, -40);
		hill2.rotation.set(0, 0, Math.PI * 0.2);
		this.main.scene.add(hill2);

		// Load a tree to use
		this.propManager = new PropManager(TerrainTypes.sand, this.main);
		this.propManager.registerProp('tree_cone', new THREE.Vector3(-15, -9, -35), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
		this.propManager.registerProp('tree_cone', new THREE.Vector3(12, -8, -30), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.75, 1.75, 1.75));
		this.propManager.renderPropGroups();

		// Load some creatures to be seen
		//const troll = new Troll(main);
		//const Wisp = new Wisp(main);

		// Create Lights
		const sLighting: LightingService = this.main.s('Lighting');
		const ambientLight = sLighting.createAmbientLight("WorldAmbient");
		sLighting.enableLight(ambientLight);
		const directionalLight = sLighting.createDirectionalLight("Directional");
		sLighting.enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');

		// Create ourselves a camera
		const sCamera: CameraService = this.main.s('Camera');
		const cameraSettings = { ...perspectiveCameraDefaults, x: 0, y: 0, z: 20, zoom: 1 };
		sCamera.createPerspectiveCamera(true, cameraSettings);

		// Start rendering
		const sTick = this.main.s('Tick');
		sTick.start();

		// Create a UI
		const sUI: UIService = this.main.s('UI');
		sUI.createPopup("Menu", `<h1>Tower Defense</h1><a href="/#game" onClick="window.location.hash = 'game'; window.location.reload(true);">Load game</a>`);
	}
}
