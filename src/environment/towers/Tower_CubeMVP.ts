import * as THREE from 'three';
import { Tower, TowerUI } from './Tower';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { UITypes } from '../../UIProperties';
import { Projectile, ProjectileTypes } from '../attacks/Projectile';
import { Creep } from '../creeps/Creep';
import { TowerStates, TowerTransitions } from './TowerStates';

export class TowerCubeMVP extends Tower {
	/**
	 * Tower Assets
	 * */
	assetPath: string = 'assets/models/towers/Tower.Slinger.glb';
	assetScale = 1.5;
	projectileBasis: THREE.Mesh = new THREE.Mesh(new THREE.CircleBufferGeometry(0.2, 8), new THREE.MeshMatcapMaterial({ color: 'red' }));
	projectiles: Projectile[] = [];

	/**
	 * UI Behaviours
	 * */
	static UI: TowerUI = new TowerUI({
		type: UITypes.Tower,
		icon: 'assets/models/towers/Tower.Slinger.UI.icon.png',
		placeCallback: (intersects: THREE.Intersection[], main: Main) => {
			if (intersects[0].object.name == 'LevelPath') return;
			const intersect = intersects[0];
			main.s('Level').currentLevel.addTower(new TowerCubeMVP(main), intersect.point);
		},
	});

	/**
	 * Stats
	 * */
	static baseStats = {
		cost: 150,
		costType: 'money',
		damage: 6,
		range: 10,
		last_attack_time: 0,
		attack_cooldown: 800,
	};

	tempID: number;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main);
		this.loadModel();
		this.stats = { ...TowerCubeMVP.baseStats };
		this.tempID = Math.floor(Math.random() * 5000);
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
				if (distance < this.stats.range) {
					return true;
				}
			});

			// If we have a target
			if (creep) {
				this.stateMachine.transition(TowerTransitions.attacking);
				//if (currentTime - this.stats.attack_cooldown > this.stats.last_attack_time) {
				creep.resolveAttack(this.stats.damage);
				this.stats.last_attack_time = new Date().getTime();
				this.states.attacking.isAttacking = true;
				this.states.attacking.attackStartTime = new Date().getTime();

				const projectile = new Projectile(
					this.main,
					new THREE.Vector3(this.groupMain.position.x, 3.5, this.groupMain.position.z),
					creep,
					ProjectileTypes.homing,
					this.projectileBasis.clone()
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
