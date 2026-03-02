import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";
import { SpriteAssetProperties } from "../assets/SpriteAsset";

export class WaveSubtle extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'WaveSubtle',
		assetPath: 'assets/spritesheets/environment/spritesheet-wave-subtle.png',
		assetScale: 2
	}
	static instancedMeshInstanceCount: number = 500;
	static instancedMeshAnimates: boolean = false;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 }
		}
	}
	static AnimationAttributes = {
		animates: false,
		animationSpeed: 2
	}

	constructor(main: Main) {
		super(main, WaveSubtle.assetProperties, WaveSubtle.spriteSheetRows, WaveSubtle.AnimationAttributes);
	}

}