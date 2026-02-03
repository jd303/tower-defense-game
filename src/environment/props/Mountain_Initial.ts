import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class MountainInitial extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "MountainInitial";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-mountain-0.png';
	static assetPositionY: number = 0;
	static assetScale: number = 1;
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
		super(main, MountainInitial.assetName, MountainInitial.assetType, MountainInitial.spriteSheetRows, MountainInitial.assetScale, MountainInitial.assetPositionY, MountainInitial.AnimationAttributes);
	}

}