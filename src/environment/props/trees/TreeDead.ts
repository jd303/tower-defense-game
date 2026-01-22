import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";

export class TreeDead extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "TreeDead";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-tree-dead.png';
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
		super(main, TreeDead.assetName, TreeDead.assetType, TreeDead.spriteSheetRows, TreeDead.assetScale, TreeDead.assetPositionY, TreeDead.AnimationAttributes);
	}

}