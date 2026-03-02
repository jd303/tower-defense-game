import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";
import { SpriteAssetProperties } from "../../assets/SpriteAsset";

export class ShrubWide extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'ShrubWide',
		assetPath: 'assets/spritesheets/environment/spritesheet-shrub-wide.png',
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
		super(main, ShrubWide.assetProperties, ShrubWide.spriteSheetRows, ShrubWide.AnimationAttributes);
	}

}