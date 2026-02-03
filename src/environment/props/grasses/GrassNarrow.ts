import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";

export class GrassNarrow extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "GrassNarrow";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-grass-narrow.png';
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
		super(main, GrassNarrow.assetName, GrassNarrow.assetType, GrassNarrow.spriteSheetRows, GrassNarrow.assetScale, GrassNarrow.assetPositionY, GrassNarrow.AnimationAttributes);
	}

}