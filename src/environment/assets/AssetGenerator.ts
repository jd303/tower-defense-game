import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Asset } from '../assets/Asset';
import { Lupine } from '../creeps/Lupine';
import { Troll } from '../creeps/Troll';
import { TrollDink } from '../creeps/TrollDink';
import { Wisp } from '../creeps/Wisp';
import { AldricEthersteel } from '../heroes/list/HeroAldricEthersteel';
import { MountainInitial } from '../props/Mountain_Initial';
import { TreeFir } from '../props/trees/TreeFir';
import { TreeBulbous } from '../props/trees/TreeBulbous';
import { TowerArcher } from '../towers/TowerArcher';
import { TowerBomber } from '../towers/TowerBomber';
import { TowerMage } from '../towers/TowerMage';
import { SpriteAsset } from './SpriteAsset';
import { TreeTall } from '../props/trees/TreeTall';
import { WaveSubtle } from '../props/WaveSubtle';
import { LogSubmerged } from '../props/LogSubmerged';
import { PowerCatapultBarrage } from '../powers/PowerCatapultBarrage';
import { Power } from '../powers/Power';
import { PowerCatapultBarrageRock } from '../powers/PowerCatapultBarrage_Rock';
import { Level } from '../../levels/Level';
import { PowerTimeNoodleDistortion } from '../powers/PowerTimeNoodleDistortion';
import { PowerTowerMotivation } from '../powers/PowerTowerMotivation';
import { PowerSpringDoorTrap } from '../powers/PowerSpringDoorTrap';
import { PowerHeroMotivation } from '../powers/PowerHeroMotivation';
import { MesaBrown } from '../props/MesaBrown';
import { TreeDead } from '../props/trees/TreeDead';
import { TreeDead2 } from '../props/trees/TreeDead2';
import { GrassNarrow } from '../props/grasses/GrassNarrow';
import { GrassWide } from '../props/grasses/GrassWide';
import { ShrubWide } from '../props/grasses/ShrubWide';
import { Nether } from '../heroes/list/HeroNether';

export class AssetGenerator {
	/**
	 * Sprite Asset creators
	 */
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
			case 'CreepTroll':
				return instatiateClass ? await new Troll(main!) : Troll;
			case 'CreepTrollDink':
				return instatiateClass ? await new TrollDink(main!) : TrollDink;
			case 'CreepWisp':
				return instatiateClass ? await new Wisp(main!) : Wisp;
			case 'CreepLupine':
				return instatiateClass ? await new Lupine(main!) : Lupine;

			// Towers
			case 'TowerArcher':
				return instatiateClass ? await new TowerArcher(main!) : TowerArcher;
			case 'TowerBomber':
				return instatiateClass ? await new TowerBomber(main!) : TowerBomber;
			case 'TowerMage':
				return instatiateClass ? await new TowerMage(main!) : TowerMage;

			// Heroes
			case 'AldricEthersteel':
				return instatiateClass ? await new AldricEthersteel(main!) : AldricEthersteel;
			case 'Nether':
				return instatiateClass ? await new Nether(main!) : Nether;

			// Environment - Trees
			case 'TreeBulbous':
				return instatiateClass ? await new TreeBulbous(main!) : TreeBulbous;
			case 'TreeFir':
				return instatiateClass ? await new TreeFir(main!) : TreeFir;
			case 'TreeTall':
				return instatiateClass ? await new TreeTall(main!) : TreeTall;
			case 'TreeDead':
				return instatiateClass ? await new TreeDead(main!) : TreeDead;
			case 'TreeDead2':
				return instatiateClass ? await new TreeDead2(main!) : TreeDead2;
			case 'LogSubmerged':
				return instatiateClass ? await new LogSubmerged(main!) : LogSubmerged;

			// Environment - Grasses and edges
			case 'GrassNarrow':
				return instatiateClass ? await new GrassNarrow(main!) : GrassNarrow;
			case 'GrassWide':
				return instatiateClass ? await new GrassWide(main!) : GrassWide;
			case 'ShrubWide':
				return instatiateClass ? await new ShrubWide(main!) : ShrubWide;

			// Environment - Mountains
			case 'MountainInitial':
				return instatiateClass ? await new MountainInitial(main!) : MountainInitial;
			case 'MesaBrown':
				return instatiateClass ? await new MesaBrown(main!) : MesaBrown;

			// Environment - weather and effects
			case 'WaveSubtle':
				return instatiateClass ? await new WaveSubtle(main!) : WaveSubtle;

			// Power Sprites
			case 'PowerCatapultBarrageRock':
				return instatiateClass ? await new PowerCatapultBarrageRock(main!) : PowerCatapultBarrageRock;

			// Default
			default:
				return console.error(`Unable to find asset to generate - ${assetName}`);
		}
	}

	/**
	 * Sprite Asset creators
	 */
	static async getPowerAsAsset(assetName: string): Promise<typeof Power> {
		return await this.resolvePowerAsset(assetName) as typeof Power;
	}

	static async createPowerAsset(assetName: string, main: Main, level: Level, position: THREE.Vector3): Promise<Power> {
		return await this.resolvePowerAsset(assetName, main, position, level, true) as Power;
	}

	/**
	 * Sprite Asset Resolver
	 */
	static async resolvePowerAsset(assetName: string, main?: Main, position?: THREE.Vector3, level?: Level, instatiateClass: boolean = false) {
		switch (assetName) {
			// Powers
			case 'PowerTimeNoodleDistortion':
				return instatiateClass ? await new PowerTimeNoodleDistortion(main!, level!, position!) : PowerTimeNoodleDistortion;
			case 'PowerTowerMotivation':
				return instatiateClass ? await new PowerTowerMotivation(main!, level!, position!) : PowerTowerMotivation;
			case 'PowerHeroMotivation':
				return instatiateClass ? await new PowerHeroMotivation(main!, level!, position!) : PowerHeroMotivation;
			case 'PowerSpringDoorTrap':
				return instatiateClass ? await new PowerSpringDoorTrap(main!, level!, position!) : PowerSpringDoorTrap;
			case 'PowerCatapultBarrage':
			default:
				return instatiateClass ? await new PowerCatapultBarrage(main!, level!, position!) : PowerCatapultBarrage;
		}
	}
}
