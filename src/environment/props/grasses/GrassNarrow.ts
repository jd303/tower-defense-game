import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";
import { SpriteAssetProperties } from "../../assets/SpriteAsset";

export class GrassNarrow extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'GrassNarrow',
		assetPath: 'assets/spritesheets/environment/spritesheet-grass-narrow.png',
		assetScale: 0.5,
		assetPositionY: 0
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
		super(main, GrassNarrow.assetProperties, GrassNarrow.spriteSheetRows, GrassNarrow.AnimationAttributes);
	}

}