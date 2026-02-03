import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";

export class ShrubWide extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "ShrubWide";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-shrub-wide.png';
	static assetPositionY: number = 0;
	static assetScale: number = 0.5;
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
		super(main, ShrubWide.assetName, ShrubWide.assetType, ShrubWide.spriteSheetRows, ShrubWide.assetScale, ShrubWide.assetPositionY, ShrubWide.AnimationAttributes);
	}

}