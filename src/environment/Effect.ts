import { Main } from '../core/Main';
import { ModelAsset } from './assets/ModelAsset';

export abstract class Effect extends ModelAsset {
	abstract assetName: string;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string) {
		super(main, assetName, 'effect');
	}
}
