import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes, ProjectileTravelTypes } from '../attacks/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { MagicBolt } from '../effects/MagicBolt';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';

export class TowerMage extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerMage',
		assetPath: 'assets/towers/mage/spritesheet-tower-mage.png',
		assetScale: 7,
		assetPositionY: 0
	}
	static towerProperties = {
		icon: 'assets/models/towers/Tower.Mage.UI.icon.png',
		art: ''
	}
	static cost = 150;
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
		super(main, TowerMage.assetProperties, TowerMage.spriteSheetRows, TowerMage.AnimationAttributes);

		this.stats = new CharacterStats(TowerMage.stats);

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
