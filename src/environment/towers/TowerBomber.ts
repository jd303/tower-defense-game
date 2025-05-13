import * as THREE from 'three';
import { Tower, TowerFactory } from './Tower';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { UIRegions } from '../../game/UIProperties';
import { Projectile, ProjectileHitTypes, ProjectileTypes } from '../attacks/Projectile';
import { Creep } from '../creeps/Creep';
import { TowerStates, TowerTransitions } from './TowerStates';
import { DamageTypes } from '../../data/DamageTypes';
import { ParticleExperienceExplosionActive, ParticleExperienceExplosionPassive } from '../../environment/particles/Explosion';
import { BombShot } from '../effects/BombShot';
import { ModelAsset } from '../ModelAsset';
import { MovementTypes } from '../../data/MovementTypes';

export class TowerBomber extends Tower {
	/**
	 * Tower Assets
	 * */
	assetPath: string = 'assets/models/towers/Tower.Bomber.glb';
	assetScale = 1.5;
	projectileBasis: THREE.Mesh = new THREE.Mesh(new THREE.CircleGeometry(0.2, 8), new THREE.MeshBasicMaterial({ color: 'red' }));

	/**
	 * Stats
	 * */
	static stats = {
		attack: {
			damage: 2,
			damageType: DamageTypes.crushing,
			type: ProjectileTypes.arc,
			hitType: ProjectileHitTypes.splash,
			range: 10,
			radius: 3,
			speed: 0.75
		},
		last_attack_time: 0,
		attack_cooldown: 50, // not used, uses state system instead
	};

	/**
	 * Factory
	 * */
	static Factory: TowerFactory = new TowerFactory(
		UIRegions.Tower,
		'assets/models/towers/Tower.Bomber.UI.icon.png',
		175,
		"money",
		TowerBomber,
		() => { }
	);

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main);
		this.loadModel();
		this.stats = { ...TowerBomber.stats };
		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}

	/**
	 * Animates
	 */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		if (this.stateMachine.isInState(TowerStates.scanning)) {
			const omissionCallback = (interceptee: Creep) => interceptee.stats.movement.type == MovementTypes.flying;
			const creeps = this.sLocation.findTargetsInRange({ potentialTargets: this.main.s('Level').currentLevel.creeps, fromPoint: position, range: this.stats.attack.range, omissionCallback: omissionCallback });
			const creep: ModelAsset | null = creeps.length ? creeps[0] : null;

			// If we have a target
			if (creep) {
				this.stateMachine.transition(TowerTransitions.attacking);
				//if (currentTime - this.stats.attack_cooldown > this.stats.last_attack_time) {
				//this.stats.last_attack_time = new Date().getTime();
				//this.states.attacking.isAttacking = true;
				//this.states.attacking.attackStartTime = new Date().getTime();

				const projectile = new Projectile(
					this.main,
					this,
					new THREE.Vector3(this.groupMain.position.x, 3.5, this.groupMain.position.z),
					creep as Creep,
					this.stats.attack.type,
					this.stats.attack.hitType,
					new BombShot(this.main),
					this.stats.attack.speed,
					() => {
						new ParticleExperienceExplosionActive(this.main, new THREE.Vector3(creep.groupMain.position.x, 0, creep.groupMain.position.z));
						new ParticleExperienceExplosionPassive(this.main, new THREE.Vector3(creep.groupMain.position.x, 0, creep.groupMain.position.z));
					}
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
