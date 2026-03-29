import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { MagicProjectileEffect } from '../projectiles/effects/Magic.Projectile.Effect';
import { MagicOrbProjectile } from '../projectiles/MagicOrb.Projectile';

export class TowerOrb extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerOrb',
		assetPath: 'assets/towers/orb/spritesheet.tower.orb.png',
		assetScale: 6
	}
	static towerProperties = {
		icon: 'assets/towers/orb/ui.icon.tower.orb.png',
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
			duration: 2500,
			accuracy: 1.0,
			damage: 6,
			damageType: DamageTypes.arcane,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			projectile: MagicOrbProjectile,
			effect: MagicProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 2000,
			splashRadius: 0
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 7;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerOrb.assetProperties, TowerOrb.spriteSheetRows, TowerOrb.AnimationAttributes);

		this.stats = new CharacterStats(TowerOrb.stats);

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}


}
