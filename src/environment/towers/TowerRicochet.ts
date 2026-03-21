import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { RicochetProjectile } from '../projectiles/Ricochet.Projectile';
import { ShardProjectileEffect } from '../projectiles/effects/Shard.Projectile.Effect';

export class TowerRicochet extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerRicochet',
		assetPath: 'assets/towers/ricochet/spritesheet.tower.ricochet.png',
		assetScale: 5
	}
	static towerProperties = {
		icon: 'assets/towers/ricochet/ui.icon.tower.ricochet.png',
		art: ''
	}
	static cost = 85;
	static towerZoneWidth = 0;
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
			duration: 2000,
			accuracy: 0.5,
			damage: 3,
			damageType: DamageTypes.piercing,
			rangeType: AttackRangeTypes.ranged,
			range: 12
		},
		projectile: {
			projectile: RicochetProjectile,
			effect: ShardProjectileEffect,
			hitType: ProjectileHitTypes.ricochet,
			flightDuration: 500,
			splashRadius: 0
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 5;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerRicochet.assetProperties, TowerRicochet.spriteSheetRows, TowerRicochet.AnimationAttributes);

		this.stats = new CharacterStats({ ...TowerRicochet.stats });

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
