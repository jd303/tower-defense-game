import * as THREE from 'three';
import { Main } from '../core/Main';
import { Screen } from '../screens/Screen';
import { CameraService, CameraSettings } from '../core/CameraService';
import { LightingService } from '../core/LightingService';
import { UIService } from '../game/UIService';
import { UIRegions } from '../game/UIProperties';
import { Interactable2, InteractableOrders, InteractionEvent, InteractionService2 } from '../game/InteractionService2';
import { LoaderService } from '../core/LoaderService';
import { UserDataService } from '../data/UserData/UserDataService';
import { ThreeDeeButton } from './_ThreeDeeButton';
import { AssetGenerator } from '../environment/assets/AssetGenerator';
import { Hero } from '../environment/heroes/Hero';

export class HeroesScreen extends Screen {
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
		this.createWallOfHeroes();

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
	async createWallOfHeroes() {
		await this.main.s('UserData').awaitDev();

		const sUserData: UserDataService = this.main.s('UserData');
		const sLoader: LoaderService = this.main.s('Loader');
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		const sLoadout: UserDataService = this.main.s('UserData');

		await sUserData.awaitDev();
		const heroes = sUserData.userLoadout.runDiscoveries.heroes;

		const equippedHeroes = await sLoadout.getEquippedHeroes();
		const equippedHeroNames = equippedHeroes.map(hero => hero.assetProperties.assetName);

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
		heroes.forEach(async (heroName: string, index: number) => {
			const positionX = index * 25 - 50;

			const hero = await AssetGenerator.getAssetAsSpriteAsset(heroName) as typeof Hero;

			const toggleButton = new ThreeDeeButton(this.main, heroName, hero.heroProperties.iconUI);
			this.main.scene.add(toggleButton.groupMain);
			toggleButton.groupMain.position.x = positionX;
			toggleButton.groupMain.position.z = 1;
			toggleButton.groupMain.position.y = yPosDifference * (index % 2 == 0 && -1 || 1);
			this.toggleButtons.push(toggleButton);

			if (equippedHeroNames.includes(heroName)) toggleButton.setEquipped(true);

			sInteraction.registerInteractable(new Interactable2('ui-component', InteractableOrders.default, toggleButton));
			sInteraction.registerInteractableListener('ui-component', `equipHero-${heroName}`, this.triggerToggleHero.bind(this), false);
		});
	}

	/**
	 * Requests that we equip a hero
	 */
	triggerToggleHero(event: InteractionEvent) {
		const eventTarget = event.raycasterInteraction.object as ThreeDeeButton;

		this.requestToggleHero(eventTarget.assetName);

		return {
			handled: true,
			stopPropagation: true,
		}
	}
	async requestToggleHero(heroName: string) {
		const sLoadout: UserDataService = this.main.s('UserData');
		const equippedHeroes = await sLoadout.getEquippedHeroes();
		const equippedHeroNames = equippedHeroes.map(hero => hero.assetProperties.assetName);

		if (equippedHeroNames.indexOf(heroName) == -1) {
			const added = await sLoadout.equipHero(heroName);
			if (added) this.toggleButtons.find(toggleButton => toggleButton.assetName == heroName)?.setEquipped(true);
		} else {
			await sLoadout.unequipHero(heroName);
			this.toggleButtons.find(toggleButton => toggleButton.assetName == heroName)?.setEquipped(false);
		}
	}

	/**
	 * When unloading this 
	 */
	dispose() {
		this.disposeScreenCommons();
		this.toggleButtons.forEach(button => button.dispose());
		this.toggleButtons = []
	}
}