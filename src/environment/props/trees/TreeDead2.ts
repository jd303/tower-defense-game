import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";

export class TreeDead2 extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "TreeDead2";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-tree-dead-2.png';
	static assetPositionY: number = 0;
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
		super(main, TreeDead2.assetName, TreeDead2.assetType, TreeDead2.spriteSheetRows, TreeDead2.assetScale, TreeDead2.assetPositionY, TreeDead2.AnimationAttributes);
	}

}