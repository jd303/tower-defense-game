import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { BeamProjectileEffect } from '../projectiles/effects/Beam.Projectile.Effect';
import { BeamProjectile } from '../projectiles/Beam.Projectile';

export class TowerBeam extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerBeam',
		assetPath: 'assets/towers/beam/spritesheet.tower.beam.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/beam/ui.icon.tower.beam.png',
		art: ''
	}
	static cost = 150;
	static towerZoneWidth = 1;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 4 },
			uFrameRows: { value: 4 }
		}
	}
	static AnimationAttributes = {
		animates: true,
		animationSpeed: 8
	}
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "scanning",
			totalFrames: 1,
			currentFrame: 0,
		},
		{
			name: "attacking",
			totalFrames: 4,
			currentFrame: 0,
		}
	]

	/**
	 * Stats
	 * */
	static stats: StatBlockCharacter = {
		attack: {
			duration: 5000,
			accuracy: 0.5,
			damage: 0.5,
			damageType: DamageTypes.arcane,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			projectile: BeamProjectile,
			effect: BeamProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 2000,
			splashRadius: 0
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 8.5;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerBeam.assetProperties, TowerBeam.spriteSheetRows, TowerBeam.AnimationAttributes);

		this.stats = new CharacterStats(TowerBeam.stats);

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
