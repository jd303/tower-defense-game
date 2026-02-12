import THREE from "three";
import { Main } from "../../core/Main";
import { LevelDefinition, LevelPropDefinition, TerrainTypes } from "../../data/LevelInterfaces";
import AllProps from "../props/AllProps";
import { PropZone, PropZoneArguments } from "./PropZone";
import { AssetGenerator } from "../assets/AssetGenerator";
import { SpriteAsset } from "../assets/SpriteAsset";
import { PropCurve, PropCurveArguments } from "./PropCurve";
import { Level } from "../../levels/Level";

/**
 * A framework for adding props and propzones to the board
 * Makes use of InstancedMesh
 */
export class SpritePropManager {
	/**
	 * Core Properties
	 * */
	main: Main;
	level: Level;
	tileset: TerrainTypes = TerrainTypes.grass;
	spriteAssets: SpriteAsset[] = [];
	propZones: PropZone[] = [];
	propCurves: PropCurve[] = [];
	propGroups: PropGroup[] = [];

	tempTreeTexture: any;

	/**
	 * Constructor
	 * */
	constructor(main: Main, level: Level) {
		this.main = main;
		this.level = level;
	}

	/**
	 * Sets up all props, propzones, and towerPlacementZones
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
				this.registerPropZone(levelDetails.propZones[x], levelDetails);
			}
		}

		// Register Creep Prop Curves
		if (levelDetails.paths) {
			for (let x = 0; x < levelDetails.paths.length; x++) {
				if (levelDetails.paths[x].propCurve) {

					// If there is a matchjing creep path, let's create props for it
					const creepPath = this.level.creepManager.creepPaths.find(path => path.id == levelDetails.paths[x].id);
					if (creepPath) {
						this.registerPathEdge({ ...levelDetails.paths[x].propCurve!, curvePathPoints: creepPath.topEdgePathPoints }, levelDetails);
						this.registerPathEdge({ ...levelDetails.paths[x].propCurve!, curvePathPoints: creepPath.bottomEdgePathPoints }, levelDetails);
					}
				}
			}
		}
	}

	/**
	 * Register a prop to place and render
	 */
	async registerProp(args: LevelPropDefinition, levelDetails?: LevelDefinition) {
		const assetInstance = await AssetGenerator.createSpriteAsset(args.assetName, this.main) as SpriteAsset;
		if (assetInstance) {
			const colourisation = levelDetails?.propColourisation && levelDetails?.propColourisation[args.assetName];
			this.spriteAssets.push(assetInstance);

			assetInstance.registerOnLoadCallback(() => {
				colourisation && assetInstance.setColourisation(colourisation);
				assetInstance.setPosition(args.position);
				if (args.scale) assetInstance.setScale(args.scale);
				if (args.rotation) assetInstance.setRotate(args.rotation);
			});
		} else {
			console.error(`Asset not configured - ${args.assetName}`);
		}
	}

	/**
	 * Register a zone to generate props in
	 */
	registerPropZone(args: PropZoneArguments, levelDetails: LevelDefinition) {
		const propZonePropsY = args.environmentTile ? 0.2 : 0;
		const propZone = new PropZone(args, this.main);
		this.propZones.push(propZone);
		const propPositions: THREE.Vector3[] = propZone.createPositions();

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
	 * Draws a path edge with sprites
	 */
	registerPathEdge(args: PropCurveArguments, levelDetails: LevelDefinition) {
		const propCurve = new PropCurve(args, this.main);
		this.propCurves.push(propCurve);
		const propPositions: THREE.Vector3[] = propCurve.createPositions();

		// Place the props
		propPositions.forEach((position: any) => {
			const random = Math.random();
			let sum = 0;
			const pickedItem = args.propNames.find(item => (sum += item.chance) >= random);
			if (!pickedItem) throw new Error("Cannot choose a propName");

			this.registerProp({
				assetName: pickedItem.name,
				position: new THREE.Vector3(position.position.x, 0.25, position.position.z + 1),
				scale: new THREE.Vector3(position.scale.x, position.scale.y, position.scale.z),
				rotation: new THREE.Vector3(Math.PI / -2, 0, 0)
			}, levelDetails);
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

		this.spriteAssets.forEach((spriteAsset: SpriteAsset) => {
			spriteAsset.dispose();
		});
		this.spriteAssets = [];

		this.propCurves.forEach(propCurve => propCurve.dispose());
		this.propCurves = [];
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