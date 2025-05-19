import { Vector3 } from "three";
import { TerrainTypes } from "../../data/LevelInterfaces";
import { PropAsset } from "../propManager/PropManager";

export const MountainProps: PropAsset[] = [
	// SAND TEXTURE
	//// LARGE
	{
		tileset: TerrainTypes.sand,
		name: "mountain_1",
		assetPath: 'assets/models/nature/mountainous/mountain_1.glb',
		texturePath: 'assets/models/nature/mountainous/rock_1.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "mountain_2",
		assetPath: 'assets/models/nature/mountainous/mountain_2.glb',
		texturePath: 'assets/models/nature/mountainous/rock_1.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "mountain_3",
		assetPath: 'assets/models/nature/mountainous/mountain_3.glb',
		texturePath: 'assets/models/nature/mountainous/rock_1.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "mountain_4",
		assetPath: 'assets/models/nature/mountainous/stone_tall_1.glb',
		texturePath: 'assets/models/nature/mountainous/stone_tall_1.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "mountain_5",
		assetPath: 'assets/models/nature/mountainous/stone_tall_2.glb',
		texturePath: 'assets/models/nature/mountainous/stone_tall_2.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "mesa_1",
		assetPath: 'assets/models/nature/mountainous/mesa_1.glb',
		texturePath: 'assets/models/nature/mountainous/rock_1.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	//// SMALL
	{
		tileset: TerrainTypes.sand,
		name: "rock_1",
		assetPath: 'assets/models/nature/mountainous/rock_1.glb',
		texturePath: 'assets/models/nature/mountainous/rock_1.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "rock_2",
		assetPath: 'assets/models/nature/mountainous/rock_2.glb',
		texturePath: 'assets/models/nature/mountainous/rock_2.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	//// TINY
	{
		tileset: TerrainTypes.sand,
		name: "rubble_1",
		assetPath: 'assets/models/nature/mountainous/rubble_1.glb',
		texturePath: 'assets/models/nature/mountainous/rubble_1.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
]