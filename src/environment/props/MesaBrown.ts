import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";
import { SpriteAssetProperties } from "../assets/SpriteAsset";

export class MesaBrown extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'prop',
		assetName: 'MesaBrown',
		assetPath: 'assets/spritesheets/environment/spritesheet-mesa-brown.png',
		assetScale: 1
	}
	static instancedMeshInstanceCount: number = 1000;
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
		super(main, MesaBrown.assetProperties, MesaBrown.spriteSheetRows, MesaBrown.AnimationAttributes);
	}

}