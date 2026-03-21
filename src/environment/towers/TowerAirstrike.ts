import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { AirstrikeProjectileEffect } from '../projectiles/effects/Airstrike.Projectile.Effect';
import { AirstrikeProjectile } from '../projectiles/Airstrike.Projectile';
import { TickTimeProperties } from '../../core/TickService';
import * as THREE from 'three';
import { TowerStates, TowerTransitions } from './TowerStates';

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
			flightDuration: 4000,
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

	/**
	 * Override Animate to handle Randomized targeting
	 * */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		if (this.stateMachine.isInState(TowerStates.scanning)) {
			const creepsInRange = this.main.s('Level').currentLevel.creepManager.findCreepsInRangeOf(position, this.stats.activeStats.attack!.range!);

			// If we have targets
			if (creepsInRange.length) {
				const isAccurate = Math.random() < this.stats.activeStats.attack!.accuracy;

				// Grab a random target
				const target = creepsInRange[Math.floor(Math.random() * creepsInRange.length)];

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

				// Set to attacking mode, and reset to scanning
				this.stateMachine.transition(TowerTransitions.attacking);
				setTimeout(() => {
					this.stateMachine.transition(TowerTransitions.scanning);
				}, this.stats.activeStats.attack?.duration);
			}
		}

		// Animate Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}
}
