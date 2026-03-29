import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { TickTimeProperties } from '../../core/TickService';
import * as THREE from 'three';
import { TowerStates, TowerTransitions } from './TowerStates';
import { VolcanicProjectileEffect } from '../projectiles/effects/Volcanic.Projectile.Effect';
import { VolcanicProjectile } from '../projectiles/Volcanic.Projectile';
import { Creep } from '../creeps/Creep';
import { PositionService } from '../PositionService';

export class TowerVolcanic extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerVolcanic',
		assetPath: 'assets/towers/volcanic/spritesheet.tower.volcanic.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/volcanic/ui.icon.tower.volcanic.png',
		art: ''
	}
	static cost = 200;
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
			duration: 2000,
			accuracy: 0.25,
			damage: 1,
			damageType: DamageTypes.fire,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			projectile: VolcanicProjectile,
			effect: VolcanicProjectileEffect,
			hitType: ProjectileHitTypes.splash,
			flightDuration: 25,
			splashRadius: 1.5
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 7;

	/**
	 * Volcanic Mechanics
	 */
	maxProjectiles = 3;
	rapidFireDelay = 150;
	projectilesFiredThisRound = 0;
	spewingTargets: Creep[] = [];
	isSpewing = false;
	spewTimer = 0;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerVolcanic.assetProperties, TowerVolcanic.spriteSheetRows, TowerVolcanic.AnimationAttributes);
		this.stats = new CharacterStats({ ...TowerVolcanic.stats });
		return this;
	}

	/**
	 * Override Animate to handle spewing logic
	 * */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		// Find targets
		if (this.readyToPerformScan(timeProperties)) {
			const sPosition: PositionService = this.main.s('Position');
			this.spewingTargets = sPosition.getCreepsInRadiusFromPosition(position, this.stats.activeStats.attack!.range!);

			// If we have targets
			if (this.spewingTargets.length > 0) {
				this.isSpewing = true;
				this.spewTimer = 0;
				this.projectilesFiredThisRound = 0;
				this.stateMachine.transition(TowerTransitions.attacking);

				setTimeout(() => {
					this.stateMachine.transition(TowerTransitions.scanning);
				}, this.stats.activeStats.attack?.duration);
			}
		}

		// Logic for spewing during Attack phase
		if (this.stateMachine.isInState(TowerStates.attacking) && this.isSpewing) {
			this.spewTimer -= (timeProperties.deltaTime * 1000);

			if (this.spewTimer <= 0) {
				if (this.projectilesFiredThisRound < this.maxProjectiles && this.spewingTargets.length) {
					const spewingTarget = this.spewingTargets[Math.floor(Math.random() * this.spewingTargets.length)];
					this.fireProjectileAt(spewingTarget);
					this.projectilesFiredThisRound++;
					this.spewTimer = this.rapidFireDelay;

					// Stop spewing once we hit max
					if (this.projectilesFiredThisRound >= this.maxProjectiles) {
						this.isSpewing = false;
					}
				} else {
					this.isSpewing = false;
				}
			}
		}

		// Animate Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}

	/**
	 * Handles firing a single projectile
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
