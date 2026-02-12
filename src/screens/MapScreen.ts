import * as THREE from 'three';
import { Main } from '../core/Main';
import { Screen } from '../screens/Screen';
import { CameraService, CameraSettings } from '../core/CameraService';
import { LightingService } from '../core/LightingService';
import { UIService } from '../game/UIService';
import { UIRegions } from '../game/UIProperties';
import { Interactable2, InteractableOrders, InteractionEvent, InteractionService2 } from '../game/InteractionService2';

export class MapScreen extends Screen {
	/**
	 * System Properties
	 * */
	main: Main;
	cameraSettings: CameraSettings = {
		name: 'cam-map-ortho',
		near: 0.01,
		far: 1000,
		zoom: 0.7,
		x: 0,
		y: 75,
		z: 150,
		minPolarAngle: 0,
		maxPolarAngle: 1,
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
	mapNodes: MapNode[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.createCamera();
		this.createLighting();
		this.createUI();
		//this.createCaravanTent();
		this.createCaravanScene();
		this.createMapPoints();

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
		ambientLight.threeLight.intensity = 0.25;
		sLighting.enableLight(ambientLight);
		const directionalLight = sLighting.createDirectionalLight("Directional");
		directionalLight.threeLight.intensity = 2;
		directionalLight.enableShadows();
		sLighting.enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');

		sLighting.setRendererShadows(true);
	}

	/**
	 * Go UI!
	 */
	createUI() {
		const sUI: UIService = this.main.s('UI');

		// Home button
		const btHome = sUI.createIconButton('assets/common/ico.home.png', UIRegions.TopLeft);
		btHome.addClickBehaviour(() => {
			window.location.hash = '';
		});
		sUI.addButtonToUI(btHome);

		// Heroes button
		const btHeroes = sUI.createIconButton('assets/common/buttons/bt.heroes.webp', UIRegions.BottomCenter);
		btHeroes.addClickBehaviour(() => {
			window.location.hash = 'heroes';
		});
		sUI.addButtonToUI(btHeroes);

		// Powers button
		const btPowers = sUI.createIconButton('assets/common/buttons/bt.powers.webp', UIRegions.BottomCenter);
		btPowers.addClickBehaviour(() => {
			window.location.hash = 'powers';
		});
		sUI.addButtonToUI(btPowers);

		// Towers button
		const btTowers = sUI.createIconButton('assets/common/buttons/bt.towers.webp', UIRegions.BottomCenter);
		btTowers.addClickBehaviour(() => {
			window.location.hash = 'towers';
		});
		sUI.addButtonToUI(btTowers);

		// Upgrades button
		const btUpgrades = sUI.createIconButton('assets/common/buttons/bt.upgrades.webp', UIRegions.BottomCenter);
		btUpgrades.addClickBehaviour(() => {
			window.location.hash = 'upgrades';
		});
		sUI.addButtonToUI(btUpgrades);
	}

	/**
	 * Creates a caravan scene
	 */
	createCaravanScene() {
		const caravanBoundsGeometry = new THREE.BoxGeometry(200, 150, 100);
		const caravanBoundsMaterial = new THREE.MeshStandardMaterial({ color: 0x967C48, side: THREE.BackSide });
		const caravanMesh = new THREE.Mesh(caravanBoundsGeometry, caravanBoundsMaterial);
		caravanMesh.position.set(0, 75, 30);
		caravanMesh.castShadow = true;
		caravanMesh.receiveShadow = true;
		this.geometries.push(caravanBoundsGeometry);
		this.materials.push(caravanBoundsMaterial);
		this.meshes.push(caravanMesh);
		this.main.scene.add(caravanMesh);

		const mapTableGeometry = new THREE.BoxGeometry(100, 30, 50);
		const mapTableMaterial = new THREE.MeshStandardMaterial({ color: 0x6A4F17 });
		const mapTableMesh = new THREE.Mesh(mapTableGeometry, mapTableMaterial);
		mapTableMesh.position.set(0, 15, 0);
		mapTableMesh.castShadow = true;
		mapTableMesh.receiveShadow = true;
		this.geometries.push(mapTableGeometry);
		this.materials.push(mapTableMaterial);
		this.meshes.push(mapTableMesh);
		this.main.scene.add(mapTableMesh);
	}

	/**
	 * Creates map points based on the user's progression
	 */
	createMapPoints() {
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		let levels = ['Sandbox', 'Level_1', 'Level_2'];

		levels.forEach((levelCode: string, index) => {
			const mapNode = new MapNode(levelCode);
			mapNode.groupMain.position.set(-35 + (index * 10), 30, 0);
			sInteraction.registerInteractable(new Interactable2('ui-component', InteractableOrders.default, mapNode));
			sInteraction.registerInteractableListener('ui-component', 'loadLevel', this.requestLoadLevel);
			this.main.scene.add(mapNode.groupMain);
			this.mapNodes.push(mapNode);
		});
	}

	/**
	 * Requests to load a level
	 */
	requestLoadLevel(event: InteractionEvent) {
		console.error("Need to add confirmation of loading a level");

		window.location.hash = `game/${(event.raycasterInteraction.object as MapNode).levelCode}`;

		return {
			handled: true,
			stopPropagation: true
		}
	}

	/**
	 * When unloading this 
	 */
	dispose() {
		this.disposeScreenCommons();
		this.mapNodes.forEach(node => node.dispose(this.main));
		this.mapNodes = [];
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

export class MapNode {
	static MapNodeGeometry = () => new THREE.BoxGeometry(5, 5, 5);
	static MapNodeMaterial = () => new THREE.MeshStandardMaterial({ color: 0x0000ff });

	levelCode: string;
	groupMain: THREE.Group;
	geometry: THREE.BoxGeometry;
	material: THREE.Material;
	mesh: THREE.Mesh;

	constructor(levelCode: string) {
		this.levelCode = levelCode;
		this.groupMain = new THREE.Group();
		this.groupMain.name = `mapnode-${levelCode}`;
		this.geometry = MapNode.MapNodeGeometry();
		this.material = MapNode.MapNodeMaterial();
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.groupMain.add(this.mesh);

		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
	}

	/**
	 * Deletes self
	 */
	dispose(main: Main) {
		main.scene.remove(this.groupMain);
		this.geometry.dispose();
		this.material.dispose();
	}
}