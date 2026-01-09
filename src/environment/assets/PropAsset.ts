import { Main } from '../../core/Main';
import { SpriteAsset } from "./SpriteAsset";

export abstract class PropAsset extends SpriteAsset {
	/**
	 * Setup Properties
	 * */
	static assetName: string;
	static assetPositionY: number;
	static assetScale: number;
	static instancedMeshAssetScale: number;
	static instancedMeshCount: number;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetPositionY: number, instancedMeshAssetScale: number, instancedMeshInstanceCount: number) {
		super(main, assetName, 'prop', assetPositionY, [], 0, instancedMeshAssetScale, instancedMeshInstanceCount);
	}
}
