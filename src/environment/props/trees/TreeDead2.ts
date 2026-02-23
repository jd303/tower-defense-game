import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";
import { SpriteAssetProperties } from "../../assets/SpriteAsset";

export class TreeDead2 extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'TreeDead2',
		assetPath: 'assets/trees/spritesheet-tree-dead-2.png',
		assetScale: 2,
		assetPositionY: 0
	}
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
		super(main, TreeDead2.assetProperties, TreeDead2.spriteSheetRows, TreeDead2.AnimationAttributes);
	}

}