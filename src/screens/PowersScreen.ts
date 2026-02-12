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
import { Power } from '../environment/powers/Power';
import { AssetGenerator } from '../environment/assets/AssetGenerator';

export class PowersScreen extends Screen {
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
		this.createWallOfPowers();

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
	async createWallOfPowers() {
		await this.main.s('UserData').awaitDev();

		const powers = ['PowerTimeNoodleDistortion', 'PowerTowerMotivation', 'PowerHeroMotivation', 'PowerSpringDoorTrap', 'PowerCatapultBarrage'];

		const sLoader: LoaderService = this.main.s('Loader');
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		const sLoadout: UserDataService = this.main.s('UserData');

		const equippedPowers = await sLoadout.getEquippedPowers();
		const equippedpowerNames = equippedPowers.map(power => power.powerProperties.assetName);

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

		// Create Power Pickers
		const yPosDifference = Math.random() * 2.5 + 5;
		powers.forEach(async (powerName: string, index: number) => {
			const positionX = index * 25 - 50;

			const power = await AssetGenerator.getPowerAsAsset(powerName) as typeof Power;

			const toggleButton = new ThreeDeeButton(this.main, powerName, power.powerProperties.icon);
			this.main.scene.add(toggleButton.groupMain);
			toggleButton.groupMain.position.x = positionX;
			toggleButton.groupMain.position.z = 1;
			toggleButton.groupMain.position.y = yPosDifference * (index % 2 == 0 && -1 || 1);
			this.toggleButtons.push(toggleButton);

			if (equippedpowerNames.includes(powerName)) toggleButton.setEquipped(true);

			sInteraction.registerInteractable(new Interactable2('ui-component', InteractableOrders.default, toggleButton));
			sInteraction.registerInteractableListener('ui-component', `equipPower-${powerName}`, this.triggerTogglePower.bind(this), false);
		});
	}

	/**
	 * Requests that we equip a power
	 */
	triggerTogglePower(event: InteractionEvent) {
		const eventTarget = event.raycasterInteraction.object as ThreeDeeButton;

		this.requestTogglePower(eventTarget.assetName);

		return {
			handled: true,
			stopPropagation: true,
		}
	}
	async requestTogglePower(powerName: string) {
		const sLoadout: UserDataService = this.main.s('UserData');
		const equippedPowers = await sLoadout.getEquippedPowers();
		const equippedpowerNames = equippedPowers.map(power => power.powerProperties.assetName);

		if (equippedpowerNames.indexOf(powerName) == -1) {
			const added = await sLoadout.equipPower(powerName);
			if (added) this.toggleButtons.find(toggleButton => toggleButton.assetName == powerName)?.setEquipped(true);
		} else {
			await sLoadout.unequipPower(powerName);
			this.toggleButtons.find(toggleButton => toggleButton.assetName == powerName)?.setEquipped(false);
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