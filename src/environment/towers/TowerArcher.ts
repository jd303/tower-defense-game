import * as THREE from 'three';
import { Tower, TowerUI } from './Tower';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { UITypes } from '../../game/UIProperties';
import { Projectile, ProjectileHitTypes, ProjectileTypes } from '../attacks/Projectile';
import { Creep } from '../creeps/Creep';
import { TowerStates, TowerTransitions } from './TowerStates';
import { DamageTypes } from '../../data/DamageTypes';
import { ArrowShot } from '../effects/ArrowShot';

export class TowerArcher extends Tower {
	/**
	 * Tower Assets
	 * */
	assetPath: string = 'assets/models/towers/Tower.Slinger.glb';
	assetScale = 1.5;
	projectileBasis: THREE.Mesh = new THREE.Mesh(new THREE.CircleGeometry(0.2, 8), new THREE.MeshMatcapMaterial({ color: 'red' }));

	/**
	 * UI Behaviours
	 * */
	static UI: TowerUI = new TowerUI({
		type: UITypes.Tower,
		icon: 'assets/models/towers/Tower.Archer.UI.icon.png',
		placeCallback: (intersects: THREE.Intersection[], main: Main) => {
			if (intersects[0].object.name == 'LevelPath') return;
			const intersect = intersects[0];
			main.s('Level').currentLevel.addTower(new TowerArcher(main), intersect.point);
		},
	});

	/**
	 * Stats
	 * */
	static baseStats = {
		cost: 100,
		costType: 'money',
		attack: {
			damage: 6,
			damageType: DamageTypes.piercing,
			type: ProjectileTypes.arc,
			hitType: ProjectileHitTypes.direct,
			range: 12,
			speed: 1.5,
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
		this.stats = { ...TowerArcher.baseStats };
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
				//if (currentTime - this.stats.attack_cooldown > this.stats.last_attack_time) {
				//this.stats.last_attack_time = new Date().getTime();
				//this.states.attacking.isAttacking = true;
				//this.states.attacking.attackStartTime = new Date().getTime();

				const projectile = new Projectile(
					this.main,
					this,
					new THREE.Vector3(this.groupMain.position.x, 3.5, this.groupMain.position.z),
					creep,
					this.stats.attack.type,
					this.stats.attack.hitType,
					new ArrowShot(this.main),
					this.stats.attack.speed
				);

				this.projectiles.push(projectile);
				//}
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
