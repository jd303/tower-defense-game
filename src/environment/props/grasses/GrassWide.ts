import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";
import { SpriteAssetProperties } from "../../assets/SpriteAsset";

export class GrassWide extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'GrassWide',
		assetPath: 'assets/spritesheets/environment/spritesheet-grass-wide.png',
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
		super(main, GrassWide.assetProperties, GrassWide.spriteSheetRows, GrassWide.AnimationAttributes);
	}

}