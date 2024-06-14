import { Vector3 } from "three";
import { TerrainTypes } from "../../data/LevelInterfaces";
import { PropAsset } from "../PropManager";

export const MountainProps: PropAsset[] = [
	{
		tileset: TerrainTypes.sand,
		name: "mountain_1",
		assetPath: 'assets/models/nature/Mountain_Merged_1.glb',
		texturePath: 'assets/models/nature/Mountain_Merged_1.jpg',
		defaultScale: new Vector3(10, 10, 10)
	},
	{
		tileset: TerrainTypes.sand,
		name: "mesa_1",
		assetPath: 'assets/models/nature/Mesa_1.glb',
		texturePath: 'assets/models/nature/Mesa_1.jpg',
		defaultScale: new Vector3(2, 2, 2)
	}
]