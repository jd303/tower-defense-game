import { Main } from '../core/Main';
import { ModelAsset } from './assets/ModelAsset';

export abstract class Effect extends ModelAsset {
	static assetName: string = "effect";

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string) {
		super(main, assetName, 'effect');
	}
}

// Define a generic type for classes that extend Effect
export type EffectConstructor = new (main: Main) => Effect;