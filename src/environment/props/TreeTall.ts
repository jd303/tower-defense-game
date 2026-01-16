import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class TreeTall extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "TreeTall";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-tree-tall.png';
	static assetPositionY: number = 3;
	static assetScale: number = 2;
	static instancedMeshAssetScale: number = 2;
	static instancedMeshInstanceCount: number = 2000;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 },
			uSize: { value: 1 }
		},
		alphaTest: 0.5,
		transparent: true
	}
	static AnimationAttributes = {
		animationSpeed: 2
	}

	constructor(main: Main) {
		super(main, TreeTall.assetName, TreeTall.assetType, TreeTall.spriteSheetRows, TreeTall.assetPositionY, TreeTall.instancedMeshAssetScale, TreeTall.instancedMeshInstanceCount);
	}

}