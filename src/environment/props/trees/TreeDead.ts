import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";
import { SpriteAssetProperties } from "../../assets/SpriteAsset";

export class TreeDead extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'TreeDead',
		assetPath: 'assets/trees/spritesheet-tree-dead.png',
		assetScale: 2
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
		super(main, TreeDead.assetProperties, TreeDead.spriteSheetRows, TreeDead.AnimationAttributes);
	}

}