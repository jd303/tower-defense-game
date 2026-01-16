import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class MountainInitial extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "MountainInitial";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-mountain-0.png';
	static assetPositionY: number = 1;
	static assetScale: number = 1;
	static instancedMeshAssetScale: number = 2;
	static instancedMeshInstanceCount: number = 500;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 },
			uSize: { value: 1 }
		},
		alphaTest: 0.5,
		transparent: true
	}
	static AnimationAttributes = {
		animationSpeed: 2
	}

	constructor(main: Main) {
		super(main, MountainInitial.assetName, MountainInitial.assetType, MountainInitial.spriteSheetRows, MountainInitial.assetPositionY, MountainInitial.instancedMeshAssetScale, MountainInitial.instancedMeshInstanceCount);
	}

}