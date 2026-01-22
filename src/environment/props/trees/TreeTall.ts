import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";

export class TreeTall extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "TreeTall";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-tree-tall.png';
	static assetPositionY: number = 3;
	static assetScale: number = 2;
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
		super(main, TreeTall.assetName, TreeTall.assetType, TreeTall.spriteSheetRows, TreeTall.assetScale, TreeTall.assetPositionY, TreeTall.AnimationAttributes);
	}

}