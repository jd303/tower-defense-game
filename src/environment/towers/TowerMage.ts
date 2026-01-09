import * as THREE from 'three';
import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileHitTypes, ProjectileTypes } from '../attacks/Projectile';
import { Creep } from '../creeps/Creep';
import { TowerStates, TowerTransitions } from './TowerStates';
import { DamageTypes } from '../../data/DamageTypes';
import { MagicBolt } from '../effects/MagicBolt';
import { SpriteSheetRow } from '../assets/SpriteAsset';

export class TowerMage extends Tower {
	/**
	 * Tower Assets
	 * */
	assetScale = 2.2;

	/**
	 * Static details
	 */
	static assetName = "TowerMage";
	static assetPath = 'assets/spritesheets/towers/spritesheet-tower-mage.png';
	static assetScale: number = 1;
	static assetPositionY = 3;
	static buttonIcon = 'assets/models/towers/Tower.Mage.UI.icon.png';
	static cost = 150;
	static costType = 'money';
	static towerZoneWidth = 1;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 },
			uSize: { value: 8 }
		},
		alphaTest: 0.5,
		transparent: true
	}
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "idle",
			totalFrames: 1,
			currentFrame: 0,
		}
	]
	static spriteSheetCellColCount: number = 1;

	/**
	 * Stats
	 * */
	static stats = {
		attack: {
			damage: 7,
			damageType: DamageTypes.poison,
			type: ProjectileTypes.homing,
			hitType: ProjectileHitTypes.direct,
			range: 10,
			speed: 0.5,
			radius: 0
		},
		last_attack_time: 0,
		attack_cooldown: 50, // not used, uses state system instead
	};

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerMage.assetName, TowerMage.assetPositionY, TowerMage.spriteSheetRows, TowerMage.spriteSheetCellColCount, TowerMage.assetScale);

		this.stats = { ...TowerMage.stats };

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}

	/**
	 * Animates
	 */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		if (this.stateMachine.isInState(TowerStates.scanning)) {
			const creep = this.main.s('Level').currentLevel.creepManager.creeps.find((creep: Creep) => {
				const creepPosition = creep.groupMain.position;
				const distance = creepPosition.distanceTo(position);

				// If something is in range
				if (distance < this.stats.attack.range) {
					return true;
				}
			});

			// If we have a target
			if (creep) {
				this.stateMachine.transition(TowerTransitions.attacking);

				const projectile = new Projectile(
					this.main,
					this,
					new THREE.Vector3(this.groupMain.position.x, 6, this.groupMain.position.z),
					creep,
					this.stats.attack.type,
					this.stats.attack.hitType,
					new MagicBolt(this.main),
					this.stats.attack.speed
				);

				this.projectiles.push(projectile);
			}
		}

		if (this.stateMachine.isInState(TowerStates.attacking)) {
			if (this.states.attacking.attackStartTime + this.states.attacking.attackDuration < new Date().getTime()) {
				this.states.attacking.isAttacking = false;
				this.groupModel.position.z = 0;
			} else {
				this.groupModel.position.z = Math.sin(timeProperties.elapsedTime * 50) / 10;
			}
		}

		// Animate Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}
}
