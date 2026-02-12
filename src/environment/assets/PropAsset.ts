import { Main } from '../../core/Main';
import { ShaderAnimationAttributes, SpriteAsset, SpriteAssetProperties, SpriteSheetRow } from "./SpriteAsset";

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
	constructor(main: Main, assetProperties: SpriteAssetProperties, spriteSheetRows: SpriteSheetRow[], animationAttributes: ShaderAnimationAttributes) {
		super(main, assetProperties, spriteSheetRows, animationAttributes);
	}
}
