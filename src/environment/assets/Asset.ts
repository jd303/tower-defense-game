import THREE from "three";
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LocationService } from '../../game/LocationService';
import { LevelService } from '../../levels/LevelService';
import { MovePathManager } from '../MovePathManager';
import { CreepStats } from '../creeps/CreepStats';
import { HeroStats } from '../heroes/HeroStats';
import { TowerStats } from '../towers/TowerStats';
import { StateMachine } from '../../core/StateMachine';
import { Interactable2, InteractableOrders, InteractableTypes, InteractionEvent, InteractionService2 } from '../../game/InteractionService2';
import { SpriteAsset } from "./SpriteAsset";

export abstract class Asset {
	/**
	 * Setup Properties
	 * */
	static assetName: string;
	static assetPath: string;
	static assetScale: number = 0.4; // default
	static assetPositionY: number = 0; // default

	/**
	 * Saved Properties
	 */
	assetName: string;
	assetType: string;
	assetPositionY: number;

	/**
	 * 
	 */
	typeName: InteractableTypes;
	interactiveOrder: InteractableOrders;
	interactive: boolean;

	/**
	 * System Properties
	 * */
	main: Main;
	sLocation: LocationService;
	sLevel: LevelService;

	/**
	 * Three Properties
	 * */
	groupMain: THREE.Group; // Outermost group - transforms the whole group
	groupTransforms: THREE.Group; // Middle group - applies minor transformations
	groupFacing: THREE.Group; // Middle group - applies facing
	groupModel: THREE.Group; // Innermost group - applies status transforms
	selected: boolean;
	selectionGeometry?: THREE.BoxGeometry;
	selectionGeometryScale: number = 1.5;
	selectionVisibleMesh?: THREE.Mesh;

	/**
	 * Game Asset Properties
	 * */
	stateMachine: StateMachine;
	movePathManager: MovePathManager = new MovePathManager(this);
	stats: HeroStats | CreepStats | TowerStats;

	/**
	 * Health bar
	 * */
	healthBar: THREE.Group | null;
	healthBarGroupName: string = 'healthbargroup';
	healthBarName: string = 'healthbar';
	healthBarY: number = 1.25;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetType: string) {
		this.main = main;

		this.assetName = assetName;
		this.assetType = assetType;

		this.sLocation = this.main.s('Location');
		this.sLevel = this.main.s('Level');

		this.groupMain = new THREE.Group();
		this.groupTransforms = new THREE.Group();
		this.groupFacing = new THREE.Group();
		this.groupModel = new THREE.Group();

		this.groupFacing.add(this.groupModel);
		this.groupTransforms.add(this.groupFacing);
		this.groupMain.add(this.groupTransforms);

		this.main.scene.add(this.groupMain);
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	public readonly setInteractive = () => {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractable(new Interactable2(this.typeName, this.interactiveOrder, this));
	}
	public readonly unsetInteractive = () => {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.deregisterInteractableByObject(this);
	}

	/**
	 * Moves an Asset along a path according to its movement speed
	 * */
	public readonly animationMove = (timeProperties: TickTimeProperties) => {
		const path = this.movePathManager.activePath;
		if (!path) return new Error('Set animation state to movement with no active path');

		// Calculate travel distance
		let distanceSinceLastFrame = timeProperties.deltaTime * path.pathTravelPercentagePerSec;
		path.pathProgress = Math.min(1, path.pathProgress + distanceSinceLastFrame);

		// Set a point and animate
		const point = path.path.getPoint(path.pathProgress) as THREE.Vector3;
		this.setPosition(point);

		if (this instanceof SpriteAsset) {
			// Set the look at
			if (path.pathProgress < 0.95) {
				const currentPoint = path.path.getPoint(path.pathProgress) as THREE.Vector3;
				const pointAhead = path.path.getPoint(path.pathProgress + 0.05) as THREE.Vector3;
				this.spriteSheetFrameManager.mirrorSpriteSheet(pointAhead.x < currentPoint.x);
			}
		} else {
			// Jiggle animation
			const jiggleY = Math.sin(timeProperties.elapsedTime * 50) / 20;
			this.groupTransforms.position.y = jiggleY;

			console.log("SET MODEL ASSET FACING");
		}

		// If this asset has finished its path
		if (path.pathProgress >= 0.99) {
			const endOfPath: boolean = this.movePathManager.resolveEndOfPath();
			if (endOfPath) this.finaliseEndOfPath();
		}
	}

	/**
	 * Sets the position of the asset
	 */
	public abstract setPosition(point: THREE.Vector3): void;

	/**
	 * Jiggles an asset to show it is attacking
	 * */
	animationAttack(timeProperties: TickTimeProperties) { }

	/**
	 * Shows that an asset is hurt
	 * */
	animationHurtMe(timeProperties: TickTimeProperties) { }

	/**
	 * Animates healing crosses
	 * */
	animationHealing() { }

	/**
	 * Finalises what happens at the end of a path
	 * Overwritten by individual classes
	 * */
	finaliseEndOfPath() { }

	/**
	 * Get expected position when it is moving
	 * */
	public readonly getExpectedPositionAt = (timeInMS: number) => {
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
	 * When the Hero is healed
	 * */
	public readonly stateEnterHealing = () => {
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
	public readonly stateExitHealing = () => {
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
	 * Creates a health bar
	 * */
	public readonly createHealthBar = (percentage: number = 1) => {
		const barBG = ModelCommons.healthBarGeometry;
		const barFG = ModelCommons.healthBarGeometry;
		//barBG.setAttribute('position', new THREE.BufferAttribute(ModelCommons.healthBarVertices, 3)); // Used when healthBarGeometry was THREE.BufferGeometry
		const healthBarGroup = new THREE.Group();
		const bgMesh = new THREE.Mesh(barBG, ModelCommons.healthBarBGMaterial);
		const fgMesh = new THREE.Mesh(barFG, ModelCommons.healthBarFGMaterial);
		fgMesh.name = this.healthBarName;
		healthBarGroup.name = this.healthBarGroupName;
		healthBarGroup.add(bgMesh);
		healthBarGroup.add(fgMesh);
		healthBarGroup.position.y = this.healthBarY;
		healthBarGroup.position.z = 1;
		this.healthBar = healthBarGroup;
		this.groupTransforms.add(healthBarGroup);

		this.updateHealthBar(percentage);
	}

	/**
	 * Updates the health bar
	 * */
	public readonly updateHealthBar = (percentage: number) => {
		const healthBarGroup = this.groupTransforms.getObjectByName(this.healthBarGroupName);
		healthBarGroup!.scale.x = percentage;
		//healthBarGroup!.position.x = (this.stats.hp_current / this.stats.hp_total) - 1; // left aligned
		healthBarGroup!.position.x = 0;
	}

	/**
	 * Removes a health bar if one exists
	 * */
	public readonly removeHealthBar = () => {
		if (this.healthBar) {
			this.groupTransforms.remove(this.healthBar);
			this.healthBar = null;
		}
	}

	/**
	* Adds geometry for selection
	*/
	public readonly addSelectionGeometry = () => {
		if (!this.groupModel) return;

		// Get the size
		const hitboxSize = new THREE.Vector3();
		const box = new THREE.Box3().setFromObject(this.groupModel);
		box.getSize(hitboxSize);

		const hitBoxGeometry = new THREE.BoxGeometry(hitboxSize.x, hitboxSize.y, hitboxSize.z);
		const hitBox = new THREE.Mesh(
			hitBoxGeometry,
			new THREE.MeshBasicMaterial({ visible: false })
		);
		hitBox.scale.set(this.selectionGeometryScale, 1, this.selectionGeometryScale);
		hitBox.position.x = 0;
		hitBox.position.y = this.assetPositionY + (hitboxSize.y / 2);

		this.groupMain.add(hitBox);
	}

	/**
	 * Adds a selection visible mesh to the model
	 */
	public readonly addSelectionVisibleMesh = (width: number = 2, thickness: number = 0.25) => {
		this.selectionVisibleMesh = ModelCommons.selectionCircleMesh(width, thickness);
		this.selectionVisibleMesh.rotation.x = Math.PI * -0.5;
		this.selectionVisibleMesh.position.y = 0.15;
		this.selectionVisibleMesh.position.z = 0;
		this.groupMain.add(this.selectionVisibleMesh);
	}

	/**
	 * Removes a selection mesh from the model
	 */
	public readonly removeSelectionVisibleMesh = () => {
		this.groupMain.remove(this.selectionVisibleMesh!);
		this.selectionVisibleMesh = undefined;
	}

	/**
	 * Creates a default listener for Assets
	 */
	public readonly registerDefaultListener = () => {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractableListener(this.assetType, `${this.assetType}ClickedDefault`, this.select);
	}

	/**
	 * Overwritten
	 * */
	select(event: InteractionEvent) {
		return {
			handled: true,
			cancelListeners: true,
		}
	}
	deselect() { }
}

export class ModelCommons {
	/* Health Bar Commons */
	//static healthBarGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	static healthBarGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(2, 0.15, 0.15, 1, 1, 1);
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
	static selectionCircleMesh = (width: number = 4, thickness: number = 0.25) => {
		const geometry = new THREE.RingGeometry(width - thickness, width, 32); // inner radius, outer radius, segments
		return new THREE.Mesh(geometry, this.selectionCircleMaterial);

		/*const shape = new THREE.Shape();
		shape.moveTo(0, 0);
		shape.bezierCurveTo(2, 0, 2, 2, 2, 2);
		shape.bezierCurveTo(2, 4, 0, 4, 0, 4);
		shape.bezierCurveTo(-2, 4, -2, 2, -2, 2);
		shape.bezierCurveTo(-2, 0, 0, 0, 0, 0);

		shape.bezierCurveTo(width, 0, width, width, width, width);
		shape.bezierCurveTo(width, 2 * width, 0, 2 * width, 0, 2 * width);
		shape.bezierCurveTo(-width, 2 * width, -width, width, -width, width);
		shape.bezierCurveTo(-width, 0, 0, 0, 0, 0);

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

		return new THREE.Mesh(geometry, this.selectionCircleMaterial);*/
	}
}

export interface ShaderMaterialProperties {
	uniforms: {
		uFrameCols: { value: number },
		uFrameRows: { value: number },
		uSize: { value: number }
	},
	alphaTest: number,
	transparent: boolean
}