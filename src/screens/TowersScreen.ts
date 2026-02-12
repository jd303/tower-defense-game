import * as THREE from 'three';
import { Main } from '../core/Main';
import { Screen } from '../screens/Screen';
import { CameraService, CameraSettings } from '../core/CameraService';
import { LightingService } from '../core/LightingService';
import { UIService } from '../game/UIService';
import { UIRegions } from '../game/UIProperties';
import { Interactable2, InteractableOrders, InteractionEvent, InteractionService2 } from '../game/InteractionService2';
import { LoaderService } from '../core/LoaderService';
import { UserDataService } from '../userData/UserDataService';
import { ThreeDeeButton } from './_ThreeDeeButton';
import { Tower } from '../environment/towers/Tower';
import { AssetGenerator } from '../environment/assets/AssetGenerator';

export class TowersScreen extends Screen {
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
	textures: THREE.Texture[] = [];
	materials: THREE.Material[] = [];
	meshes: THREE.Mesh[] = [];
	toggleButtons: ThreeDeeButton[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.createCamera();
		this.createLighting();
		this.createUI();
		this.createWallOfTowers();

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
	async createWallOfTowers() {
		await this.main.s('UserData').awaitDev();

		const towers = ['TowerArcher', 'TowerMage', 'TowerBomber'];

		const sLoader: LoaderService = this.main.s('Loader');
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		const sLoadout: UserDataService = this.main.s('UserData');

		const equippedTowers = await sLoadout.getEquippedTowers();
		const equippedtowerNames = equippedTowers.map(tower => tower.assetProperties.assetName);

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

		// Create Toggle Buttons
		const yPosDifference = Math.random() * 2.5 + 5;
		towers.forEach(async (towerName: string, index: number) => {
			const positionX = index * 25 - 50;

			const tower = await AssetGenerator.getAssetAsSpriteAsset(towerName) as typeof Tower;

			const toggleButton = new ThreeDeeButton(this.main, towerName, tower.towerProperties.icon);
			this.main.scene.add(toggleButton.groupMain);
			toggleButton.groupMain.position.x = positionX;
			toggleButton.groupMain.position.z = 1;
			toggleButton.groupMain.position.y = yPosDifference * (index % 2 == 0 && -1 || 1);
			this.toggleButtons.push(toggleButton);

			if (equippedtowerNames.includes(towerName)) toggleButton.setEquipped(true);

			sInteraction.registerInteractable(new Interactable2('ui-component', InteractableOrders.default, toggleButton));
			sInteraction.registerInteractableListener('ui-component', `equipTower-${towerName}`, this.triggerToggleTower.bind(this), false);
		});
	}

	/**
	 * Requests that we equip a tower
	 */
	triggerToggleTower(event: InteractionEvent) {
		const eventTarget = event.raycasterInteraction.object as ThreeDeeButton;

		this.requestToggleTower(eventTarget.assetName);

		return {
			handled: true,
			stopPropagation: true,
		}
	}
	async requestToggleTower(towerName: string) {
		const sLoadout: UserDataService = this.main.s('UserData');
		const equippedTowers = await sLoadout.getEquippedTowers();
		const equippedtowerNames = equippedTowers.map(tower => tower.assetProperties.assetName);

		if (equippedtowerNames.indexOf(towerName) == -1) {
			const added = await sLoadout.equipTower(towerName);
			if (added) this.toggleButtons.find(toggleButton => toggleButton.assetName == towerName)?.setEquipped(true);
		} else {
			await sLoadout.unequipTower(towerName);
			this.toggleButtons.find(toggleButton => toggleButton.assetName == towerName)?.setEquipped(false);
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
		this.toggleButtons.forEach(toggleButton => toggleButton.dispose());
		this.toggleButtons = []
	}
}