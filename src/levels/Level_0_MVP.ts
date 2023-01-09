import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from '../core/Main';
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

		// Setup OrbitControls
		this.main.interactionManager.setupOrbitControls();

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
		const position1 = { x: -60, z: -10 };
		const position2 = { x: 25, z: -25 };
		const position3 = { x: 30, z: 55 };
		const position4 = { x: -5, z: 15 };
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
		this.addProp(mountain1, new Vector3(50, 0, -60));
		mountain1.groupMain.rotation.y = Math.PI * 0.75;
		mountain1.groupMain.scale.set(3, 3, 3);
		const mountain2 = new Mountain_Type1(main);
		this.addProp(mountain2, new Vector3(-80, 0, 0));
		mountain2.groupMain.rotation.y = Math.PI * -0.5;
		mountain2.groupMain.scale.set(2, 2, 2);

		// Create Lights (maybe temp, if we can get MatCaps to work
		const ambientLight = this.main.lightingManager.addAmbientLight();
		const directionalLight = this.main.lightingManager.addDirectionalLight(true);
		this.main.debugFeatures.addDebugNumber(directionalLight.threeLight.position, 'x', -50, 50, 0.001, 'Directional Light X');
		this.main.debugFeatures.addDebugNumber(directionalLight.threeLight.position, 'y', -50, 50, 0.001, 'Directional Light Y');
		this.main.debugFeatures.addDebugNumber(directionalLight.threeLight.position, 'z', -50, 50, 0.001, 'Directional Light Z');

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
		}, 2500);

		/**
		 * DEBUG THINGS
		 * */
		/*const mat = new THREE.MeshStandardMaterial();
		mat.roughness = 0.7;
		mat.color.set('#888888');
		const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere.position.y = 5;
		sphere.position.z = 2;
		sphere.castShadow = true;
		this.scene.add(sphere);

		const sphere2 = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere2.scale.set(2, 2, 2);
		sphere2.position.y = 2;
		sphere2.position.x = 4;
		sphere2.castShadow = true;
		sphere2.receiveShadow = true;
		this.scene.add(sphere2);

		const sphere3 = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere3.scale.set(4, 4, 4);
		sphere3.position.y = 5;
		sphere3.position.x = 15;
		sphere3.castShadow = true;
		sphere3.receiveShadow = true;
		this.scene.add(sphere3);

		const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(50, 50), mat);
		plane.rotation.x = Math.PI * -0.5;
		plane.position.y = 0.1;
		plane.receiveShadow = true;
		this.scene.add(plane);
		// END DEBUG THINGS*/
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
