import * as THREE from 'three';
import { Level } from './Level';
import { Main } from '../core/Main';
import { TerrainTypes } from '../dataTypes/LevelInterfaces';
import { PathService } from '../game/PathService';
import { PropZone, PropZoneArguments } from '../environment/propManager/PropZone';
import { SplineBuilder } from '../core/SplineBuilder';
import { TowerPlacementZone } from '../environment/towers/TowerPlacementZone';

export class LevelEditor {
	currentLevel: Level;
	main: Main;
	level: Level;
	debugTerrainGuides: (THREE.Line | THREE.Mesh | THREE.CylinderGeometry | THREE.Material)[] = [];
	zoneEditors: ZoneEditors[] = [];

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
	getLevelEditorFeatures() {
		return [{
			functionName: 'toggleTerrainGuides',
			name: "Toggle Terrain Guides"
		},
		{
			functionName: 'switchLevelTerrain',
			name: "Switch Terrain",
		},
		{
			functionName: 'createZone',
			name: 'Create Prop Zone'
		},
		{
			functionName: 'enablePropZoneEditors',
			name: 'Enable Zone Editors',
		},
		{
			functionName: 'disposeLevel',
			name: "Dispose Level"
		}];
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
	toggleTerrainGuides() {
		// Delete existing
		if (this.debugTerrainGuides.length) {
			this.debugTerrainGuides.forEach(item => {
				switch (true) {
					case (item instanceof THREE.Material || item instanceof THREE.CylinderGeometry):
						(item as THREE.Material | THREE.CylinderGeometry).dispose();
						break;
					case (item instanceof THREE.Mesh || item instanceof THREE.Line):
						this.main.scene.remove(item as THREE.Mesh | THREE.Line);
						break;
				}

			});
			this.debugTerrainGuides = [];
		}

		// Create
		else {
			const sPath: PathService = this.main.s('Path');
			const lineMaterialRed = new THREE.LineDashedMaterial({
				color: 'red',
				dashSize: 1,
				gapSize: 0.5,
			});
			const lineMaterialInner = new THREE.LineBasicMaterial({
				color: '#fff',
				linewidth: 20,
			});
			const lineMaterialOuter = new THREE.LineBasicMaterial({
				color: '#aaa',
				linewidth: 20,
			});
			this.debugTerrainGuides.push(lineMaterialRed);
			this.debugTerrainGuides.push(lineMaterialInner);
			this.debugTerrainGuides.push(lineMaterialOuter);

			// Guide Lines
			const createLine = (p1: THREE.Vector2, p2: THREE.Vector2, height: number, material: THREE.Material) => {
				const path = sPath.createCurveFromPathPoints([{ point: new THREE.Vector3(p1.x, height, p1.y) }, { point: new THREE.Vector3(p2.x, height, p2.y) }]);
				const points = path.getPoints(100);
				const lineGeometry = new THREE.BufferGeometry().setFromPoints(points as THREE.Vector3[]);
				const line = new THREE.Line(lineGeometry, material);
				line.computeLineDistances();
				this.main.scene.add(line);

				this.debugTerrainGuides.push(line);
			}

			for (let x = -100; x < 100; x += 10) {
				createLine(new THREE.Vector2(x, -100), new THREE.Vector2(x, 100), 0.2, lineMaterialRed);
			}
			for (let z = -100; z < 100; z += 10) {
				createLine(new THREE.Vector2(-100, z), new THREE.Vector2(100, z), 0.2, lineMaterialRed);
			}

			// Center Guide
			const circleGeometry = new THREE.CylinderGeometry(0.25, 0.25, 6, 12);
			const circleMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
			circleMaterial.side = THREE.DoubleSide;
			const guideMesh = new THREE.Mesh(circleGeometry, circleMaterial);
			guideMesh.position.y = 3;
			this.main.scene.add(guideMesh);
			this.debugTerrainGuides.push(circleGeometry);
			this.debugTerrainGuides.push(circleMaterial);
			this.debugTerrainGuides.push(guideMesh);

			// Border Guides
			const bgHeight = 4.0;
			const topLeft = new THREE.Vector2(-Level.levelWidth / 2, -Level.levelHeight / 2);
			const topRight = new THREE.Vector2(Level.levelWidth / 2, -Level.levelHeight / 2);
			const bottomRight = new THREE.Vector2(Level.levelWidth / 2, Level.levelHeight / 2);
			const bottomLeft = new THREE.Vector2(-Level.levelWidth / 2, Level.levelHeight / 2);
			createLine(topLeft, topRight, bgHeight, lineMaterialInner);
			createLine(topRight, bottomRight, bgHeight, lineMaterialInner);
			createLine(bottomRight, bottomLeft, bgHeight, lineMaterialInner);
			createLine(bottomLeft, topLeft, bgHeight, lineMaterialInner);

			const outerExtra = 20;
			const topLeftOuter = new THREE.Vector2(-Level.levelWidth / 2 - outerExtra, -Level.levelHeight / 2 - outerExtra);
			const topRightOuter = new THREE.Vector2(Level.levelWidth / 2 + outerExtra, -Level.levelHeight / 2 - outerExtra);
			const bottomRightOuter = new THREE.Vector2(Level.levelWidth / 2 + outerExtra, Level.levelHeight / 2 + outerExtra);
			const bottomLeftOuter = new THREE.Vector2(-Level.levelWidth / 2 - outerExtra, Level.levelHeight / 2 + outerExtra);
			createLine(topLeftOuter, topRightOuter, bgHeight, lineMaterialOuter);
			createLine(topRightOuter, bottomRightOuter, bgHeight, lineMaterialOuter);
			createLine(bottomRightOuter, bottomLeftOuter, bgHeight, lineMaterialOuter);
			createLine(bottomLeftOuter, topLeftOuter, bgHeight, lineMaterialOuter);
		}
	}

	/**
	 * Sets the level's terrain
	 */
	switchLevelTerrain() {
		if (this.level?.terrain?.terrainType == TerrainTypes.grass) {
			this.level.setTerrain(TerrainTypes.sand);
		} else {
			this.level.setTerrain(TerrainTypes.grass);
		}
	}

	/**
	 * Creates a new zone
	 */
	createZone() {
		const propZoneArguments: PropZoneArguments = {
			propNames: [{ name: "ShrubWide", chance: 1 }],
			propSparseness: 25,
			propScale: 1,
			positionRandom: 0.15,
			scaleRandom: { all: 2 },
			environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0x508100,
				bevelColour: 0x508100,
				smooth: true
			},
			zonePoints: [{ point: new THREE.Vector3(-100, 0, -40) }, { point: new THREE.Vector3(-90, 0, -40) }, { point: new THREE.Vector3(-90, 0, -30) }, { point: new THREE.Vector3(-100, 0, -30) }],
		}
		new PropZone(propZoneArguments, this.main);

		console.group();
		console.log("%c *************************************************************** \nProp Zone Created! \n\n - Enable Prop Zone Editors to manage. \n - Created top left of map \n ***************************************************************", "color: green");
		console.groupEnd();
	}

	/**
	 * Enabled Zone editing
	 */
	registerExistingZone(zoneEditable: PropZone | TowerPlacementZone) {
		this.zoneEditors.push({ zone: zoneEditable });
	}
	enablePropZoneEditors() {
		console.group();
		console.log("%c *************************************************************** \nProp Zone Editors Created! \n\n - Long Press a point to add adjacent points. \n - Double click a point to remove it \n ***************************************************************", "color: green");
		console.groupEnd();
		this.zoneEditors.forEach(editor => {
			if (!editor.splineBuilder) {
				editor.splineBuilder = new SplineBuilder(this.main, { bezierEnabled: false, makeFromPoints: editor.zone.arguments.zonePoints, onUpdate: editor.zone.debugZoneEditorUpdated.bind(editor.zone) });
			}
		});
	}
}

type ZoneEditors = {
	zone: PropZone | TowerPlacementZone;
	splineBuilder?: SplineBuilder;
}
