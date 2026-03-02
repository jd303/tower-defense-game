import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";
import { SpriteAssetProperties } from "../../assets/SpriteAsset";

export class TreeBulbous extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'TreeBulbous',
		assetPath: 'assets/trees/spritesheet-tree-bulbous.png',
		assetScale: 0.5
	}
	static instancedMeshInstanceCount: number = 5000;
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
		super(main, TreeBulbous.assetProperties, TreeBulbous.spriteSheetRows, TreeBulbous.AnimationAttributes);
	}

}