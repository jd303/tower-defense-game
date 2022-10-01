import * as THREE from 'three';
import { Vector3 } from 'three';
import { PathTypes } from '../data/PathInterfaces';
import { Main } from '../core/Main';
import { OrbitController } from '../core/OrbitController';
import { TowerCubeMVPUI } from '../towers/Tower_CubeMVP';
import { Wave } from '../Wave';
import { Level } from './Level';
import { LevelPath } from '../LevelPath';
import { CreepGenerator } from '../creeps/CreepGenerator';
import { TreeCone1 } from '../environment/nature/TreeCone1';
import { UI } from '../UI';
import { Terrain } from '../environment/Terrain';

const levelDetails = {
	paths: [
		{
			id: '1',
			segments: [
				{
					type: PathTypes.straight,
					points: [new Vector3(3, 0.5, 40), new Vector3(5, 0.5, 20)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(5, 0.5, 20), new Vector3(3, 0.5, 10)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(3, 0.5, 10), new Vector3(3, 0.5, -40)],
				},
			],
		},
	],
	waves: [
		{
			id: '1',
			pathID: '1',
			difficulty: 5,
			creepGroups: [
				{
					id: '1',
					creeps: [
						{
							id: '1',
							type: 'CreepMVPSquare',
						},
						{
							id: '2',
							type: 'CreepMVPSquare',
						},
						{
							id: '3',
							type: 'CreepMVPSquare',
						},
						{
							id: '4',
							type: 'CreepMVPSquare',
						},
						{
							id: '5',
							type: 'CreepMVPSquare',
						},
					],
				},
			],
		},
	],
};

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
	lights: THREE.Light[];
	levelPaths: LevelPath[] = [];

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		super(main);

		// Setup OrbitControls
		this.orbitController = new OrbitController(main.cameraMain, main.canvas);
		main.tick.registerCallback(() => {
			this.orbitController.controls.update();
		}, false);

		// Set the camera
		main.cameraMain.position.y = 30;
		main.cameraMain.position.z = 30;
		main.cameraMain.lookAt(new THREE.Vector3(0, 0, 0));

		// Create the environment
		const terrain = new LevelTerrain(main);
		this.terrain = terrain;
		main.scene.add(terrain.groupMain);

		// Create LevelPaths
		levelDetails.paths.forEach((path) => {
			const levelPath = new LevelPath(path);
			this.levelPaths.push(levelPath);
		});

		// Create waves
		levelDetails.waves.forEach((waveDefinition) => {
			// Setup a Wave
			const wave = new Wave();

			// Check that the path exists
			const wavePath = this.levelPaths.find((path) => path.id == waveDefinition.pathID);
			if (wavePath) wave.corePath = wavePath;
			else return;

			const curveStart = wavePath.corePath.path.getPoint(0) as Vector3;

			// Create creep groups
			waveDefinition.creepGroups.forEach((creepGroup) => {
				// Create creeps
				creepGroup.creeps.forEach((creepDefinition) => {
					const creep = CreepGenerator.createCreep(creepDefinition, main);
					creep.groupMain.position.set(curveStart.x, curveStart.y, curveStart.z);

					const pathVariant = wavePath.createVariantPath(creepDefinition.id);
					creep.setPath(pathVariant);

					// Brute force animators in
					this.addCreep(creep);
				});
			});
		});

		// Create 2 tree groups
		const position1 = { x: -25, z: -25 };
		const position2 = { x: 25, z: -25 };
		const position3 = { x: 30, z: 15 };
		const position4 = { x: -30, z: 25 };
		for (let i = 0; i < 200; i++) {
			const tree = new TreeCone1(main);
			this.addProp(tree);

			const rando1 = (Math.random() - 0.5) * 20;
			const rando2 = (Math.random() - 0.5) * 20;

			let positionPick;
			const positionRandom = Math.random();
			if (positionRandom < 0.25) {
				positionPick = position1;
			} else if (positionRandom < 0.5) {
				positionPick = position2;
			} else if (positionRandom < 0.75) {
				positionPick = position3;
			} else {
				positionPick = position4;
			}

			tree.groupMain.position.x = positionPick.x + rando1;
			tree.groupMain.position.z = positionPick.z + rando2;

			const scale = Math.random() * 2 + 0.5;
			tree.groupMain.scale.set(scale, scale, scale);

			main.scene.add(tree.groupMain);
		}

		// Create Lights (maybe temp, if we can get MatCaps to work
		const ambientLight = new THREE.AmbientLight('white', 0.9);
		this.main.scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight('white', 1.5);
		this.main.scene.add(directionalLight);

		// Setup a UI
		this.UI = new UI(this.main);
		this.UI.addUIElements([TowerCubeMVPUI.properties]);
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
