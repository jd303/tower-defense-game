import { Vector3 } from "three";
import { TerrainTypes } from "../../data/LevelInterfaces";
import { PropAsset } from "../propManager/PropManager";

export const TreeProps: PropAsset[] = [
	{
		tileset: TerrainTypes.sand,
		name: "tree_cone",
		assetPath: 'assets/models/nature/flora/tree_cone_1.glb',
		texturePath: 'assets/models/nature/flora/tree_cone_1.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_cone_2",
		assetPath: 'assets/models/nature/flora/tree_cone_2.glb',
		texturePath: 'assets/models/nature/flora/tree_cone_2.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_cone_6",
		assetPath: 'assets/models/nature/flora/tree_cone_6.glb',
		texturePath: 'assets/models/nature/flora/tree_cone_6.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_thin",
		assetPath: 'assets/models/nature/flora/tree_thin.glb',
		texturePath: 'assets/models/nature/flora/tree_thin.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_lollipop",
		assetPath: 'assets/models/nature/flora/tree_lollipop.glb',
		texturePath: 'assets/models/nature/flora/tree_lollipop.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_forked",
		assetPath: 'assets/models/nature/flora/tree_forked.glb',
		texturePath: 'assets/models/nature/flora/tree_forked.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_spread",
		assetPath: 'assets/models/nature/flora/tree_spread.glb',
		texturePath: 'assets/models/nature/flora/tree_spread.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_stump_short",
		assetPath: 'assets/models/nature/flora/tree_stump.glb',
		texturePath: 'assets/models/nature/flora/tree_stump.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_dead_spread",
		assetPath: 'assets/models/nature/flora/tree_dead_spread.glb',
		texturePath: 'assets/models/nature/flora/tree_dead.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_dead_tall",
		assetPath: 'assets/models/nature/flora/tree_dead_tall.glb',
		texturePath: 'assets/models/nature/flora/tree_dead.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_dead_slender",
		assetPath: 'assets/models/nature/flora/tree_dead_slender.glb',
		texturePath: 'assets/models/nature/flora/tree_dead.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
]