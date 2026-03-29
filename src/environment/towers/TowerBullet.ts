import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { TickTimeProperties } from '../../core/TickService';
import * as THREE from 'three';
import { TowerStates, TowerTransitions } from './TowerStates';
import { Creep } from '../creeps/Creep';
import { BulletProjectileEffect } from '../projectiles/effects/Bullet.Projectile.Effect';
import { BulletProjectile } from '../projectiles/Bullet.Projectile';
import { PositionService } from '../PositionService';

export class TowerBullet extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerBullet',
		assetPath: 'assets/towers/bullet/spritesheet.tower.bullet.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/bullet/ui.icon.tower.bullet.png',
		art: ''
	}
	static cost = 250;
	static towerZoneWidth = 2;
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
			duration: 2500,
			accuracy: 0.4,
			damage: 3,
			damageType: DamageTypes.piercing,
			rangeType: AttackRangeTypes.ranged,
			range: 20
		},
		projectile: {
			projectile: BulletProjectile,
			effect: BulletProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 350,
			splashRadius: 0
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 6;

	/**
	 * Bullet Mechanics (Burst Fire)
	 */
	maxProjectiles = 2;
	rapidFireDelay = 250;
	projectilesFiredThisRound = 0;
	firingTarget: Creep | null = null;
	isFiring = false;
	firingTimer = 0;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerBullet.assetProperties, TowerBullet.spriteSheetRows, TowerBullet.AnimationAttributes);
		this.stats = new CharacterStats({ ...TowerBullet.stats });
		return this;
	}

	/**
	 * Override Animate to handle burst firing logic
	 * */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		if (this.readyToPerformScan(timeProperties)) {
			const sPosition: PositionService = this.main.s('Position');
			const creepsInRange = sPosition.getCreepsInRadiusFromPosition(position, this.stats.activeStats.attack!.range!);

			// If we have targets
			if (creepsInRange.length > 0) {
				// Grab a random target
				this.firingTarget = creepsInRange[Math.floor(Math.random() * creepsInRange.length)];

				// Start firing
				this.isFiring = true;
				this.firingTimer = 0;
				this.projectilesFiredThisRound = 0;

				// Set to attacking mode
				this.stateMachine.transition(TowerTransitions.attacking);

				// End attacking back to scanning after the main cooldown (duration)
				setTimeout(() => {
					this.stateMachine.transition(TowerTransitions.scanning);
				}, this.stats.activeStats.attack?.duration);
			}
		}

		// Logic for burst fire during Attack phase
		if (this.stateMachine.isInState(TowerStates.attacking) && this.isFiring) {
			this.firingTimer -= (timeProperties.deltaTime * 1000);

			if (this.firingTimer <= 0) {
				if (this.projectilesFiredThisRound < this.maxProjectiles && this.firingTarget) {
					this.fireProjectileAt(this.firingTarget);
					this.projectilesFiredThisRound++;
					this.firingTimer = this.rapidFireDelay;

					// Stop bursting once we hit max
					if (this.projectilesFiredThisRound >= this.maxProjectiles) {
						this.isFiring = false;
						this.firingTarget = null;
					}
				} else {
					this.isFiring = false;
					this.firingTarget = null;
				}
			}
		}

		// Animate Projectiles (which are visually smoke clouds)
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}

	/**
	 * Handles firing a single instant projectile
	 */
	fireProjectileAt(target: Creep) {
		const isAccurate = Math.random() < this.stats.activeStats.attack!.accuracy;

		const activeProjectile = new this.stats.activeStats.projectile!.projectile({
			main: this.main,
			tower: this,
			startingPoint: new THREE.Vector3(this.groupMain.position.x, this.projectileOriginY, this.groupMain.position.z),
			target: target,
			isAccurate: isAccurate,
			hitType: this.stats.activeStats.projectile!.hitType,
			projectileAsset: this.stats.activeStats.projectile!.effect,
			projectileFlightDuration: this.stats.activeStats.projectile!.flightDuration,
		});

		this.projectiles.push(activeProjectile);
	}
}
