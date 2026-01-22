import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";

export class TreeFir extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "TreeFir";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-tree-fir.png';
	static assetPositionY: number = 3;
	static assetScale: number = 0.2;
	static instancedMeshInstanceCount: number = 2000;
	static instancedMeshAnimates: boolean = false;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 }
		}
	}
	static AnimationAttributes = {
		animates: false,
		animationSpeed: null
	}

	constructor(main: Main) {
		super(main, TreeFir.assetName, TreeFir.assetType, TreeFir.spriteSheetRows, TreeFir.assetScale, TreeFir.assetPositionY, TreeFir.AnimationAttributes);
	}

}