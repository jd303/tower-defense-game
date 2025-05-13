import { Vector3 } from "three";
import { TerrainTypes } from "../../data/LevelInterfaces";
import { PropAsset } from "../props_manager/PropManager";

export const TreeProps: PropAsset[] = [
	{
		tileset: TerrainTypes.sand,
		name: "tree_cone",
		assetPath: 'assets/models/nature/Tree_Cone_Merged_1.glb',
		texturePath: 'assets/models/nature/Tree_Cone_Merged_1.jpg',
		defaultScale: new Vector3(0.5, 0.5, 0.5),
		shadows: true
	},
]