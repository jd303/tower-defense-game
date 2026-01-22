import { Main } from '../../core/Main';
import { ShaderAnimationAttributes, SpriteAsset, SpriteSheetRow } from "./SpriteAsset";

export abstract class PropAsset extends SpriteAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string;
	static assetPositionY: number;
	static assetScale: number;
	static instancedMeshInstanceCount: number;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetType: string, spriteSheetRows: SpriteSheetRow[], assetScale: number, assetPositionY: number, animationAttributes: ShaderAnimationAttributes) {
		super(main, assetName, assetType, assetScale, assetPositionY, spriteSheetRows, animationAttributes);
	}
}
