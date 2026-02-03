import { Main } from "../../core/Main";
import { PropAsset } from "../assets/PropAsset";

export class MesaBrown extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "MesaBrown";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-mesa-brown.png';
	static assetPositionY: number = 0;
	static assetScale: number = 1;
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
		super(main, MesaBrown.assetName, MesaBrown.assetType, MesaBrown.spriteSheetRows, MesaBrown.assetScale, MesaBrown.assetPositionY, MesaBrown.AnimationAttributes);
	}

}