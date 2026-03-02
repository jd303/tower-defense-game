import THREE from "three";
import { Main } from '../../core/Main';
import { InteractableOrders, InteractableTypes } from '../../game/InteractionService2';
import { Asset } from "./Asset";
import { SpriteService, SpriteSheet } from "../../game/SpriteService";
import { InstancedMesh, InstancedMeshService } from "../../game/InstancedMeshService";
import { AssetGenerator } from "./AssetGenerator";


export abstract class SpriteAsset extends Asset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties;
	static ShaderMaterialProperties: ShaderMaterialProperties;
	static AnimationAttributes: ShaderAnimationAttributes;
	static spriteSheetRows: SpriteSheetRow[] = [];
	static instancedMeshInstanceCount: number;
	static billboarded: boolean = true; // If true, will always face the camera

	/**
	 * Sprite Asset Properties
	 */
	loadCallbacks: (() => void)[] = [];
	assetScale: number;
	interactiveTypeName: InteractableTypes;
	interactiveOrder: InteractableOrders;

	spriteSheet: SpriteSheet;
	spriteSheetRows: SpriteSheetRow[];
	spriteSheetFrameManager: SpriteSheetFrameManager;

	instancedMesh: InstancedMesh;
	instancedMeshIndex: number;
	instancedMeshPosition: THREE.Object3D;
	instancedMeshPositionAdjustment: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	instancedMeshAnimates: boolean;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetProperties: SpriteAssetProperties, spriteSheetRows: SpriteSheetRow[], animationAttributes: ShaderAnimationAttributes) {
		super(main, assetProperties.assetName, assetProperties.assetType);

		const positioner = new THREE.Object3D();
		this.instancedMeshPosition = positioner;
		this.assetName = assetProperties.assetName;
		this.assetScale = assetProperties.assetScale;
		this.spriteSheetRows = spriteSheetRows;
		this.instancedMeshAnimates = animationAttributes.animates;
		this.main.scene.add(this.groupMain);

		this.setupInstancedMesh(assetProperties.assetName);
		this.setPositionerScale(assetProperties.assetScale);
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
		this.hideInstancedMesh();
		this.setInstancedMeshInitialSettings(assetName);
		await this.setupSpriteSheetFrameManager();
		this.loadCallbacks.forEach(callback => callback());
	}

	/**
	 * Sources or creates a spritesheet
	 */
	async sourceSpriteSheet(assetName: string) {
		const sSprite: SpriteService = this.main.s('Sprite');
		const assetClass = await AssetGenerator.getAssetAsSpriteAsset(assetName);
		this.spriteSheet = await sSprite.sourceSpriteSheet(assetName, assetClass);
	}

	/**
	 * Sources or creates an Instanced Mesh
	 */
	async sourceInstancedMesh(assetName: string) {
		const sInstancedMesh: InstancedMeshService = this.main.s('InstancedMesh');
		const assetClass = await AssetGenerator.getAssetAsSpriteAsset(assetName);

		const instancedMesh = await sInstancedMesh.sourceInstancedMesh(assetName, assetClass, this.spriteSheet, assetClass.instancedMeshInstanceCount, assetClass.AnimationAttributes.animates);
		if (instancedMesh) {
			this.instancedMesh = instancedMesh;
			this.instancedMeshIndex = this.instancedMesh.assignInstancedMeshIndex();
		}
	}

	/**
	 * Creates a spritesheet frame manager for this sprite asset
	 */
	async setupSpriteSheetFrameManager() {
		if (this.instancedMeshAnimates) {
			this.spriteSheetFrameManager = await new SpriteSheetFrameManager(this, this.instancedMesh, this.spriteSheetRows);
		}
	}

	/**
	 * Sets the positioner scale to ensure constant scale size
	 */
	setPositionerScale(scale: number) {
		this.instancedMeshPosition.scale.set(scale, scale, scale);
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
	 * Sets the position of the asset
	 */
	setRotate(rotation: THREE.Vector3) {
		this.setInstancedMeshRotation(rotation);
		this.groupMain.rotation.set(rotation.x, rotation.y, rotation.z);
	}

	/**
	 * Sets the initial settings for this instance's mesh
	 */
	async setInstancedMeshInitialSettings(assetName: string) {
		const assetClass = await AssetGenerator.getAssetAsSpriteAsset(assetName);
		if (!assetClass) console.error("NO ASSET FOR:", assetName);

		// Then tell the instancedMesh that there is a new guy on the block (increments the initial count)
		if (this.instancedMesh.iMesh.count + 1 > this.instancedMesh.iMeshMaximumIndexes) console.error(`Critical - Sprite ${assetName} exceeds expected InstancedMesh Indexes!`);
		this.instancedMesh.iMesh.count += 1;

		let row = 0;

		// Set default properties
		this.instancedMesh.geometry.attributes.animationRow.setX(this.instancedMeshIndex, row);

		// Update default properties
		if (this.instancedMesh.iMesh.geometry.attributes.animationRow) {
			this.instancedMesh.iMesh.geometry.attributes.animationRow.needsUpdate = true;
			//this.instancedMesh.iMesh.geometry.attributes.mirrorX.needsUpdate = true;
		}

		//assetClass.spriteSheetRows && assetClass.spriteSheetRows.length

		// Add animation-based properties
		if (!assetClass.AnimationAttributes) console.log("missing for ", this.assetName);
		if (assetClass.AnimationAttributes.animates) {
			let speed = assetClass.AnimationAttributes.animationSpeed!;
			let cellsInRow = assetClass.spriteSheetRows[0].totalFrames;
			let animationTimeOffset = Math.ceil((Math.random() * 100) * 100) / 100;
			this.instancedMesh.geometry.attributes.cellsInRow.setX(this.instancedMeshIndex, cellsInRow);
			this.instancedMesh.geometry.attributes.animationSpeed.setX(this.instancedMeshIndex, speed);
			this.instancedMesh.geometry.attributes.animationTimeOffset.setX(this.instancedMeshIndex, animationTimeOffset);

			// Update
			this.instancedMesh.iMesh.geometry.attributes.cellsInRow.needsUpdate = true;
			this.instancedMesh.iMesh.geometry.attributes.animationSpeed.needsUpdate = true;
			this.instancedMesh.iMesh.geometry.attributes.animationTimeOffset.needsUpdate = true;
		}

		// Final overall update
		this.instancedMesh.iMesh.instanceMatrix.needsUpdate = true;
	}

	/**
	 * Sets the Instanced Mesh positions
	 */
	setInstancedMeshPosition(position: THREE.Vector3, needsUpdate: boolean = false) {
		try {
			this.instancedMeshPosition.position.x = position.x + this.instancedMeshPositionAdjustment.x
			this.instancedMeshPosition.position.y = position.y + this.instancedMeshPositionAdjustment.y
			this.instancedMeshPosition.position.z = position.z + this.instancedMeshPositionAdjustment.z;
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
			console.error(`ERROR TRIGGERED IN setInstancedMeshScale for ${this.assetName} - ${e}`);
		}
	}


	/**
	 * Sets the Instanced Mesh rotate
	 */
	setInstancedMeshRotation(rotation: THREE.Vector3, needsUpdate: boolean = true) {
		try {
			this.instancedMeshPosition.rotation.x = rotation.x;
			this.instancedMeshPosition.rotation.y = rotation.y;
			this.instancedMeshPosition.rotation.z = rotation.z;
			this.instancedMeshPosition.updateMatrix();
			this.instancedMesh.iMesh.setMatrixAt(this.instancedMeshIndex, this.instancedMeshPosition.matrix);

			if (needsUpdate) {
				this.instancedMesh.iMesh.instanceMatrix.needsUpdate = true;
			}
		} catch (e) {
			console.error(`ERROR TRIGGERED IN setInstancedMeshRotation for ${this.assetName} - ${e}`);
		}
	}

	/**
	 * Colourises the instance
	 */
	setColourisation(colourisation: { r?: number, g?: number, b?: number, l?: number }) {
		// If set, randomise the colours
		let colorR = colourisation.r && (1 - colourisation.r) + Math.random() * colourisation.r || 1;
		let colorG = colourisation.g && (1 - colourisation.g) + Math.random() * colourisation.g || 1;
		let colorB = colourisation.b && (1 - colourisation.b) + Math.random() * colourisation.b || 1;

		// Adjust lightness if set
		const random = Math.random() * (colourisation.l || 0);
		colorR = Math.max(0, Math.min(1, colorR + random));
		colorG = Math.max(0, Math.min(1, colorG + random));
		colorB = Math.max(0, Math.min(1, colorB + random));

		const colour = new THREE.Color(colorR, colorG, colorB);
		this.instancedMesh.iMesh.setColorAt(this.instancedMeshIndex, colour);
		this.instancedMesh.iMesh.instanceColor!.needsUpdate = true;
	}

	/**
	 * Actions to take when we delete the instanced mesh
	 */
	hideInstancedMesh() {
		this.setInstancedMeshPosition(new THREE.Vector3(-100 + (Math.random() * 3), 0, -100 + (Math.random() * 3)), true);
	}

	/**
	 * Disposes of this asset
	 */
	dispose() {
		this.hideInstancedMesh();
		this.selectionGeometry?.dispose();
		this.main.scene.remove(this.groupMain);
		this.main.scene.remove(this.instancedMesh.iMesh);

		this.instancedMesh.dispose();
		this.spriteSheet.dispose();
	}
}

export interface SpriteAssetProperties {
	assetType: string;
	assetName: string;
	assetPath: string;
	assetScale: number;
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

	/**
	 * Constructor
	 */
	constructor(owner: SpriteAsset, instancedMesh: InstancedMesh, rows: SpriteSheetRow[]) {
		this.owner = owner;
		this.instancedMesh = instancedMesh;
		this.rows = rows;
		this.currentRow = rows[0];

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

			this.instancedMesh.geometry.attributes.animationRow.setX(this.owner.instancedMeshIndex, newRow.index!);
			this.instancedMesh.geometry.attributes.animationRow.needsUpdate = true;

			this.instancedMesh.geometry.attributes.cellsInRow.setX(this.owner.instancedMeshIndex, newRow.totalFrames);
			this.instancedMesh.geometry.attributes.cellsInRow.needsUpdate = true;
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
			this.instancedMesh.geometry.attributes.mirrorX.needsUpdate = true;
		}
	}
}

export interface SpriteSheetRow {
	index?: number;
	name: string,
	currentFrame: number;
	totalFrames: number;
}

export interface ShaderMaterialProperties {
	uniforms: {
		uFrameCols: { value: number },
		uFrameRows: { value: number }
	}
}

export interface ShaderAnimationAttributes {
	animates: boolean;
	animationSpeed: number | null;
}