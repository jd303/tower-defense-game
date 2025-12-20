import * as THREE from 'three';
import { Level } from './Level';
import { Main } from '../core/Main';
import { TerrainTypes } from '../data/LevelInterfaces';
import { PathService } from '../game/PathService';

export class LevelCreator {
	currentLevel: Level;
	main: Main;
	level: Level;
	guidingLines: THREE.Line[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main, level: Level) {
		this.main = main;
		this.level = level;
	}

	/**
	 * 
	 */
	getLevelCreatorFeatures() {
		return ['disposeLevel', 'createDebugGuides', 'setLevelTerrain', 'createZone'];
	}

	/**
	 * Disposes a level
	 */
	disposeLevel() {
		this.level.disposeLevel();
	}

	/**
	 * Creates debug lines
	 */
	createDebugGuides() {
		const sPath: PathService = this.main.s('Path');
		const lineMaterialRed = new THREE.LineDashedMaterial({
			color: 'red',
			dashSize: 1,
			gapSize: 0.5,
		});
		const lineMaterialInner = new THREE.LineBasicMaterial({
			color: '#ccc',
			linewidth: 20,
		});
		const lineMaterialOuter = new THREE.LineBasicMaterial({
			color: '#fff',
			linewidth: 20,
		});

		// Guide Lines
		const createLine = (x1: number, z1: number, x2: number, z2: number, material: THREE.Material) => {
			const path = sPath.createCurveFromPathPoints([{ point: new THREE.Vector3(x1, 0.2, z1) }, { point: new THREE.Vector3(x2, 0.2, z2) }]);
			const points = path.getPoints(100);
			const lineGeometry = new THREE.BufferGeometry().setFromPoints(points as THREE.Vector3[]);
			const line = new THREE.Line(lineGeometry, material);
			line.computeLineDistances();
			this.main.scene.add(line);
		}

		for (let x = -100; x < 100; x += 10) {
			createLine(x, -100, x, 100, lineMaterialRed);
		}
		for (let z = -100; z < 100; z += 10) {
			createLine(-100, z, 100, z, lineMaterialRed);
		}

		// Center Guide
		const circleGeometry = new THREE.CircleGeometry(1, 12);
		const circleMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
		circleMaterial.side = THREE.DoubleSide;
		const guideMesh = new THREE.Mesh(circleGeometry, circleMaterial);
		guideMesh.rotation.x = Math.PI / 2;
		guideMesh.position.y = 0.2;
		this.main.scene.add(guideMesh);

		// Border Guides
		createLine(-85, -85, 85, -85, lineMaterialInner); // top inner
		createLine(-85, -85, -85, 85, lineMaterialInner); // left inner
		createLine(-85, 85, 85, 85, lineMaterialInner); // bottom inner
		createLine(85, -85, 85, 85, lineMaterialInner); // right inner

		createLine(-92, -92, 92, -92, lineMaterialOuter); // top inner
		createLine(-92, -92, -92, 92, lineMaterialOuter); // left inner
		createLine(-92, 92, 92, 92, lineMaterialOuter); // bottom inner
		createLine(92, -92, 92, 92, lineMaterialOuter); // right inner
	}

	/**
	 * Sets the level's terrain
	 */
	setLevelTerrain() {
		this.level.setTerrain(TerrainTypes.grass);
	}

	/**
	 * Creates a new zone (what type????!?!!?!!!)
	 */
	createZone() {
		console.log("CREATE ZONE");
	}
}
