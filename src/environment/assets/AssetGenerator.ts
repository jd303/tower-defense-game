import { Main } from '../../core/Main';
import { Asset } from '../assets/Asset';
import { Lupine } from '../creeps/Lupine';
import { Troll } from '../creeps/Troll';
import { TrollDink } from '../creeps/TrollDink';
import { Wisp } from '../creeps/Wisp';
import { Man0 } from '../heroes/Man0';
import { MountainInitial } from '../props/Mountain_Initial';
import { TreeFir } from '../props/TreeFir';
import { TreeBulbous } from '../props/TreeBulbous';
import { TowerArcher } from '../towers/TowerArcher';
import { TowerBomber } from '../towers/TowerBomber';
import { TowerMage } from '../towers/TowerMage';
import { SpriteAsset } from './SpriteAsset';
import { TreeTall } from '../props/TreeTall';
import { WaveSubtle } from '../props/WaveSubtle';
import { LogSubmerged } from '../props/LogSubmerged';

export class AssetGenerator {
	static async getAssetAsSpriteAsset(assetName: string): Promise<typeof SpriteAsset> {
		return await this.resolveSpriteAsset(assetName) as typeof SpriteAsset;
	}

	static async createSpriteAsset(assetName: string, main: Main): Promise<Asset> {
		return await this.resolveSpriteAsset(assetName, main, true) as Asset;
	}

	/**
	 * Sprite Asset Resolver
	 */
	static async resolveSpriteAsset(assetName: string, main?: Main, instatiateClass: boolean = false) {
		switch (assetName) {
			// Creeps
			case 'Troll':
				return instatiateClass ? await new Troll(main!) : Troll;
			case 'TrollDink':
				return instatiateClass ? await new TrollDink(main!) : TrollDink;
			case 'Wisp':
				return instatiateClass ? await new Wisp(main!) : Wisp;
			case 'Lupine':
				return instatiateClass ? await new Lupine(main!) : Lupine;

			// Towers
			case 'TowerArcher':
				return instatiateClass ? await new TowerArcher(main!) : TowerArcher;
			case 'TowerBomber':
				return instatiateClass ? await new TowerBomber(main!) : TowerBomber;
			case 'TowerMage':
				return instatiateClass ? await new TowerMage(main!) : TowerMage;

			// Heroes
			case 'Man0':
				return instatiateClass ? await new Man0(main!) : Man0;

			// Environment - Trees
			case 'TreeBulbous':
				return instatiateClass ? await new TreeBulbous(main!) : TreeBulbous;
			case 'TreeFir':
				return instatiateClass ? await new TreeFir(main!) : TreeFir;
			case 'TreeTall':
				return instatiateClass ? await new TreeTall(main!) : TreeTall;
			case 'LogSubmerged':
				return instatiateClass ? await new LogSubmerged(main!) : LogSubmerged;

			// Environment - Mountains
			case 'MountainInitial':
				return instatiateClass ? await new MountainInitial(main!) : MountainInitial;

			// Environment - weather and effects
			case 'WaveSubtle':
				return instatiateClass ? await new WaveSubtle(main!) : WaveSubtle;

			// Default
			default:
				return console.error(`Unable to find asset to generate - ${assetName}`);
		}
	}
}
