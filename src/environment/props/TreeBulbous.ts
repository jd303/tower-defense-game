import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class TreeBulbous extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "TreeBulbous";
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-tree-bulbous.png';
	static assetPositionY: number = 3;
	static assetScale: number = 2;
	static instancedMeshAssetScale: number = 2;
	static instancedMeshCount: number = 5000;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 },
			uSize: { value: 1 }
		},
		alphaTest: 0.5,
		transparent: true
	}

	constructor(main: Main) {
		super(main, TreeBulbous.assetName, TreeBulbous.assetPositionY, TreeBulbous.instancedMeshAssetScale, TreeBulbous.instancedMeshCount);
	}

}