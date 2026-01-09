import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class LogSubmerged extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "LogSubmerged";
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-log-submerged.png';
	static assetPositionY: number = 1.75;
	static assetScale: number = 1;
	static instancedMeshAssetScale: number = 1;
	static instancedMeshCount: number = 500;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 },
			uSize: { value: 1 }
		},
		alphaTest: 0.5,
		transparent: true
	}

	constructor(main: Main) {
		super(main, LogSubmerged.assetName, LogSubmerged.assetPositionY, LogSubmerged.instancedMeshAssetScale, LogSubmerged.instancedMeshCount);
	}

}