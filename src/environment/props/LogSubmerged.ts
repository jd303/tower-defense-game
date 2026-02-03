import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class LogSubmerged extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "LogSubmerged";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-log-submerged.png';
	static assetPositionY: number = 0;
	static assetScale: number = 1;
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
		super(main, LogSubmerged.assetName, LogSubmerged.assetType, LogSubmerged.spriteSheetRows, LogSubmerged.assetScale, LogSubmerged.assetPositionY, LogSubmerged.AnimationAttributes);
	}

}