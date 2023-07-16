import * as THREE from 'three';
import { perspectiveCameraDefaults } from '../../config/cameraSettingsDefault';
import { Main } from '../../core/Main';
import { TreeCone1 } from '../../environment/props/TreeCone1';
import { UIService } from '../../game/UIService';
import { CameraService } from '../../core/CameraService';
import { LightingService } from '../../core/LightingService';

export class SplashScreen {
	/**
	 * System Properties
	 * */
	main: Main;

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
		const tree = new TreeCone1(main);
		tree.groupMain.scale.set(5, 5, 5);
		tree.groupMain.position.set(-15, -10, -35);
		this.main.scene.add(tree.groupMain);
		const tree2 = new TreeCone1(main);
		tree2.groupMain.scale.set(5, 5, 5);
		tree2.groupMain.position.set(15, -10, -30);
		tree2.main.scene.add(tree2.groupMain);
		
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
