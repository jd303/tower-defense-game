import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { ArrowProjectileEffect } from '../projectiles/effects/Arrow.Projectile.Effect';
import { ArrowProjectile } from '../projectiles/Arrow.Projectile';

export class TowerArcher extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerArcher',
		assetPath: 'assets/towers/archer/spritesheet.tower.archer.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/archer/ui.icon.tower.archer.png',
		art: ''
	}
	static cost = 100;
	static towerZoneWidth = 0;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 4 },
			uFrameRows: { value: 4 }
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
			duration: 1000,
			accuracy: 0.33,
			damage: 5,
			damageType: DamageTypes.piercing,
			rangeType: AttackRangeTypes.ranged,
			range: 13
		},
		projectile: {
			projectile: ArrowProjectile,
			effect: ArrowProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 500,
			splashRadius: 0
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 8;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerArcher.assetProperties, TowerArcher.spriteSheetRows, TowerArcher.AnimationAttributes);

		this.stats = new CharacterStats({ ...TowerArcher.stats });

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
