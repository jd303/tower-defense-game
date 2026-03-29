import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { BoulderProjectileEffect } from '../projectiles/effects/Boulder.Projectile.Effect';
import { BoulderProjectile } from '../projectiles/Boulder.Projectile';

export class TowerBoulder extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerBoulder',
		// Reusing Archer sprite sheet as requested
		assetPath: 'assets/towers/boulder/spritesheet.tower.boulder.png',
		assetScale: 7
	}
	static towerProperties = {
		// Reusing Archer icon as requested
		icon: 'assets/towers/boulder/ui.icon.tower.boulder.png',
		art: ''
	}
	static cost = 150;
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
			duration: 2500,
			accuracy: 1.0,
			damage: 4,
			damageType: DamageTypes.crushing,
			rangeType: AttackRangeTypes.ranged,
			range: 20
		},
		projectile: {
			projectile: BoulderProjectile,
			effect: BoulderProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 2000,
			splashRadius: 0
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 1.0; // Boulder gets spawned near the base

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerBoulder.assetProperties, TowerBoulder.spriteSheetRows, TowerBoulder.AnimationAttributes);

		this.stats = new CharacterStats({ ...TowerBoulder.stats });

		return this;
	}
}
