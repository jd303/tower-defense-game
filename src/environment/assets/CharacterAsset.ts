import THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { EventHandlingResult, InteractableOrders, InteractionEvent, InteractionService2 } from '../../game/InteractionService2';
import { ShaderAnimationAttributes, SpriteAsset, SpriteAssetProperties, SpriteSheetRow } from "./SpriteAsset";
import { CharacterStats } from '../Stats';
import { MovePathManager } from "../MovePathManager";
import { AssetCommons } from "./Asset";
import { TweenService } from "../../core/TweenService";

export abstract class CharacterAsset extends SpriteAsset {
	/**
	 * Setup Properties
	 * */
	movePathManager: MovePathManager = new MovePathManager(this);
	interactiveOrder: InteractableOrders;
	stats: CharacterStats;

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
	constructor(main: Main, assetProperties: SpriteAssetProperties, spriteSheetRows: SpriteSheetRow[], animationAttributes: ShaderAnimationAttributes) {
		super(main, assetProperties, spriteSheetRows, animationAttributes);

		this.registerOnLoadCallback(() => {
			this.createSelectionGeometry();
			this.registerDefaultListener();
			this.stateMachine.activateInitialState();
		});
	}

	/**
	 * Creates invisible geometry for selection
	 */
	createSelectionGeometry() {
		//const size = this.instancedMesh.getSizeOfInstance(this.instancedMeshIndex);
		//const geometry = new THREE.BoxGeometry(size.x * 0.9, size.y * 0.9, size.z);
		const geometry = new THREE.BoxGeometry(this.assetScale * 0.9, this.assetScale * 0.9, this.assetScale * 0.1);
		const material = new THREE.MeshBasicMaterial();
		material.visible = false
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = this.instancedMeshPosition.position.y;
		mesh.name = `${this.assetName}-selector`;
		this.groupMain.add(mesh);
	}

	/**
	 * Animates by moving along a movePath
	 */
	animationMove = (timeProperties: TickTimeProperties) => {
		const path = this.movePathManager.activePath;
		if (!path) return new Error('Set animation state to movement with no active path');

		// Calculate travel distance
		let distanceSinceLastFrame = timeProperties.deltaTime * path.pathTravelPercentagePerSec;
		path.pathProgress = Math.min(1, path.pathProgress + distanceSinceLastFrame);

		// Set a point and animate
		const point = path.path.getPoint(path.pathProgress) as THREE.Vector3;
		this.setPosition(point);

		// Set the look at
		if (path.pathProgress > path.mirrorFacingPercentages![0]?.perc) {
			try {
				this.spriteSheetFrameManager.mirrorSpriteSheet(path.mirrorFacingPercentages![0].mirror);
				path.mirrorFacingPercentages!.splice(0, 1);
			} catch (e) {
				console.error(`SpriteSheetFrameManager doesn't exist in animationMove - race condition? ${this.assetName}`);
			}
		}

		// If this asset has finished its path
		if (path.pathProgress >= 0.99) {
			const endOfPath: boolean = this.movePathManager.resolveEndOfPath();
			if (endOfPath) this.finaliseEndOfPath();
		}
	}

	/**
	 * Animates a Character to show it is attacking
	 * */
	animationAttack(timeProperties: TickTimeProperties) {
		//console.log("NO Attack animation yet")
	}

	/**
	 * Animates to show that a Character is hurt
	 * */
	animationHurtMe(timeProperties: TickTimeProperties) {
		//console.log("NO Hurt animation yet")
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
	 * Returns the expected position of a creature on a movepath
	 */
	public getExpectedPositionAt(timeInMS: number) {
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
	 * Character States
	 */
	stateEnterStunned() {
		console.log("%c ENTERING STUNNED", 'color: pink');
	}
	stateExitStunned() {
		console.log("%c LEAVING STUNNED", 'color: pink');
	}
	stateEnterHurting() {
		const sTween: TweenService = this.main.s('Tween');
		this.instancedMeshPositionAdjustment = new THREE.Vector3(-0.25, 0, 0);
		const to = new THREE.Vector3(0, 0, 0);

		sTween.createTween({
			name: 'character_wobble',
			targetObject: this.instancedMeshPositionAdjustment,
			modifiedPropertyObject: to,
			durationMS: 250,
			easing: TWEEN.Easing.Cubic.Out,
			/*onUpdate: (_: any, elapsedTime: any) => {
				console.log(_);
			},
			onComplete: () => { }*/
		});
	}

	/**
	 * Creates a health bar
	 * */
	public readonly createHealthBar = (percentage: number = 1) => {
		const barBG = AssetCommons.healthBarGeometry;
		const barFG = AssetCommons.healthBarGeometry;
		//barBG.setAttribute('position', new THREE.BufferAttribute(AssetCommons.healthBarVertices, 3)); // Used when healthBarGeometry was THREE.BufferGeometry
		const healthBarGroup = new THREE.Group();
		const bgMesh = new THREE.Mesh(barBG, AssetCommons.healthBarBGMaterial);
		const fgMesh = new THREE.Mesh(barFG, AssetCommons.healthBarFGMaterial);
		fgMesh.name = this.healthBarName;
		healthBarGroup.name = this.healthBarGroupName;
		healthBarGroup.add(bgMesh);
		healthBarGroup.add(fgMesh);
		healthBarGroup.position.y = this.healthBarY;
		healthBarGroup.position.z = 2;
		this.healthBar = healthBarGroup;
		this.groupMain.add(healthBarGroup);

		this.updateHealthBar(percentage);
	}

	/**
	 * Updates the health bar
	 * */
	public readonly updateHealthBar = (percentage: number) => {
		const healthBarGroup = this.groupMain.getObjectByName(this.healthBarGroupName);
		healthBarGroup!.scale.x = percentage;
		//healthBarGroup!.position.x = (this.stats.activeStats.life.current / this.stats.activeStats.life.total) - 1; // left aligned
		healthBarGroup!.position.x = 0;
	}

	/**
	 * Removes a health bar if one exists
	 * */
	public readonly removeHealthBar = () => {
		if (this.healthBar) {
			this.groupMain.remove(this.healthBar);
			this.healthBar = null;
		}
	}

	/**
	 * Interaction
	 * */
	public readonly registerDefaultListener = () => {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractableListener(this.assetType, `${this.assetType}ClickedDefault`, this.select);
	}
	abstract select(event: InteractionEvent): EventHandlingResult;
	abstract deselect(): void;
}
