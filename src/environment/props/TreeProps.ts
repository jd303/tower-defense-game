import { Vector3 } from "three";
import { TerrainTypes } from "../../data/LevelInterfaces";
import { SpritePropAssetDefinition } from "../propManager/SpritePropManager";

export const TreeProps: SpritePropAssetDefinition[] = [
	{
		tileset: TerrainTypes.sand,
		name: "tree_cone",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_cone_1.glb',
		texturePath: 'assets/models/nature/flora/tree_cone_1.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_cone_2",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_cone_2.glb',
		texturePath: 'assets/models/nature/flora/tree_cone_2.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_cone_6",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_cone_6.glb',
		texturePath: 'assets/models/nature/flora/tree_cone_6.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_thin",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_thin.glb',
		texturePath: 'assets/models/nature/flora/tree_thin.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_lollipop",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_lollipop.glb',
		texturePath: 'assets/models/nature/flora/tree_lollipop.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_forked",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_forked.glb',
		texturePath: 'assets/models/nature/flora/tree_forked.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_spread",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_spread.glb',
		texturePath: 'assets/models/nature/flora/tree_spread.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_stump_short",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_stump.glb',
		texturePath: 'assets/models/nature/flora/tree_stump.jpg',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_dead_spread",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_dead_spread.glb',
		texturePath: 'assets/models/nature/flora/tree_dead.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_dead_tall",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_dead_tall.glb',
		texturePath: 'assets/models/nature/flora/tree_dead.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
	{
		tileset: TerrainTypes.sand,
		name: "tree_dead_slender",
		spritesheetPath: 'assets/spritesheets/spritesheet-tree.png',
		assetPath: 'assets/models/nature/flora/tree_dead_slender.glb',
		texturePath: 'assets/models/nature/flora/tree_dead.png',
		defaultScale: new Vector3(1, 1, 1),
		shadows: true
	},
]