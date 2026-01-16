import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes, ProjectileTravelTypes } from '../attacks/Projectile';
import { DamageTypes } from '../../data/DamageTypes';
import { MagicBolt } from '../effects/MagicBolt';
import { SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlock, Stats } from '../Stats';

export class TowerMage extends Tower {
	/**
	 * Tower Assets
	 * */
	assetScale = 2.2;

	/**
	 * Static details
	 */
	static assetType = 'tower';
	static assetName = "TowerMage";
	static assetPath = 'assets/spritesheets/towers/spritesheet-tower-mage.png';
	static assetScale: number = 1;
	static assetPositionY = 3;
	static buttonIcon = 'assets/models/towers/Tower.Mage.UI.icon.png';
	static cost = 150;
	static costType = 'money';
	static towerZoneWidth = 1;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 },
			uSize: { value: 8 }
		},
		alphaTest: 0.5,
		transparent: true
	}
	static AnimationAttributes = {
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
	static stats: StatBlock = {
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
		super(main, TowerMage.assetName, TowerMage.assetType, TowerMage.assetPositionY, TowerMage.spriteSheetRows, TowerMage.assetScale);

		this.stats = new Stats(TowerMage.stats);

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
