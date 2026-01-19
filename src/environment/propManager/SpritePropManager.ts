import THREE from "three";
import { Main } from "../../core/Main";
import { LevelDefinition, LevelPropDefinition, TerrainTypes } from "../../data/LevelInterfaces";
import AllProps from "../props/AllProps";
import { PropZone, PropZoneArguments } from "./PropZone";
import { EnvironmentTile } from "../EnvironmentTile";
import { AssetGenerator } from "../assets/AssetGenerator";
import { SpriteAsset } from "../assets/SpriteAsset";

/**
 * A framework for adding props and propzones to the board
 * Makes use of InstancedMesh
 */
export class SpritePropManager {
	/**
	 * Core Properties
	 * */
	main: Main;
	tileset: TerrainTypes = TerrainTypes.grass;
	spriteAssets: SpriteAsset[] = [];
	propZones: PropZone[] = [];
	propGroups: PropGroup[] = [];
	environmentTiles: EnvironmentTile[] = [];

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
	async setup(levelDetails: LevelDefinition) {
		this.tileset = levelDetails.terrain;

		// Register individually defined props
		if (levelDetails.props) {
			for (let x = 0; x < levelDetails.props.length; x++) {
				await this.registerProp(levelDetails.props[x], levelDetails);
			}
		}

		// Register Prop Zones
		if (levelDetails.propZones) {
			for (let x = 0; x < levelDetails.propZones.length; x++) {
				this.registerPropZone(levelDetails.propZones[x], levelDetails)
			}
		}
	}

	/**
	 * Register a prop to place and render
	 */
	async registerProp(args: LevelPropDefinition, levelDetails?: LevelDefinition) {
		const assetInstance = await AssetGenerator.createSpriteAsset(args.assetName, this.main) as SpriteAsset;
		const colourisation = levelDetails?.propColourisation && levelDetails?.propColourisation[args.assetName];
		this.spriteAssets.push(assetInstance);
		assetInstance.registerOnLoadCallback(() => {
			colourisation && assetInstance.setColourisation(colourisation);
			assetInstance.setPosition(args.position);
			if (args.scale) assetInstance.setScale(args.scale);
		});
	}

	/**
	 * Register a zone to generate props in
	 */
	registerPropZone(args: PropZoneArguments, levelDetails: LevelDefinition) {
		const propZonePropsY = args.environmentTile ? 0.2 : 0;
		const propZone = new PropZone(args, this.main);
		this.propZones.push(propZone);
		const propPositions: THREE.Vector3[] = propZone.createPositions();

		if (args.environmentTile) {
			const environmentTile = propZone.createEnvironmentTile();
			this.environmentTiles.push(environmentTile);
			this.main.scene.add(environmentTile.groupMain);
		}

		// Place the props
		propPositions.forEach((position: any) => {
			const random = Math.random();
			let sum = 0;
			const pickedItem = args.propNames.find(item => (sum += item.chance) >= random);
			if (!pickedItem) throw new Error("Cannot choose a propName");

			this.registerProp({ assetName: pickedItem.name, position: new THREE.Vector3(position.position.x, propZonePropsY, position.position.z), scale: new THREE.Vector3(position.scale.x, position.scale.y, position.scale.z) }, levelDetails);
		});
	}

	/**
	 * Finds a prop from prop definitions
	 */
	findProp(tileset: TerrainTypes, name: string): SpritePropAssetDefinition | null {
		const prop = AllProps.find(prop => prop.tileset == tileset && prop.name == name);
		return prop || null;
	}

	/**
	 * Removes all props from the level
	 */
	disposeAll() {
		this.propGroups.forEach((propGroup: PropGroup) => {
			propGroup.iMesh?.dispose();
			this.main.scene.remove(propGroup.iMesh!);
		});
		this.propGroups = [];

		this.propZones.forEach((propZone) => {
			propZone.dispose();
		});
		this.propZones = [];

		this.environmentTiles.forEach((environmentTile) => {
			environmentTile.dispose();
		});
		this.environmentTiles = [];

		this.spriteAssets.forEach((spriteAsset: SpriteAsset) => {
			spriteAsset.dispose();
		});
		this.spriteAssets = [];
	}
}

interface PropGroup {
	iMesh: THREE.InstancedMesh | null;
	asset: SpritePropAssetDefinition;
	propPlacements: PropAssetPlacement[];
	colourRandom?: { r?: number, g?: number, b?: number, l?: number }, // r, g and b apply a random to individual colours.  l applies to all colours.
	loadedModel?: any;
	loadedMaterial?: any;
}

export interface SpritePropAssetDefinition {
	tileset: TerrainTypes;
	name: string;
	assetPath: string;
	spritesheetPath?: string
	texturePath?: string;
	defaultScale?: THREE.Vector3;
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