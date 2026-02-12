import * as THREE from 'three';
import { Main } from '../core/Main';
import { Screen } from '../screens/Screen';
import { CameraService, CameraSettings } from '../core/CameraService';
import { LightingService } from '../core/LightingService';
import { UIService } from '../game/UIService';
import { UIRegions } from '../game/UIProperties';
import { LoaderService } from '../core/LoaderService';
import { Interactable2, InteractableOrders, InteractionEvent, InteractionService2 } from '../game/InteractionService2';
import { UserDataService } from '../userData/UserDataService';
import { ThreeDeeButton } from './_ThreeDeeButton';
import { TowerUpgradePopup } from '../popups/TowerUpgradePopup';

export class UpgradesScreen extends Screen {
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
		maxZoom: 1.2,
		clampingEnabled: false
	}

	/**
	 * Assets
	 */
	geometries: THREE.BufferGeometry[] = [];
	materials: THREE.Material[] = [];
	meshes: THREE.Mesh[] = [];
	popupButtons: ThreeDeeButton[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.createCamera();
		this.createLighting();
		this.createUI();
		this.createUpgradesScene();

		this.startTick();

		// DEBUG ORBIT CONTROLS
		this.main.s('Camera').setupOrbitControls();
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
	async createUpgradesScene() {
		await this.main.s('UserData').awaitDev();

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

		this.createTowerFrame();
		this.createHeroFrame();
		this.createPowerFrame();
	}

	/**
	 * Create a Tower Button
	 */
	createTowerFrame() {
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		const popupButton = new ThreeDeeButton(this.main, 'towers', 'assets/towers/archer/spritesheet-tower-archer.png');
		popupButton.groupMain.position.x = -25;
		this.popupButtons.push(popupButton);
		this.main.scene.add(popupButton.groupMain);

		sInteraction.registerInteractable(new Interactable2('ui-component', InteractableOrders.default, popupButton));
		sInteraction.registerInteractableListener('ui-component', `popup-tower`, this.popupTowers.bind(this), false);
	}
	popupTowers(event: InteractionEvent) {
		const towerUpgradePopup = new TowerUpgradePopup();
		towerUpgradePopup.open();
		console.log("POP!", "Towers", event);

		return {
			handled: true,
			stopPropagation: false,
		}
	}

	/**
	 * Create a Hero Button
	 */
	createHeroFrame() {
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		const popupButton = new ThreeDeeButton(this.main, 'heroes', 'assets/heroes/aldricEthersteel/icon.ui.aldricethersteel.png');
		this.popupButtons.push(popupButton);
		this.main.scene.add(popupButton.groupMain);

		sInteraction.registerInteractable(new Interactable2('ui-component', InteractableOrders.default, popupButton));
		sInteraction.registerInteractableListener('ui-component', `popup-hero`, this.popupHero.bind(this), false);
	}
	popupHero(event: InteractionEvent) {
		console.log("POP!", "Hero", event);

		return {
			handled: true,
			stopPropagation: false,
		}
	}

	/**
	 * Create a Power Button
	 */
	createPowerFrame() {
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		const popupButton = new ThreeDeeButton(this.main, 'powers', 'assets/powers/timeNoodleDistortion/Power.TimeNoodleDistortion.UI.icon.png');
		popupButton.groupMain.position.x = 25;
		this.popupButtons.push(popupButton);
		this.main.scene.add(popupButton.groupMain);

		sInteraction.registerInteractable(new Interactable2('ui-component', InteractableOrders.default, popupButton));
		sInteraction.registerInteractableListener('ui-component', `popup-powers`, this.popupPowers.bind(this), false);
	}
	popupPowers(event: InteractionEvent) {
		console.log("POP!", "Powers", event);

		return {
			handled: true,
			stopPropagation: false,
		}
	}

	/**
	 * When unloading this 
	 */
	dispose() {
		this.disposeScreenCommons();
		this.geometries.forEach(geometry => geometry.dispose());
		this.geometries = [];
		this.materials.forEach(material => material.dispose());
		this.materials = [];
		this.meshes.forEach(mesh => {
			this.main.scene.remove(mesh);
		});
		this.meshes = [];
	}
}