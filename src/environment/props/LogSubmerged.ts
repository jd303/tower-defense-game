import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";
import { SpriteAssetProperties } from "../assets/SpriteAsset";

export class LogSubmerged extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'LogSubmerged',
		assetPath: 'assets/spritesheets/environment/spritesheet-log-submerged.png',
		assetScale: 1
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
		super(main, LogSubmerged.assetProperties, LogSubmerged.spriteSheetRows, LogSubmerged.AnimationAttributes);
	}

}