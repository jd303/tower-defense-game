import * as THREE from 'three';
import { Main } from '../core/Main';
import { TickTimeProperties } from '../core/TickService';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Interactable, InteractableOrders } from '../game/InteractionService';
import { LocationService } from '../game/LocationService';
import { LevelService } from '../levels/LevelService';
import { MovePathManager } from './MovePathManager';
import { CreepStats } from './creeps/CreepStats';
import { HeroStats } from './heroes/HeroStats';
import { TowerStats } from './towers/TowerStats';
import { StateMachine } from '../core/StateMachine';

export abstract class ModelAsset {
	/**
	 * Setup Properties
	 * */
	shadowsEnabled: boolean = false;
	assetPath: string;
	assetScale: number = 1; // default
	interactive: boolean;

	/**
	 * System Properties
	 * */
	main: Main;
	sLocation: LocationService;
	sLevel: LevelService;

	/**
	 * States
	 */
	stateMachine: StateMachine;

	/**
	 * Three Properties
	 * */
	geometry: any;
	material: any;
	mesh: THREE.Mesh;
	groupMain: THREE.Group; // Outermost group - transforms the whole group
	groupTransforms: THREE.Group; // Middle group - applies minor transformations
	groupFacing: THREE.Group; // Middle group - applies facing
	groupModel: THREE.Group; // Innermost group - applies status transforms
	selectionMesh?: THREE.Mesh;

	/**
	 * Movement / Path Properties (Creeps and Heroes)
	 * */
	movePathManager: MovePathManager = new MovePathManager(this);

	// Statistics
	stats: HeroStats | CreepStats | TowerStats;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
		this.sLocation = this.main.s('Location');
		this.sLevel = this.main.s('Level');

		this.groupMain = new THREE.Group();
		this.groupTransforms = new THREE.Group();
		this.groupFacing = new THREE.Group();
		this.groupModel = new THREE.Group();

		this.groupFacing.add(this.groupModel);
		this.groupTransforms.add(this.groupFacing);
		this.groupMain.add(this.groupTransforms);
	}

	/**
	 * Loads the model
	 * */
	async loadModel() {
		const model = await this.main.s('Loader').loadModel(this.assetPath);
		this.groupModel.scale.set(this.assetScale, this.assetScale, this.assetScale);
		this.groupModel.add(...model.scene.children);
		this.enableShadows();
	}

	/**
	 * Add mesh manually
	 * */
	createMesh(geometry: THREE.BufferGeometry, material: THREE.Material) {
		this.mesh = new THREE.Mesh(geometry, material);
		this.groupModel.scale.set(this.assetScale, this.assetScale, this.assetScale);
		this.groupModel.add(this.mesh);
		this.enableShadows();
	}

	/**
	 * Enabled shadows on the model
	 * */
	enableShadows(cast: boolean = true, receive: boolean = false) {
		this.groupModel.children.forEach((child: any) => {
			if (child.isMesh && this.shadowsEnabled) {
				child.castShadow = cast;
				child.receiveShadow = receive;
				child.material.needsUpdate = true;
			}
		});
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive() {
		const sInteraction = this.main.s('Interaction');
		sInteraction.registerDefaultTarget(new Interactable(InteractableOrders.props, this));
	}

	/**
	 * Moves a Model Asset along a path according to its movement speed
	 * */
	animationMove(timeProperties: TickTimeProperties) {
		const path = this.movePathManager.activePath;
		if (!path) return new Error('Set animation state to movement with no active path');

		// Calculate travel distance
		let distanceSinceLastFrame = timeProperties.deltaTime * path.pathTravelPercentagePerSec;
		path.pathProgress = Math.min(1, path.pathProgress + distanceSinceLastFrame);

		// Set a point and animate
		const point = path.path.getPoint(path.pathProgress) as THREE.Vector3;
		this.groupMain.position.set(point.x, point.y, point.z);

		// Jiggle animation
		const jiggleY = Math.sin(timeProperties.elapsedTime * 50) / 20;
		this.groupTransforms.position.y = jiggleY;

		// Set the look at
		if (path.pathProgress < 0.95) {
			const pointAhead = path.path.getPoint(path.pathProgress + 0.05) as THREE.Vector3;
			pointAhead.y = jiggleY;
			this.groupFacing.lookAt(pointAhead);
		}

		// If this asset has finished its path
		if (path.pathProgress >= 0.99) {
			const endOfPath: boolean = this.movePathManager.resolveEndOfPath();
			if (endOfPath) this.finaliseEndOfPath();
		}
	}

	/**
	 * Jiggles a model to show it is attacking
	 * */
	animationAttack(timeProperties: TickTimeProperties) {
		// Jiggle animation
		const jiggleZ = Math.sin(timeProperties.elapsedTime * 50) / 20;
		this.groupTransforms.position.z = jiggleZ;
	}

	/**
	 * Shows that a Hero is hurt
	 * */
	animationHurtMe(timeProperties: TickTimeProperties) {
		this.groupModel.position.x = Math.sin(timeProperties.elapsedTime * 50) / 12;
	}

	/**
	 * Animates healing crosses
	 * */
	animationHealing() {
		const healingCrosses = this.groupMain.getObjectByName("HealingAnimation");
		if (healingCrosses) {
			healingCrosses.children.forEach((cross, index) => {
				cross.position.y += index * 0.005 + 0.001;
			});
		}
	}

	/**
	 * Get expected position when it is moving
	 * */
	getExpectedPositionAt(timeInMS: number) {
		const path = this.movePathManager.activePath;

		if (path) {
			let distanceTravelled = timeInMS / 1000 * path.pathTravelPercentagePerSec;
			let expectedPathProgress = Math.min(1, path.pathProgress + distanceTravelled);
			return path.path.getPoint(expectedPathProgress) as THREE.Vector3;
		} else {
			return this.groupMain.position;
		}
	}

	/**
	 * Finalises what happens at the end of a path
	 * Overwritten by individual classes
	 * */
	finaliseEndOfPath() { }

	/**
	 * When the Hero is healed
	 * */
	stateEnterHealing() {
		const healingAnimationGroup = new THREE.Group();

		this.stateExitHealing();

		for (let x = 0; x < 4; x++) {
			const thisCross = ModelCommons.healingCrossMesh();
			thisCross.position.x += Math.random() - 0.5;
			thisCross.position.y += Math.random();
			const scale = Math.random() * 0.9 + 0.1;
			thisCross.scale.set(scale, scale, scale);

			healingAnimationGroup.add(thisCross);
		}

		healingAnimationGroup.name = "HealingAnimation";

		this.groupMain.add(healingAnimationGroup);
		healingAnimationGroup.position.z = 2;
	}

	/**
	 * When the Creep leaves healing state (also called when entering, to clear it out)
	 * */
	stateExitHealing() {
		const healingAnimationGroup = this.groupMain.getObjectByName("HealingAnimation");
		if (healingAnimationGroup) this.groupMain.remove(healingAnimationGroup);
	}

	/**
	 * Creates a temporary healing animation
	 * */
	createHealingEffect() {
		console.log("%c Creating healing effect", "color: green");
	}

	/**
	 * Overwritten
	 * */
	defaultClick() { }
	select() { }
	deselect() { }
}

export class ModelCommons {
	/* Health Bar Commons */
	static healthBarGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	static healthBarVertices: Float32Array = new Float32Array([
		-1, 0, 0,
		1, 0, 0,
		1, 0.25, 0,
		1, 0.25, 0,
		-1, 0.25, 0,
		-1, 0, 0,
	]);

	static healthBarBGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: 'grey' });
	static healthBarFGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: '#7AE33E' });

	/** Healing commons */
	static healingCrossBeamHorizontal = new THREE.BoxGeometry(0.5, 0.1, 0.05);
	static healingCrossBeamVertical = new THREE.BoxGeometry(0.10, 0.5, 0.05);
	static healingCrossMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
	static healingCrossMerge = BufferGeometryUtils.mergeGeometries([this.healingCrossBeamHorizontal, this.healingCrossBeamVertical]);
	static healingCrossMesh = () => { return new THREE.Mesh(this.healingCrossMerge, this.healingCrossMaterial); }

	/** Selection commons */
	static selectionCircleMaterial = new THREE.MeshBasicMaterial({ color: 0x4298B5 });
	static selectionCircleGeometry = new THREE.CircleGeometry(2, 32);
	//static selectionCircleMesh = () => { return new THREE.Mesh(this.selectionCircleGeometry, this.selectionCircleMaterial); }
	static selectionCircleMesh = () => {
		const shape = new THREE.Shape();
		shape.moveTo(0, 0);
		shape.bezierCurveTo(2, 0, 2, 2, 2, 2);
		shape.bezierCurveTo(2, 4, 0, 4, 0, 4);
		shape.bezierCurveTo(-2, 4, -2, 2, -2, 2);
		shape.bezierCurveTo(-2, 0, 0, 0, 0, 0);

		const points = shape.getPoints();
		points.forEach(item => {
			item = item.multiplyScalar(0.8);
			item.y += 0.4;
		})

		// draw the hole
		const holePath = new THREE.Shape(points.reverse());

		// add hole to shape
		shape.holes.push(holePath);
		const geometry = new THREE.ShapeGeometry(shape);

		return new THREE.Mesh(geometry, this.selectionCircleMaterial);
	}
}