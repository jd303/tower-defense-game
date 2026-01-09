import THREE from "three";
import { Main } from '../../core/Main';
import { InteractableOrders, InteractableTypes } from '../../game/InteractionService2';
import { Asset, ShaderMaterialProperties } from "./Asset";
import { SpriteService, SpriteSheet } from "../../game/SpriteService";
import { InstancedMesh, InstancedMeshService } from "../../game/InstancedMeshService";
import { AssetGenerator } from "./AssetGenerator";

export abstract class SpriteAsset extends Asset {
	/**
	 * Setup Properties
	 * */
	static ShaderMaterialProperties: ShaderMaterialProperties;

	/**
	 * Sprite Asset Properties
	 */
	loadCallbacks: (() => void)[] = [];
	assetName: string;
	typeName: InteractableTypes;
	interactiveOrder: InteractableOrders;

	spriteSheet: SpriteSheet;
	spriteSheetFrames: number = 1;
	spriteSheetCurrentFrame: number = 0;
	spriteSheetFrameManager: SpriteSheetFrameManager;

	instancedMesh: InstancedMesh;
	instancedMeshIndex: number;
	instancedMeshPosition: THREE.Object3D;
	instancedMeshAssetScale: number;
	instancedMeshInstanceCount: number;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetType: string, assetPositionY: number, spriteSheetRows: SpriteSheetRow[], spriteSheetCellColCount: number, instancedMeshAssetScale: number, instancedMeshInstanceCount: number) {
		super(main, assetName, assetType);

		const positioner = new THREE.Object3D();
		this.instancedMeshPosition = positioner;
		this.main.scene.add(this.groupMain);

		this.instancedMeshInstanceCount = instancedMeshInstanceCount;
		this.instancedMeshPosition.position.y = assetPositionY;
		this.instancedMeshAssetScale = instancedMeshAssetScale;

		this.setupInstancedMesh(assetName);
		this.registerDefaultListener();
		this.setPositionerScale();

		this.registerOnLoadCallback(() => {
			this.setupSpriteSheetFrameManager(spriteSheetRows, spriteSheetCellColCount);
		});
	}

	/**
	 * Registers a callback for when assets have loaded
	 */
	registerOnLoadCallback(callback: () => void) {
		this.loadCallbacks.push(callback);
	}

	/**
	 * Sources or creates a spritesheet and an Instanced Mesh
	 */
	async setupInstancedMesh(assetName: string) {
		await this.sourceSpriteSheet(assetName);
		await this.sourceInstancedMesh(assetName);
		this.loadCallbacks.forEach(callback => callback());
	}

	/**
	 * Sources or creates a spritesheet
	 */
	async sourceSpriteSheet(assetName: string) {
		const sSprite: SpriteService = this.main.s('Sprite');

		const assetClass = await AssetGenerator.getAssetAsSpriteAsset(assetName);
		const cols = assetClass.ShaderMaterialProperties.uniforms.uFrameCols.value;
		const rows = assetClass.ShaderMaterialProperties.uniforms.uFrameRows.value;
		const frames = cols * rows;

		this.spriteSheet = sSprite.spriteSheets[assetName] || await sSprite.createSpriteSheet(assetName, assetClass.assetPath, cols, rows, frames);
	}

	/**
	 * Sources or creates an Instanced Mesh
	 */
	async sourceInstancedMesh(assetName: string) {
		const sInstancedMesh: InstancedMeshService = this.main.s('InstancedMesh');

		const assetClass = await AssetGenerator.getAssetAsSpriteAsset(assetName);

		if (sInstancedMesh.instancedMeshes[assetName]) {
			this.instancedMesh = sInstancedMesh.instancedMeshes[assetName];
		} else {
			const instancedMesh = await sInstancedMesh.createSpriteSheetInstancedMesh(assetClass.assetName, this.spriteSheet, assetClass.ShaderMaterialProperties, this.instancedMeshInstanceCount);

			if (instancedMesh) {
				this.instancedMesh = instancedMesh;

				const positioner = new THREE.Object3D();
				positioner.position.set(-100 + Math.random() * 5, assetClass.assetPositionY + assetClass.assetScale / 2, -90 + Math.random() * 5);
				positioner.scale.set(assetClass.assetScale, assetClass.assetScale, assetClass.assetScale);
				positioner.updateMatrix();

				for (let x = 0; x < this.instancedMesh.iMesh.count; x++) {
					this.instancedMesh.iMesh.setMatrixAt(x, positioner.matrix);
				}

				this.main.scene.add(this.instancedMesh.iMesh);
			}
		}

		this.instancedMeshIndex = this.instancedMesh.assignInstancedMeshIndex();
	}

	/**
	 * Creates a spritesheet frame manager for this sprite asset
	 */
	setupSpriteSheetFrameManager(spriteSheetRows: SpriteSheetRow[], spriteSheetColCount: number) {
		this.spriteSheetFrameManager = new SpriteSheetFrameManager(this, this.instancedMesh, spriteSheetRows, spriteSheetColCount);
	}

	/**
	 * Sets the positioner scale to ensure constant scale size
	 */
	setPositionerScale() {
		this.instancedMeshPosition.scale.set(this.instancedMeshAssetScale, this.instancedMeshAssetScale, this.instancedMeshAssetScale);
	}

	/**
	 * Sets the position of the asset
	 */
	setPosition(point: THREE.Vector3) {
		this.setInstancedMeshPosition(point);
		this.groupMain.position.set(point.x, point.y, point.z);
	}

	/**
	 * Sets the position of the asset
	 */
	setScale(point: THREE.Vector3) {
		this.setInstancedMeshScale(point);
		this.groupMain.scale.set(point.x, point.y, point.z);
	}

	/**
	 * Sets the Instanced Mesh positions
	 */
	setInstancedMeshPosition(position: THREE.Vector3, needsUpdate: boolean = false) {
		try {
			this.instancedMeshPosition.position.x = position.x;
			this.instancedMeshPosition.position.z = position.z;
			this.instancedMeshPosition.updateMatrix();
			this.instancedMesh.iMesh.setMatrixAt(this.instancedMeshIndex, this.instancedMeshPosition.matrix);

			if (needsUpdate) {
				this.instancedMesh.iMesh.instanceMatrix.needsUpdate = true;
			}
		} catch (e) {
			console.error(`ERROR TRIGGERED IN setInstancedMeshPosition for ${this.assetName} - ${e}`);
		}
	}

	/**
	 * Sets the Instanced Mesh scale
	 */
	setInstancedMeshScale(scale: THREE.Vector3, needsUpdate: boolean = false) {
		try {
			this.instancedMeshPosition.scale.x = scale.x;
			this.instancedMeshPosition.scale.y = scale.y;
			this.instancedMeshPosition.scale.z = scale.z;
			this.instancedMeshPosition.updateMatrix();
			this.instancedMesh.iMesh.setMatrixAt(this.instancedMeshIndex, this.instancedMeshPosition.matrix);

			if (needsUpdate) {
				this.instancedMesh.iMesh.instanceMatrix.needsUpdate = true;
			}
		} catch (e) {
			console.error(`ERROR TRIGGERED IN setInstancedMeshPosition for ${this.assetName} - ${e}`);
		}
	}

	/**
	 * Colourises the instance
	 */
	setColourisation(propColourisation: any) {
		const thisColourisation = propColourisation[this.assetName];
		if (!thisColourisation) return;

		// If set, randomise the colours
		let colorR = thisColourisation.r && (1 - thisColourisation.r) + Math.random() * thisColourisation.r || 1;
		let colorG = thisColourisation.g && (1 - thisColourisation.g) + Math.random() * thisColourisation.g || 1;
		let colorB = thisColourisation.b && (1 - thisColourisation.b) + Math.random() * thisColourisation.b || 1;

		// Adjust lightness if set
		const random = Math.random() * (thisColourisation.l || 0);
		colorR = Math.max(0, Math.min(1, colorR + random));
		colorG = Math.max(0, Math.min(1, colorG + random));
		colorB = Math.max(0, Math.min(1, colorB + random));

		const colour = new THREE.Color(colorR, colorG, colorB);
		this.instancedMesh.iMesh.setColorAt(this.instancedMeshIndex, colour);
		this.instancedMesh.iMesh.instanceColor!.needsUpdate = true;
	}

	/**
	 * Chooses the animation frame appropriate
	 */
	animationFramePicker() {
		if (this.instancedMeshIndex === 0) console.log("TICK");
		const frame = this.spriteSheetFrameManager.nextFrame();
		const frames = this.instancedMesh.geometry.attributes.animationCol.array as Float32Array;
		frames[this.instancedMeshIndex] = frame;
	}

	/**
	 * Actions to take when we delete the instanced mesh
	 */
	deleteInstancedMesh() {
		this.setInstancedMeshPosition(new THREE.Vector3(-100, 0, -100), true);
	}
}

/**
 * Handles the best frame for the sprite asset
 */
export class SpriteSheetFrameManager {
	owner: SpriteAsset;
	mirrored: boolean = false;
	instancedMesh: InstancedMesh;
	currentRow: SpriteSheetRow;
	rows: SpriteSheetRow[] = []
	sheetColCount: number;

	/**
	 * Constructor
	 */
	constructor(owner: SpriteAsset, instancedMesh: InstancedMesh, rows: SpriteSheetRow[], sheetColCount: number) {
		this.owner = owner;
		this.instancedMesh = instancedMesh;
		this.rows = rows;
		this.currentRow = rows[0];
		this.sheetColCount = sheetColCount;

		this.rows.forEach((row, index) => row.index = index);
	}

	/**
	 * Changes the current row
	 */
	changeAnimation(rowName: string) {
		const newRow = this.rows.find((row) => row.name == rowName);
		if (newRow) {
			newRow.currentFrame = 0;
			this.currentRow = newRow;
			this.instancedMesh.geometry.attributes.animationRow.setX(this.instancedMesh.iMeshTotalIndexes, newRow.index!);
			this.instancedMesh.geometry.attributes.animationRow.needsUpdate = true;
		} else {
			console.error(`Cannot change to row ${rowName}`);
		}
	}

	/**
	 * Mirrors the spritesheet on the x axis
	 */
	mirrorSpriteSheet(isMirrored: boolean) {
		if (isMirrored != this.mirrored) {
			this.mirrored = isMirrored;

			this.instancedMesh.geometry.attributes.mirrorX.setX(this.owner.instancedMeshIndex, isMirrored ? 1 : 0);
			this.currentRow.currentFrame = this.currentRow.totalFrames - this.currentRow.currentFrame - 1;
			this.instancedMesh.geometry.attributes.animationCol.setX(this.owner.instancedMeshIndex, this.currentRow.currentFrame);
			this.instancedMesh.geometry.attributes.animationCol.needsUpdate = true;

			this.instancedMesh.geometry.attributes.mirrorX.needsUpdate = true;
		}
	}

	/**
	 * Chooses the next frame from the current row
	 */
	nextFrame(): number {
		const step = this.mirrored ? -1 : 1;
		this.currentRow.currentFrame = this.currentRow.currentFrame + step;
		if (this.currentRow.currentFrame < 0) this.currentRow.currentFrame = this.currentRow.totalFrames - 1;
		else if (this.currentRow.currentFrame > this.currentRow.totalFrames - 1) this.currentRow.currentFrame = 0;

		return this.currentRow.currentFrame;
	}
}

export interface SpriteSheetRow {
	index?: number;
	name: string,
	currentFrame: number;
	totalFrames: number;
}