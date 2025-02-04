import THREE, { Matrix4, Texture, Vector3 } from "three";
import { Main } from "../core/Main";
import { TerrainTypes } from "../data/LevelInterfaces";

import AllProps from "./props/AllProps";
import { PathService } from "../game/PathService";
import { Maths } from "../core/Maths";
import { PathPoint } from "../data/PathInterfaces";

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
	registerPropZone(propName: string, args: { zonePathPoints: PathPoint[], densityUnits: number, zoneStrategy: PropZoneStrategy, positionRandom?: number, scaleRandom?: number, rotateRandom?: number }) {
		if (!args.positionRandom) args.positionRandom = 0;
		if (!args.scaleRandom) args.scaleRandom = 0;
		if (!args.rotateRandom) args.rotateRandom = 0;

		const sPath: PathService = this.main.s('Path');
		const curvePath = sPath.createCurveFromPathPoints(args.zonePathPoints, 0, 0, true);
		const boundingBox = sPath.getBoundingBoxOfCurvePath(curvePath);

		for (let x = boundingBox.smallestX; x < (boundingBox.largestX - boundingBox.smallestX); x += args.densityUnits) {
			for (let z = boundingBox.smallestZ; z < (boundingBox.largestZ - boundingBox.smallestZ); z += args.densityUnits) {
				if (sPath.pointIsInCurvePath(new Vector3(x, 0, z), curvePath)) {
					x = Maths.addBipolarRandom(x, args.positionRandom);
					z = Maths.addBipolarRandom(z, args.positionRandom);
					let scaleX = 1;
					let scaleY = 1;
					let scaleZ = 1;

					if (args.scaleRandom) {
						let scaleAdjust = Maths.addBipolarRandom(1, args.scaleRandom);
						scaleX = scaleAdjust;
						scaleY = scaleAdjust;
						scaleZ = scaleAdjust;
					}

					this.registerProp(propName, { position: new Vector3(x, 0, z), scale: new Vector3(scaleX, scaleY, scaleZ) });
				}
			}
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

export enum PropZoneStrategy {
	default = 0,
	centerOut = 1,
	topToBottom = 2,
	bottomToTop = 3,
	leftToRight = 4,
	rightToLeft = 5
}