import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class WaveSubtle extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "WaveSubtle";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-wave-subtle.png';
	static assetPositionY: number = 0.25;
	static assetScale: number = 2;
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
		super(main, WaveSubtle.assetName, WaveSubtle.assetType, WaveSubtle.spriteSheetRows, WaveSubtle.assetScale, WaveSubtle.assetPositionY, WaveSubtle.AnimationAttributes);
	}

}