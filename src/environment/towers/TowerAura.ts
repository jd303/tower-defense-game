import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { AuraProjectile } from '../projectiles/Aura.Projectile';
import { AuraProjectileEffect } from '../projectiles/effects/Aura.Projectile.Effect';

export class TowerAura extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerAura',
		assetPath: 'assets/towers/aura/spritesheet-tower-aura.png',
		assetScale: 5
	}
	static towerProperties = {
		icon: 'assets/towers/aura/ui.icon.tower.aura.png',
		art: ''
	}
	static cost = 125;
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
			duration: 2500,
			accuracy: 0.33,
			damage: 1,
			damageType: DamageTypes.arcane,
			rangeType: AttackRangeTypes.ranged,
			range: 14
		},
		projectile: {
			projectile: AuraProjectile,
			effect: AuraProjectileEffect,
			hitType: ProjectileHitTypes.direct,
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
		super(main, TowerAura.assetProperties, TowerAura.spriteSheetRows, TowerAura.AnimationAttributes);

		this.stats = new CharacterStats({ ...TowerAura.stats });

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
