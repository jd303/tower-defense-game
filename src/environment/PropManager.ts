import THREE, { InstancedMesh, Texture, Vector3 } from "three";
import { Main } from "../core/Main";
import { TerrainTypes } from "../data/LevelInterfaces";

import AllProps from "./props/AllProps";

export class PropManager {
	/**
	 * Core Properties
	 * */
	main: Main;
	tileset: TerrainTypes;
	propGroups: PropGroup[] = [];

	tempTreeTexture: any;

	/**
	 * Constructor
	 * */
	constructor(tileset: TerrainTypes, main: Main) {
		this.tileset = tileset;
		this.main = main;
	}

	/**
	 * Register a prop from a level definition
	 */
	registerProp(propName: string, position: Vector3, rotate: Vector3, scale: Vector3) {
		const prop = this.findProp(this.tileset, propName);
		if (prop) {
			console.log("PROP FOUND", propName, prop);
			const propAssetPlacement: PropAssetPlacement = {
				x: position.x,
				y: position.y,
				z: position.z,
				scaleX: scale.x,
				scaleY: scale.y,
				scaleZ: scale.z,
				rotX: rotate.x,
				rotY: rotate.y,
				rotZ: rotate.z
			}

			const propGroup = this.preparePropGroup(prop);
			propGroup.propPlacements.push(propAssetPlacement);
		}
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
	renderPropGroups() {
		this.propGroups.forEach(async (propGroup) => {
			console.log("RENDERING PROP GROUP", propGroup);
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
		console.log("Loaded model", propGroup);

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

		iMesh.castShadow = true;
		iMesh.receiveShadow = true;
		propGroup.loadedMaterial.needsUpdate = true;
		this.main.scene.add(iMesh);
	}

	loadProgress() { }

	/**
	 * The assets failed to load
	 * */
	loadError(propGroup: PropGroup, err: any) {
		console.log('Failed to load prop', propGroup, err);
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

