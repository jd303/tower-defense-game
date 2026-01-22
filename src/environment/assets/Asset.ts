import THREE from "three";
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LocationService } from '../../game/LocationService';
import { LevelService } from '../../levels/LevelService';
import { StateMachine } from '../../core/StateMachine';
import { Interactable2, InteractableOrders, InteractableTypes, InteractionService2 } from '../../game/InteractionService2';
import { Stats } from "../Stats";

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
	 * Setup Properties
	 */
	interactiveTypeName: InteractableTypes;
	interactiveOrder: InteractableOrders;
	interactive: boolean;
	createGroups: boolean = true;

	/**
	 * System Properties
	 * */
	main: Main;
	sLocation: LocationService;
	sLevel: LevelService;

	/**
	 * Three Properties
	 * */
	groupMain: THREE.Group; // Main group for asset
	selected: boolean;
	selectionGeometry?: THREE.BoxGeometry;
	selectionGeometryScale: number = 1.5;
	selectionVisibleMesh?: THREE.Mesh;

	/**
	 * Game Asset Properties
	 * */
	stateMachine: StateMachine;
	stats: Stats;

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
		this.groupMain.name = `main-${assetName}`;
		this.main.scene.add(this.groupMain);
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	public readonly setInteractive = () => {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractable(new Interactable2(this.interactiveTypeName, this.interactiveOrder, this));
	}
	public readonly unsetInteractive = () => {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.deregisterInteractableByObject(this);
	}

	/**
	 * Moves an Asset along a path according to its movement speed
	 * */
	public readonly animationMove = (timeProperties: TickTimeProperties) => { }

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
	 * When the Hero is healed
	 * */
	public readonly stateEnterHealing = () => {
		const healingAnimationGroup = new THREE.Group();

		this.stateExitHealing();

		for (let x = 0; x < 4; x++) {
			const thisCross = AssetCommons.healingCrossMesh();
			thisCross.position.x += Math.random() - 0.5;
			thisCross.position.y += Math.random() + 2.5;
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
	* Adds geometry for selection
	*/
	public readonly addSelectionGeometry = () => {
		if (!this.groupMain) return;

		// Get the size
		const hitboxSize = new THREE.Vector3();
		const box = new THREE.Box3().setFromObject(this.groupMain);
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
		this.selectionVisibleMesh = AssetCommons.selectionCircleMesh(width, thickness);
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
	 * When completely removing this object
	 */
	abstract dispose(): void;
}

export abstract class AssetCommons {
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