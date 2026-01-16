import { Main } from '../../core/Main';
import { SpriteAsset, SpriteSheetRow } from "./SpriteAsset";

export abstract class PropAsset extends SpriteAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string;
	static assetPositionY: number;
	static assetScale: number;
	static instancedMeshAssetScale: number;
	static instancedMeshInstanceCount: number;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetType: string, spriteSheetRows: SpriteSheetRow[], assetPositionY: number, instancedMeshAssetScale: number, instancedMeshInstanceCount: number) {
		super(main, assetName, assetType, assetPositionY, spriteSheetRows, instancedMeshAssetScale, instancedMeshInstanceCount);
	}
}
