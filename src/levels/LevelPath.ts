import * as THREE from 'three';
import { MovePathDefinition, PathDefinition, PathGeometryTypes, PathPoint } from '../data/PathInterfaces';
import { Main } from '../core/Main';
import { PathService } from '../game/PathService';
import { Interactable2, InteractionService2, InteractableOrders } from '../game/InteractionService2';

export class LevelPath {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Setup Properties
	 * */
	variantDistance: number = 5;

	/**
	 * Wave Properties
	 * */
	id: string;
	corePath: MovePathDefinition = {
		id: 'core',
		active: true,
		pathPoints: [],
		pathLength: 0,
		path: new THREE.CurvePath(),
		pathProgress: 0,
		pathTravelPercentagePerSec: 0,
	};
	variantPaths: MovePathDefinition[] = [];
	groupMain: THREE.Group; // Contains a pathMesh's groupmain, if created

	/**
	 * Constructor
	 * */
	constructor(pathDefinition: PathDefinition, main: Main) {
		this.id = pathDefinition.id;
		this.main = main;
		this.setCorePath(pathDefinition.pathPoints);
		this.createPathGeometry(pathDefinition);

		this.setInteractive();

		return this;
	}

	/**
	 * Sets the core path
	 * */
	setCorePath(pathPoints: PathPoint[]) {
		const sPath: PathService = this.main.s('Path');
		this.corePath.pathPoints = pathPoints;
		this.corePath.path = sPath.createCurveFromPathPoints(pathPoints);
		this.corePath.pathLength = this.corePath.path.getLength();
	}

	/**
	 * Creates a variant path for uniqueness
	 * */
	createVariantPath() {
		const sPath = this.main.s('Path');

		const variantPath = sPath.createMovePath(this.corePath.id, this.corePath.pathPoints, this.getRandomAdjustX(), this.getRandomAdjustZ());
		this.variantPaths.push(variantPath);
		return variantPath;
	}

	/**
	 * Creates a extruded path shape on the map
	 * */
	createPathGeometry(pathDefinition: PathDefinition) {
		if (pathDefinition.pathGeometry == PathGeometryTypes.none) return;

		const lineWidth = 8;
		const lineHeight = -0.1;

		// Create the path shape
		const shape = new THREE.Shape();
		shape.moveTo(0, -lineWidth / 2);
		shape.lineTo(0, lineWidth / 2);
		shape.lineTo(lineHeight, lineWidth / 2);
		shape.lineTo(lineHeight, -lineWidth / 2);
		shape.lineTo(0, -lineWidth / 2);

		// Extrude Settings
		const extrudeSettings = {
			steps: 50,
			depth: 1,
			bevelEnabled: false,
			extrudePath: this.corePath.path,
		};

		// Create the material
		let pathMaterial;
		switch (pathDefinition.pathGeometry) {
			case PathGeometryTypes.dirt:
				pathMaterial = new THREE.MeshStandardMaterial({ color: 0xbfa340 });
				break;
			case PathGeometryTypes.rock:
				pathMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
				break;
		}

		// Create the geometry and mesh and attach
		const pathGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings as any);
		const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
		pathMesh.name = 'LevelPath';

		// Create group
		this.groupMain = new THREE.Group();
		this.groupMain.name = 'LevelPath';
		this.groupMain.add(pathMesh);

		// Add shadows
		this.groupMain.children.forEach((child: any) => {
			if (child.isMesh) {
				child.castShadow = false;
				child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive() {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractable(new Interactable2('levelpath', InteractableOrders.creeps, this));
	}

	getRandomAdjustX() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}

	getRandomAdjustZ() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}
}
