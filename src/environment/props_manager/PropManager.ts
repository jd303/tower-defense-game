import THREE, { Texture, Vector3 } from "three";
import { Main } from "../../core/Main";
import { TerrainTypes } from "../../data/LevelInterfaces";
import AllProps from "../props/AllProps";
import { PropZone, PropZoneArguments } from "./PropZone";
import { Maths } from "../../core/Maths";
import { EnvironmentTile } from "../EnvironmentTile";

/**
 * A framework for adding props and propzones to the board
 * Makes use of InstancedMesh, which requires that prop models have only 1 child mesh.
 * Providing a model with more than 1 child mesh will fail to write the model to the screen
 */
export class PropManager {
	/**
	 * Core Properties
	 * */
	main: Main;
	tileset: TerrainTypes;
	propGroups: PropGroup[] = [];
	environmentTiles: EnvironmentTile[] = [];

	tempTreeTexture: any;

	/**
	 * Constructor
	 * */
	constructor(tileset: TerrainTypes, main: Main) {
		this.tileset = tileset;
		this.main = main;
	}

	/**
	 * Register a prop to place and render
	 */
	registerProp(propName: string, args: { position: Vector3, scale?: Vector3, rotate?: Vector3 }) {
		if (!args.scale) args.scale = new Vector3(1, 1, 1);
		if (!args.rotate) args.rotate = new Vector3(0, 0, 0);

		const prop = this.findProp(this.tileset, propName);
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

			const propGroup = this.preparePropGroup(prop);
			propGroup.propPlacements.push(propAssetPlacement);
		}
	}

	/**
	 * Register a zone to generate props in
	 */
	registerPropZone(propNames: string[], args: PropZoneArguments) {
		const propZonePropsY = 0.2;
		const propZone = new PropZone(args, this.main);
		const propPositions: Vector3[] = propZone.createPositions();
		this.environmentTiles.push(propZone.createEnvironmentTile());

		if (this.main.debugMode) propZone.debugCreateOutlines();

		// Place the props
		propPositions.forEach((position: any) => {
			const propName = propNames[Math.floor(Math.random() * propNames.length)];
			this.registerProp(propName, { position: new Vector3(position.position.x, propZonePropsY, position.position.z), scale: new Vector3(position.scale.x, position.scale.y, position.scale.z), rotate: new Vector3(0, Maths.addBipolarRandom(0, args.rotateRandom || 0), 0) });
		});
	}

	/**
	 * Finds a prop from prop definitions
	 */
	findProp(tileset: TerrainTypes, name: string): PropAsset | null {
		const prop = AllProps.find(prop => prop.tileset == tileset && prop.name == name);
		return prop || null;
	}

	/**
	 * Used to create a prop group for each unique prop
	 */
	preparePropGroup(prop: PropAsset): PropGroup {
		let thePropGroup = this.propGroups.find(propGroup => propGroup.asset == prop);
		if (!thePropGroup) {
			thePropGroup = {
				asset: prop,
				propPlacements: []
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
			const texture = await this.loadPropGroupTexture(propGroup);
			const model = await this.main.s('Loader').loadModel(propGroup.asset.assetPath);
			propGroup.loadedMaterial = this.setPropTexture(texture);
			propGroup.loadedModel = model;
			this.instanceMeshesAndPlace(propGroup);
		});
	}

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
		propGroup.loadedMaterial.needsUpdate = true;
		this.main.scene.add(iMesh);

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
		material.metalness = 0.25;
		material.roughness = 1;

		return material;
	}
}

interface PropGroup {
	asset: PropAsset;
	propPlacements: PropAssetPlacement[];
	loadedModel?: any;
	loadedMaterial?: any;
}

export interface PropAsset {
	tileset: TerrainTypes;
	name: string;
	assetPath: string;
	texturePath: string;
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