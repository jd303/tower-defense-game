import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";
import { SpriteAssetProperties } from "../assets/SpriteAsset";

export class MountainInitial extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'MountainInitial',
		assetPath: 'assets/spritesheets/environment/spritesheet-mountain-0.png',
		assetScale: 1
	}
	static instancedMeshInstanceCount: number = 1000;
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
		super(main, MountainInitial.assetProperties, MountainInitial.spriteSheetRows, MountainInitial.AnimationAttributes);
	}

}