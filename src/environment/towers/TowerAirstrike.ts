import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { AirstrikeProjectileEffect } from '../projectiles/effects/Airstrike.Projectile.Effect';
import { AirstrikeProjectile } from '../projectiles/Airstrike.Projectile';

export class TowerAirstrike extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerAirstrike',
		assetPath: 'assets/towers/airstrike/spritesheet.tower.airstrike.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/airstrike/ui.icon.tower.airstrike.png',
		art: ''
	}
	static cost = 300;
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
			duration: 6000,
			accuracy: 0.8,
			damage: 5,
			damageType: DamageTypes.crushing,
			rangeType: AttackRangeTypes.ranged,
			range: 40
		},
		projectile: {
			projectile: AirstrikeProjectile,
			effect: AirstrikeProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 1000,
			splashRadius: 0
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 1.0;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerAirstrike.assetProperties, TowerAirstrike.spriteSheetRows, TowerAirstrike.AnimationAttributes);
		this.stats = new CharacterStats({ ...TowerAirstrike.stats });
		return this;
	}
}
