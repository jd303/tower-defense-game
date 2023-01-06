import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from '../core/Main';
import { OrbitController } from '../core/OrbitController';
import { Level } from './Level';
import { LevelPath } from '../LevelPath';
import { TreeCone1 } from '../environment/nature/TreeCone1';
import { UI } from '../UI';
import { Terrain } from '../environment/Terrain';
import { Mountain_Type1 } from '../environment/nature/Mountain_Type1';
import { WaveManager } from '../WaveManager';
import { TowerCubeMVP } from '../towers/Tower_CubeMVP';

import { levelDetails } from './Level_0_MVP_JSON';

export class Level0MVP extends Level {
	/**
	 * System Properties
	 * */
	orbitController: OrbitController;
	main: Main;
	UI: UI;

	/**
	 * Level Properties
	 * */
	waveManager: WaveManager;
	lights: THREE.Light[];
	levelPaths: LevelPath[] = [];

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		super(main);

		console.log('TODO:: Convert Creep to ModelAsset');

		// Set the camera
		main.cameraMain.position.y = 25;
		//main.cameraMain.position.z = 50; // Angled
		main.cameraMain.position.z = 50;
		//main.cameraMain.zoom = 20;
		main.cameraMain.lookAt(new THREE.Vector3(0, 0, 0));

		// Setup OrbitControls
		this.orbitController = new OrbitController(main.cameraMain, main.canvas);
		this.orbitController.controls.enableRotate = false;
		main.tick.registerCallback(() => {
			this.orbitController.controls.update();
		}, false);
		var minPan = new THREE.Vector3(-1, -1, -1);
		var maxPan = new THREE.Vector3(1, 1, 1);
		this.orbitController.controls.target = new Vector3(0, 0, 0);
		this.orbitController.controls.target.clamp(minPan, maxPan);

		// Create the environment
		const terrain = new LevelTerrain(main);
		this.terrain = terrain;
		main.scene.add(terrain.groupMain);

		// Create LevelPaths
		levelDetails.paths.forEach((path) => {
			const levelPath = new LevelPath(path);
			this.levelPaths.push(levelPath);
		});

		// Setup a Wave Manager
		this.waveManager = new WaveManager(levelDetails.waves, this);

		// Create 2 tree groups
		const position1 = { x: -25, z: -25 };
		const position2 = { x: 25, z: -25 };
		const position3 = { x: 30, z: 15 };
		const position4 = { x: -30, z: 25 };
		for (let i = 0; i < 200; i++) {
			const tree = new TreeCone1(main);

			const rando1 = (Math.random() - 0.5) * 30;
			const rando2 = (Math.random() - 0.5) * 30;

			let positionPick: Vector3;
			const positionRandom = Math.random();
			if (positionRandom < 0.25) {
				positionPick = new Vector3(position1.x, 0, position1.z);
			} else if (positionRandom < 0.5) {
				positionPick = new Vector3(position2.x, 0, position2.z);
			} else if (positionRandom < 0.75) {
				positionPick = new Vector3(position3.x, 0, position3.z);
			} else {
				positionPick = new Vector3(position4.x, 0, position4.z);
			}

			positionPick.x += rando1;
			positionPick.z += rando2;

			tree.groupMain.rotation.y = Math.PI * Math.random();
			//tree.groupMain.rotation.x = Math.PI * -0.07; // Fake an Orthographic look
			//tree.groupMain.rotation.x = Math.PI * -0.35;

			tree.groupMain.traverse((child) => (child.castShadow = true));

			this.addProp(tree, positionPick);

			const scale = Math.random() * 2 + 0.5;
			tree.groupMain.scale.set(scale, scale, scale);
		}

		// Create Mountains
		const mountain1 = new Mountain_Type1(main);
		this.addProp(mountain1, new Vector3(50, 0, -30));
		mountain1.groupMain.rotation.y = Math.PI * 0.75;
		mountain1.groupMain.scale.set(3, 3, 3);
		const mountain2 = new Mountain_Type1(main);
		this.addProp(mountain2, new Vector3(-50, 0, -10));
		mountain2.groupMain.rotation.y = Math.PI * -0.5;
		mountain2.groupMain.scale.set(2, 2, 2);

		// Create Lights (maybe temp, if we can get MatCaps to work
		const ambientLight = this.main.lightingManager.addAmbientLight();
		const directionalLight = this.main.lightingManager.addDirectionalLight(true);
		this.main.debugFeatures.addGUIDebugProperty(directionalLight.threeLight.position, 'x', 'Directional Light X');
		this.main.debugFeatures.addGUIDebugProperty(directionalLight.threeLight.position, 'y', 'Directional Light Y');
		this.main.debugFeatures.addGUIDebugProperty(directionalLight.threeLight.position, 'z', 'Directional Light Z');

		/*const ambientLight = new THREE.AmbientLight('white', 0.1);
		this.main.scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight('white', 1.25);
		directionalLight.position.z = 30;
		directionalLight.position.y = 20;
		this.main.scene.add(directionalLight);*/

		// Setup a UI (towers defaulted, but in the future players should be able to choose)
		this.UI = new UI(this.main);
		console.log(TowerCubeMVP.UI);
		console.log(TowerCubeMVP.UI.getProperties());
		this.UI.addTowerUI([TowerCubeMVP.UI.getProperties()]);
		this.UI.attach();

		// Create a raycast watcher
		this.main.interactionManager.addRaycasterSubjects(this.creeps);
		/*this.main.interactionManager.addClickWatcherSubject(floorMesh);
		window.addEventListener('click', () => {
			if (this.main.interactionManager.lastIntersectionPoint) {
				let newTower = new TowerCubeMVP(main);
				let point = this.main.interactionManager.lastIntersectionPoint;
				newTower.groupMain.position.set(point.x, 0, point.z);
				newTower.groupMain.rotation.y = Math.PI / 2;
				main.scene.add(newTower.groupMain);
				main.addTower(newTower);
			}
		});*/

		// Enable shadows
		setTimeout(() => {
			//this.main.renderer.physicallyCorrectLights = true;
			//this.main.renderer.outputEncoding = THREE.sRGBEncoding;
			this.main.renderer.shadowMap.enabled = true;
			this.main.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			this.props.forEach((prop) => prop.enableShadows(true, false));
			this.towers.forEach((tower) => tower.enableShadows(true, true));
			this.creeps.forEach((creep) => creep.enableShadows(true, true));

			this.terrain.enableShadows(false, true);

			this.main.lightingManager.addShadowsToLight(directionalLight);

			console.log(this.terrain);
			console.log(directionalLight);
		}, 1000);
	}
}

class LevelTerrain extends Terrain {
	/**
	 * Prop Properties
	 * */
	assetPath: string = 'assets/models/levels/Level0MVP.glb';

	constructor(main: Main) {
		super(main);
		this.loadModel();
	}
}
