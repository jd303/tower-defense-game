import * as THREE from 'three';
import { perspectiveCameraDefaults } from '../config/cameraSettingsDefault';
import { Main } from '../core/Main';
import { Screen } from '../screens/Screen';
import { UIService } from '../game/UIService';
import { CameraService } from '../core/CameraService';
import { LightingService } from '../core/LightingService';
import { ModelPropManager } from '../environment/propManager/ModelPropManager';

export class SplashScreen extends Screen {
	/**
	 * System Properties
	 * */
	main: Main;
	propManager: ModelPropManager;
	meshes: THREE.Mesh[] = [];
	materials: THREE.Material[] = [];
	geometries: THREE.PlaneGeometry[] = [];

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		super(main);

		this.createCamera();
		this.createLights();
		this.createScene();
		this.createProps();
		this.createUI();

		this.startTick();
	}

	/**
	 * Go camera!
	 */
	createCamera() {
		const sCamera: CameraService = this.main.s('Camera');
		const cameraSettings = { ...perspectiveCameraDefaults, x: 0, y: 0, z: 20, zoom: 1 };
		sCamera.createPerspectiveCamera(true, cameraSettings);
	}

	/**
	 * Go Lights!
	 */
	createLights() {
		const sLighting: LightingService = this.main.s('Lighting');
		const ambientLight = sLighting.createAmbientLight("WorldAmbient");
		sLighting.enableLight(ambientLight);
		const directionalLight = sLighting.createDirectionalLight("Directional");
		sLighting.enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');
	}

	/**
	 * Go Scene!
	 */
	createScene() {
		// Backdrop
		const backdropGeometry = new THREE.PlaneGeometry(50, 50, 50);
		const backdropMaterial = new THREE.MeshBasicMaterial({ color: "#56A0E5" });
		const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
		backdrop.position.set(0, 0, -50);
		this.geometries.push(backdropGeometry);
		this.materials.push(backdropMaterial);
		this.meshes.push(backdrop);
		this.main.scene.add(backdrop);

		// Ground
		const groundGeometry = new THREE.PlaneGeometry(50, 50, 50);
		const groundMaterial = new THREE.MeshBasicMaterial({ color: "#90C429" });
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.position.set(0, -10, -25);
		ground.rotation.set(Math.PI * -0.5, Math.PI * 2, Math.PI);
		this.geometries.push(groundGeometry);
		this.materials.push(groundMaterial);
		this.meshes.push(ground);
		this.main.scene.add(ground);

		// Rough Hills
		const hillsGeometry = new THREE.PlaneGeometry(25, 25, 25);
		const hillsMaterial = new THREE.MeshBasicMaterial({ color: "#77AD24" });
		const hill = new THREE.Mesh(hillsGeometry, hillsMaterial);
		hill.position.set(10, -15, -45);
		hill.rotation.set(0, 0, Math.PI * 0.15);
		this.geometries.push(hillsGeometry);
		this.materials.push(hillsMaterial);
		this.meshes.push(hill);
		this.main.scene.add(hill);
		const hill2 = hill.clone(true);
		hill2.position.set(-7, -19, -40);
		hill2.rotation.set(0, 0, Math.PI * 0.2);
		this.meshes.push(hill2);
		this.main.scene.add(hill2);
	}

	/**
	 * Creates props
	 */
	createProps() {
		console.log("This.... might not work - props in splash screen");
		this.propManager = new ModelPropManager(this.main);
		this.propManager.registerProp({ assetName: 'tree_cone', position: new THREE.Vector3(-15, -10, -35) });
		this.propManager.registerProp({ assetName: 'tree_cone', position: new THREE.Vector3(12, -10, -30), scale: new THREE.Vector3(1.75, 1.75, 1.75) });
		this.propManager.render();
	}

	/**
	 * Go UI!
	 */
	createUI() {
		const sUI: UIService = this.main.s('UI');
		sUI.createPopup("Menu", `
			<h1>Tower Defense</h1>
			<a href="/#map" onClick="window.location.hash = 'map';">Map</a> -
			<a href="/#game" onClick="window.location.hash = 'game';">Load game</a>
		`);
	}

	/**
	 * Removes all assets
	 */
	override dispose() {
		this.disposeLevelCommons();
		this.stopTick();
		this.propManager.disposeAll();
		this.meshes.forEach(mesh => this.main.scene.remove(mesh));
		this.meshes = [];
		this.geometries.forEach(geometry => geometry.dispose());
		this.geometries = [];
		this.materials.forEach(material => material.dispose());
		this.materials = [];

		const sUI: UIService = this.main.s('UI');
		sUI.deletePopup("Menu")
	}
}
