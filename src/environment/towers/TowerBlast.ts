import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { BombProjectileEffect } from '../projectiles/effects/Bomb.Projectile.Effect';
import { BombProjectile } from '../projectiles/Bomb.Projectile';

export class TowerBlast extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerBlast',
		assetPath: 'assets/towers/blast/spritesheet.tower.blast.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/blast/ui.icon.tower.blast.png',
		art: ''
	}
	static cost = 175;
	static towerZoneWidth = 3;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 4 },
			uFrameRows: { value: 4 }
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
			duration: 3000,
			accuracy: 0.5,
			damage: 2,
			damageType: DamageTypes.crushing,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			projectile: BombProjectile,
			effect: BombProjectileEffect,
			hitType: ProjectileHitTypes.splash,
			flightDuration: 30,
			splashRadius: 3
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
		super(main, TowerBlast.assetProperties, TowerBlast.spriteSheetRows, TowerBlast.AnimationAttributes);

		this.stats = new CharacterStats(TowerBlast.stats);

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
