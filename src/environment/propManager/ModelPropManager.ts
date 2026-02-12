import THREE, { InstancedMesh, Texture, Vector3 } from "three";
import { Main } from "../../core/Main";
import { LevelDefinition, TerrainTypes } from "../../data/LevelInterfaces";
import AllProps from "../props/AllProps";
import { PropZone, PropZoneArguments } from "./PropZone";

// RETIRED WHEN I SHIFTED TO SPRITES 01-2026.  Would still work, but is outdated.

/**
 * A framework for adding props and propzones to the board
 * Makes use of InstancedMesh, which requires that prop models have only 1 child mesh.
 * Providing a model with more than 1 child mesh will fail to write the model to the screen
 */
export class ModelPropManager {
	/**
	 * Core Properties
	 * */
	main: Main;
	tileset: TerrainTypes = TerrainTypes.grass;
	propZones: PropZone[] = [];
	propGroups: PropGroup[] = [];

	tempTreeTexture: any;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Sets up all props, propzones, and towerPlacementZones
	 * @param props 
	 * @param propZones 
	 */
	setup(levelDetails: LevelDefinition) {
		this.tileset = levelDetails.terrain;
		levelDetails.props?.forEach(prop => this.registerProp(prop, levelDetails));
		levelDetails.propZones?.forEach(propZone => this.registerPropZone(propZone, levelDetails));
	}

	/**
	 * Register a prop to place and render
	 */
	registerProp(args: { assetName: string, position: Vector3, scale?: Vector3, rotate?: Vector3 }, levelDetails?: LevelDefinition) {
		if (!args.scale) args.scale = new Vector3(1, 1, 1);
		if (!args.rotate) args.rotate = new Vector3(0, 0, 0);

		const prop = this.findProp(this.tileset, args.assetName);
		if (prop) {
			const propAssetPlacement: PropAssetPlacement = {
				x: args.position.x,
				y: args.position.y,
				z: args.position.z,
				scaleX: args.scale.x,
				scaleY: args.scale.y,
				scaleZ: args.scale.z,
				rotX: args.rotate.x,
				rotY: args.rotate.y,
				rotZ: args.rotate.z
			}

			const propGroup = this.preparePropGroup(prop, levelDetails);
			propGroup.propPlacements.push(propAssetPlacement);
		}
	}

	/**
	 * Register a zone to generate props in
	 */
	registerPropZone(args: PropZoneArguments, levelDetails: LevelDefinition) {
		const propZonePropsY = args.environmentTile ? 0.2 : 0;
		const propZone = new PropZone(args, this.main);
		this.propZones.push(propZone);
		const propPositions: Vector3[] = propZone.createPositions();

		// Place the props
		propPositions.forEach((position: any) => {
			const random = Math.random();
			let sum = 0;
			const pickedItem = args.propNames.find(item => (sum += item.chance) >= random);
			if (!pickedItem) throw new Error("Cannot choose a propName");

			this.registerProp({ assetName: pickedItem.name, position: new Vector3(position.position.x, propZonePropsY, position.position.z), scale: new Vector3(position.scale.x, position.scale.y, position.scale.z), rotate: new Vector3(0, 0, 0) }, levelDetails);
		});
	}

	/**
	 * Finds a prop from prop definitions
	 */
	findProp(tileset: TerrainTypes, name: string): ModelPropAssetDefinition | null {
		const prop = AllProps.find(prop => prop.tileset == tileset && prop.name == name);
		return prop || null;
	}

	/**
	 * Used to create a prop group for each unique prop
	 */
	preparePropGroup(prop: ModelPropAssetDefinition, levelDetails?: LevelDefinition): PropGroup {
		let thePropGroup = this.propGroups.find(propGroup => propGroup.asset == prop);
		if (!thePropGroup) {
			thePropGroup = {
				iMesh: null,
				asset: prop,
				propPlacements: [],
				colourRandom: levelDetails?.propColourisation?.[prop.name]
			}

			this.propGroups.push(thePropGroup);
		}

		return thePropGroup;
	}

	/**
	 * Renders prop groups
	 * */
	render() {
		this.propGroups.forEach(async (propGroup) => {
			const model = await this.main.s('Loader').loadModel(propGroup.asset.assetPath);

			if (propGroup.asset.texturePath) {
				const texture = await this.loadPropGroupTexture(propGroup);
				texture.flipY = false;
				texture.magFilter = THREE.LinearFilter;
				texture.minFilter = THREE.LinearFilter;
				propGroup.loadedMaterial = this.setPropTexture(texture);
			}

			propGroup.loadedModel = model;
			this.instanceMeshesAndPlace(propGroup);
		});
	}

	/**
	 * Loads the texture for a propGroup
	 */
	async loadPropGroupTexture(propGroup: PropGroup) {
		const textureResult = await this.main.s('Loader').loadTexture(propGroup.asset.texturePath);
		return textureResult;
	}

	/**
	 * Instance the Mesh and Place
	 * Assumes only 1 mesh in the Prop Model
	 */
	instanceMeshesAndPlace(propGroup: PropGroup) {
		// Check for instancing
		if (propGroup.loadedModel.scene.children.length > 1 || propGroup.loadedModel.scene.children[0].children.length > 1) {
			console.error(`Loaded model ${propGroup.asset.name} likely cannot be instanced`);
			console.log(propGroup.loadedModel.scene);
		}

		// Instance away
		const iMesh = new THREE.InstancedMesh(propGroup.loadedModel.scene.children[0].geometry, propGroup.loadedMaterial, propGroup.propPlacements.length);

		for (let x = 0; x < propGroup.propPlacements.length; x++) {
			const matrix_random = new THREE.Matrix4();
			const position = new THREE.Vector3()
			const quaternion = new THREE.Quaternion();
			const scale = new THREE.Vector3();

			const placement = propGroup.propPlacements[x];
			position.x = placement.x;
			position.y = placement.y;
			position.z = placement.z;

			const rotation = new THREE.Euler(placement.rotX, placement.rotY, placement.rotZ);
			quaternion.setFromEuler(rotation);

			const defaultScale = propGroup.asset.defaultScale || new Vector3(1, 1, 1);
			scale.x = defaultScale.x * placement.scaleX;
			scale.y = defaultScale.y * placement.scaleY;
			scale.z = defaultScale.z * placement.scaleZ;

			matrix_random.compose(position, quaternion, scale);

			iMesh.setMatrixAt(x, matrix_random);
		}

		iMesh.castShadow = propGroup.asset.shadows;
		iMesh.receiveShadow = true;
		if (propGroup.loadedMaterial) propGroup.loadedMaterial.needsUpdate = true;
		propGroup.iMesh = iMesh;
		this.main.scene.add(iMesh);

		// If set, randomise the colours
		if (propGroup.colourRandom) {
			for (let i = 0; i < propGroup.propPlacements.length; i++) {
				// Adjust colours if set
				let colorR = propGroup.colourRandom.r && (1 - propGroup.colourRandom.r) + Math.random() * propGroup.colourRandom.r || 1;
				let colorG = propGroup.colourRandom.g && (1 - propGroup.colourRandom.g) + Math.random() * propGroup.colourRandom.g || 1;
				let colorB = propGroup.colourRandom.b && (1 - propGroup.colourRandom.b) + Math.random() * propGroup.colourRandom.b || 1;

				// Adjust lightness if set
				if (propGroup.colourRandom.l) {
					const random = Math.random() * propGroup.colourRandom.l;
					colorR = Math.max(0, Math.min(1, colorR + random));
					colorG = Math.max(0, Math.min(1, colorG + random));
					colorB = Math.max(0, Math.min(1, colorB + random));
				}

				const color = new THREE.Color(colorR, colorG, colorB);
				iMesh.setColorAt(i, color);
			}

			iMesh.instanceColor!.needsUpdate = true;
		}

		// TEST: Can we animate individual items?
		/*setInterval(() => {
			let matrix = new Matrix4();
			let position = new Vector3();
			iMesh.getMatrixAt(0, matrix);
			position = position.setFromMatrixPosition(matrix);
			matrix.setPosition(position.x - 0.01, position.y, position.z);
			iMesh.setMatrixAt(0, matrix);

			iMesh.instanceMatrix.needsUpdate = true;
		}, 100);*/
	}

	/**
	 * Creates a texture for the model.
	 * This method may need significant upgrades in the future for each prop type
	 */
	setPropTexture(texture: Texture) {
		const material = new THREE.MeshStandardMaterial({ map: texture });
		material.side = THREE.DoubleSide; // || THREE.FrontSide || THREE.BackSide*/
		//material.colorWrite = false; // Makes it invisible, but still obscures things behind it!
		material.metalness = 0.25;
		material.precision = "lowp"; // "highp", "mediump"
		material.roughness = 1;

		return material;
	}

	/**
	 * Removes all props from the level
	 */
	disposeAll() {
		this.propGroups.forEach((propGroup: PropGroup) => {
			this.main.scene.remove(propGroup.iMesh!);
		});
		this.propGroups = [];

		this.propZones.forEach((propZone) => {
			propZone.dispose();
		});
		this.propZones = [];
	}
}

interface PropGroup {
	iMesh: InstancedMesh | null;
	asset: ModelPropAssetDefinition;
	propPlacements: PropAssetPlacement[];
	colourRandom?: { r?: number, g?: number, b?: number, l?: number }, // r, g and b apply a random to individual colours.  l applies to all colours.
	loadedModel?: any;
	loadedMaterial?: any;
}

export interface ModelPropAssetDefinition {
	tileset: TerrainTypes;
	name: string;
	assetPath: string;
	spritesheetPath?: string
	texturePath?: string;
	defaultScale?: Vector3;
	shadows: boolean;
}

export interface PropAssetPlacement {
	x: number;
	y: number;
	z: number;
	scaleX: number;
	scaleY: number;
	scaleZ: number;
	rotX: number;
	rotY: number;
	rotZ: number;
}