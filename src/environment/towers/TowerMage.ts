import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes, ProjectileTravelTypes } from '../attacks/Projectile';
import { DamageTypes } from '../../data/DamageTypes';
import { MagicBolt } from '../effects/MagicBolt';
import { SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';

export class TowerMage extends Tower {
	/**
	 * Static details
	 */
	static assetType = 'tower';
	static assetName = "TowerMage";
	static assetPath = 'assets/spritesheets/towers/spritesheet-tower-mage.png';
	static assetScale: number = 7;
	static assetPositionY = 3;
	static buttonIcon = 'assets/models/towers/Tower.Mage.UI.icon.png';
	static cost = 150;
	static costType = 'money';
	static towerZoneWidth = 1;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 }
		}
	}
	static AnimationAttributes = {
		animates: true,
		animationSpeed: 2
	}
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "idle",
			totalFrames: 1,
			currentFrame: 0,
		}
	]

	/**
	 * Stats
	 * */
	static stats: StatBlockCharacter = {
		attack: {
			speed: 1,
			accuracy: 1.0,
			damage: 6,
			damageType: DamageTypes.arcane,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			effect: MagicBolt,
			travelType: ProjectileTravelTypes.homing,
			hitType: ProjectileHitTypes.direct,
			speed: 2,
			splashRadius: 0
		},
	};

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerMage.assetName, TowerMage.assetType, TowerMage.assetScale, TowerMage.assetPositionY, TowerMage.spriteSheetRows, TowerMage.AnimationAttributes);

		this.stats = new CharacterStats(TowerMage.stats);

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
