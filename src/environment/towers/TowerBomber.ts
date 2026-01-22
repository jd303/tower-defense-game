import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes, ProjectileTravelTypes } from '../attacks/Projectile';
import { DamageTypes } from '../../data/DamageTypes';
import { BombShot } from '../effects/BombShot';
import { SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';

export class TowerBomber extends Tower {
	/**
	 * Static details
	 */
	static assetType = 'tower';
	static assetName = "TowerBomber";
	static assetPath = 'assets/spritesheets/towers/spritesheet-tower-bomber.png';
	static assetScale: number = 7;
	static assetPositionY = 3;
	static buttonIcon = 'assets/models/towers/Tower.Bomber.UI.icon.png';
	static cost = 175;
	static costType = 'money';
	static towerZoneWidth = 3;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 }
		}
	}
	static AnimationAttributes = {
		animates: true,
		animationSpeed: 0
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
			accuracy: 0.5,
			damage: 2,
			damageType: DamageTypes.crushing,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			effect: BombShot,
			travelType: ProjectileTravelTypes.arc,
			hitType: ProjectileHitTypes.splash,
			speed: 15,
			splashRadius: 3
		},
	};

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerBomber.assetName, TowerBomber.assetType, TowerBomber.assetScale, TowerBomber.assetPositionY, TowerBomber.spriteSheetRows, TowerBomber.AnimationAttributes);

		this.stats = new CharacterStats(TowerBomber.stats);

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
