import { Main } from "../../../core/Main";
import { PropAsset } from "../../assets/PropAsset";

export class TreeBulbous extends PropAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string = "TreeBulbous";
	static assetType = 'prop';
	static assetPath: string = 'assets/spritesheets/environment/spritesheet-tree-bulbous.png';
	static assetPositionY: number = 3;
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
		super(main, TreeBulbous.assetName, TreeBulbous.assetType, TreeBulbous.spriteSheetRows, TreeBulbous.assetScale, TreeBulbous.assetPositionY, TreeBulbous.AnimationAttributes);
	}

}