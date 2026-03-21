import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { Projectile, ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { FlameProjectileEffect } from '../projectiles/effects/Flame.Projectile.Effect';
import { FlameProjectile } from '../projectiles/Flame.Projectile';
import { TickTimeProperties } from '../../core/TickService';
import * as THREE from 'three';
import { TowerStates, TowerTransitions } from './TowerStates';
import { PositionService } from '../PositionService';
import { Creep } from '../creeps/Creep';

export class TowerFlame extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerFlame',
		assetPath: 'assets/towers/flame/spritesheet.tower.flame.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/flame/ui.icon.tower.flame.png',
		art: ''
	}
	static cost = 275;
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
			duration: 3000,
			accuracy: 1.0,
			damage: 0.01,
			damageType: DamageTypes.fire,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			projectile: FlameProjectile,
			effect: FlameProjectileEffect,
			hitType: ProjectileHitTypes.splash,
			flightDuration: 0,
			splashRadius: 5 // Cone width at base
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 1.0;

	// Flame Tower State properties
	target: Creep | null = null;
	activeFlameProjectile: FlameProjectile | null = null;
	attackTimer: number = 0;
	towerCooldownProgress = 0;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerFlame.assetProperties, TowerFlame.spriteSheetRows, TowerFlame.AnimationAttributes);
		this.stats = new CharacterStats({ ...TowerFlame.stats });
		return this;
	}

	/**
	 * Custom transition handler
	 */
	transitionToAttacking() {
		this.stateMachine.transition(TowerTransitions.attacking);
		this.attackTimer = 0;
		if (this.target) {
			this.activeFlameProjectile = new this.stats.activeStats.projectile!.projectile({
				main: this.main,
				tower: this,
				startingPoint: this.groupMain.position.clone().add(new THREE.Vector3(0, this.projectileOriginY, 0)),
				target: this.target,
				isAccurate: true,
				hitType: this.stats.activeStats.projectile!.hitType,
				projectileAsset: this.stats.activeStats.projectile!.effect,
				projectileFlightDuration: 0,
			}) as FlameProjectile;

			this.projectiles.push(this.activeFlameProjectile);
		}
	}

	transitionToScanningAndCooldown() {
		if (this.activeFlameProjectile) {
			this.disposeProjectile(this.activeFlameProjectile);
			this.activeFlameProjectile = null;
		}
		this.target = null;

		// Wait for cooldown manually if needed, or transition to scanning
		this.stateMachine.transition(TowerTransitions.scanning);
	}

	/**
	 * Returns true if a point is within the Flame Cone
	 */
	isPointInCone(point: THREE.Vector3, origin: THREE.Vector3, direction: THREE.Vector3, length: number, radius: number): boolean {
		const vecToPoint = new THREE.Vector3().subVectors(point, origin);
		const dotProd = vecToPoint.dot(direction);

		// Out of length bounds
		if (dotProd < 0 || dotProd > length) return false;

		// Calculate perpendicular distance to center axis
		const orthDistance = Math.sqrt(vecToPoint.lengthSq() - dotProd * dotProd);

		// Cone radius at this distance
		const maxRadius = (dotProd / length) * radius;

		return orthDistance <= maxRadius;
	}

	/**
	 * Override Animate to handle Continuous fire
	 * */
	animate(timeProperties: TickTimeProperties) {
		if (this.stateMachine.isInState(TowerStates.scanning)) {
			// Find a target
			const sPositioning: PositionService = this.main.s('Position');
			const creepsInRange = sPositioning.getCreepsInRadiusFromPosition(this.groupMain.position, this.stats.activeStats.attack!.range!);

			if (creepsInRange.length > 0) {
				this.target = creepsInRange[0];
				this.transitionToAttacking();
			}
		}

		if (this.stateMachine.isInState(TowerStates.attacking)) {
			this.attackTimer += timeProperties.deltaTime * 1000;

			if (this.attackTimer >= this.stats.activeStats.attack!.duration!) {
				// Finish attack
				this.transitionToScanningAndCooldown();
			} else if (this.activeFlameProjectile && this.target) {
				// We are flaming

				// 1. Face the target (or last known dir if target died)
				if (this.target.stats.activeStats.life!.current <= 0) {
					// Target died mid-flame... standard behavior is to keep flaming in that direction or pick a new target? Let's just keep flaming current direction
					// but not update target pos.
				} else {
					// Optional: tower looks at target (could just be projectile)
				}

				// 2. Resolve hits in the cone
				const origin = this.activeFlameProjectile.startingPoint.clone();

				// Calculate direction vector by getting the direction the projectile group is facing
				const direction = new THREE.Vector3(0, 0, 1);
				direction.applyQuaternion(this.activeFlameProjectile.projectileGroup.quaternion);

				const sPositioning: PositionService = this.main.s('Position');
				const creepsInRange = sPositioning.getCreepsInRadiusFromPosition(this.groupMain.position, this.stats.activeStats.attack!.range!);

				creepsInRange.forEach((creep: any) => {
					if (this.isPointInCone(creep.groupMain.position, origin, direction, this.stats.activeStats.attack!.range!, this.stats.activeStats.projectile!.splashRadius)) {
						creep.resolveAttack(this.stats.activeStats.attack!);
						// Could add a small cooldown map per creep if we want to tick damage slower than framerate
					}
				});
			} else {
				// Failsafe if state got weird
				this.transitionToScanningAndCooldown();
			}
		}

		// Animate Projectiles (handles orientation of flame)
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}
}
