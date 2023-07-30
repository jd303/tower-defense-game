import * as THREE from 'three';
import { Tower, TowerFactory } from './Tower';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { UIRegions } from '../../game/UIProperties';
import { Projectile, ProjectileHitTypes, ProjectileTypes } from '../attacks/Projectile';
import { Creep } from '../creeps/Creep';
import { TowerStates, TowerTransitions } from './TowerStates';
import { DamageTypes } from '../../data/DamageTypes';
import { MagicBolt } from '../effects/MagicBolt';

export class TowerMage extends Tower {
	/**
	 * Tower Assets
	 * */
	assetPath: string = 'assets/models/towers/Tower.Mage.glb';
	assetScale = 1.5;

	/**
	 * Factory
	 * */
	static Factory: TowerFactory = new TowerFactory(
		UIRegions.Tower,
		'assets/models/towers/Tower.Mage.UI.icon.png',
		150,
		'money',
		TowerMage,
		() => {}
	);

	/**
	 * Stats
	 * */
	static stats = {
		attack: {
			damage: 6,
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
		super(main);
		this.loadModel();
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
			const creep = this.main.s('Level').currentLevel.creeps.find((creep: Creep) => {
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
					new THREE.Vector3(this.groupMain.position.x, 3.5, this.groupMain.position.z),
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
