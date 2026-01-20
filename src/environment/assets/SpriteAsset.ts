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
	static ShaderMaterialProperties: ShaderMaterialProperties;
	static AnimationAttributes: ShaderMaterialAttributes;
	static spriteSheetRows: SpriteSheetRow[] = [];
	static instancedMeshInstanceCount: number;

	/**
	 * Sprite Asset Properties
	 */
	loadCallbacks: (() => void)[] = [];
	assetName: string;
	assetPositionY: number;
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
	constructor(main: Main, assetName: string, assetType: string, assetPositionY: number, spriteSheetRows: SpriteSheetRow[], instancedMeshAssetScale: number, instancedMeshInstanceCount: number) {
		super(main, assetName, assetType);

		const positioner = new THREE.Object3D();
		this.instancedMeshPosition = positioner;
		this.assetPositionY = assetPositionY;
		this.main.scene.add(this.groupMain);

		this.instancedMeshInstanceCount = instancedMeshInstanceCount;
		this.instancedMeshAssetScale = instancedMeshAssetScale;

		this.setupInstancedMesh(assetName);
		this.setPositionerScale();

		this.registerOnLoadCallback(() => {
			this.setupSpriteSheetFrameManager(spriteSheetRows);
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
		this.setInstancedMeshInitialSettings(assetName);
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

		const instancedMesh = await sInstancedMesh.sourceInstancedMesh(assetName, assetClass, this.spriteSheet, assetClass.instancedMeshInstanceCount);
		if (instancedMesh) {
			this.instancedMesh = instancedMesh;
			this.instancedMeshIndex = this.instancedMesh.assignInstancedMeshIndex();
		}
	}

	/**
	 * Creates a spritesheet frame manager for this sprite asset
	 */
	setupSpriteSheetFrameManager(spriteSheetRows: SpriteSheetRow[]) {
		this.spriteSheetFrameManager = new SpriteSheetFrameManager(this, this.instancedMesh, spriteSheetRows);
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
	 * Sets the initial settings for this instance's mesh
	 */
	async setInstancedMeshInitialSettings(assetName: string) {
		const assetClass = await AssetGenerator.getAssetAsSpriteAsset(assetName);
		if (!assetClass) console.error("NO ASSET FOR:", assetName);

		let row = 0;
		let speed = 0;
		let cellsInRow = 1;
		let animationTimeOffset = Math.random() * 100;

		if (assetClass.spriteSheetRows && assetClass.spriteSheetRows.length) {
			speed = assetClass.AnimationAttributes.animationSpeed;
			cellsInRow = assetClass.spriteSheetRows[0].totalFrames;
		}

		this.instancedMesh.geometry.attributes.animationRow.setX(this.instancedMeshIndex, row);
		this.instancedMesh.geometry.attributes.animationSpeed.setX(this.instancedMeshIndex, speed);
		this.instancedMesh.geometry.attributes.animationTimeOffset.setX(this.instancedMeshIndex, animationTimeOffset);
		this.instancedMesh.geometry.attributes.cellsInRow.setX(this.instancedMeshIndex, cellsInRow);
	}

	/**
	 * Sets the Instanced Mesh positions
	 */
	setInstancedMeshPosition(position: THREE.Vector3, needsUpdate: boolean = false) {
		try {
			this.instancedMeshPosition.position.set(position.x, position.y + this.assetPositionY, position.z);
			this.instancedMeshPosition.updateMatrix();
			this.instancedMesh.iMesh.setMatrixAt(this.instancedMeshIndex, this.instancedMeshPosition.matrix);

			if (needsUpdate) {
				this.instancedMesh.iMesh.instanceMatrix.needsUpdate = true;
			}
		} catch (e) {
			console.error(`ERROR TRIGGERED IN setInstancedMeshPosition for ${this.assetName} - ${e}`);
		}
	} //TypeError: Cannot read properties of undefined (reading 'iMesh')

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
		this.setInstancedMeshPosition(new THREE.Vector3(-100, 0, -100), true);
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

export interface ShaderMaterialProperties {
	uniforms: {
		uFrameCols: { value: number },
		uFrameRows: { value: number },
		uSize: { value: number }
	},
	alphaTest: number,
	transparent: boolean
}

export interface ShaderMaterialAttributes {
	animationSpeed: number
}