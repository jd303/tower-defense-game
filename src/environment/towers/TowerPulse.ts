import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { PulseProjectileEffect } from '../projectiles/effects/Pulse.Projectile.Effect';
import { PulseProjectile } from '../projectiles/Pulse.Projectile';

export class TowerPulse extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerPulse',
		assetPath: 'assets/towers/pulse/spritesheet.tower.pulse.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/pulse/ui.icon.tower.pulse.png',
		art: ''
	}
	static cost = 200;
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
			duration: 2000,
			accuracy: 1.0,
			damage: 2,
			damageType: DamageTypes.arcane,
			rangeType: AttackRangeTypes.ranged,
			range: 15
		},
		projectile: {
			projectile: PulseProjectile,
			effect: PulseProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 500, // Takes half a second to fully expand and hit
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
		super(main, TowerPulse.assetProperties, TowerPulse.spriteSheetRows, TowerPulse.AnimationAttributes);

		this.stats = new CharacterStats({ ...TowerPulse.stats });

		return this;
	}
}
