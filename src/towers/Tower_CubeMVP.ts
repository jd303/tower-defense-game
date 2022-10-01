import * as THREE from 'three';
import { Tower } from './Tower';
import { Main } from '../core/Main';
import { TickTimeProperties } from '../core/Tick';
import { UIProperties, UITypes } from '../UIProperties';

export class TowerCubeMVP extends Tower {
	/**
	 * Tower Assets
	 * */
	assetPath: string = 'assets/models/towers/Tower.Slinger.glb';
	UI: UIProperties = {
		type: UITypes.Tower,
		icon: 'assets/models/towers/Tower.Slinger.UI.icon.png',
		clickCallback: this.placeTower,
	};

	/**
	 * Stats
	 * */
	damage = 20;
	range = 6;
	last_attack_time = 0;
	attack_cooldown = 1000;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main);
		this.loadModel();
		return this;
	}

	/**
	 * Animates
	 */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;
		this.main.level.creeps.forEach((creep) => {
			const creepPosition = creep.groupMain.position;
			const distance = creepPosition.distanceTo(position);

			// If something is in range
			if (distance < this.range) {
				const currentTime = new Date().getTime();

				// If this thing can attack
				if (currentTime - this.attack_cooldown > this.last_attack_time) {
					creep.resolveAttack(this.damage);
					this.last_attack_time = new Date().getTime();
					this.states.attacking.isAttacking = true;
					this.states.attacking.attackStartTime = new Date().getTime();
				}
			}
		});

		if (this.states.attacking.isAttacking) {
			if (this.states.attacking.attackStartTime + this.states.attacking.attackDuration < new Date().getTime()) {
				this.states.attacking.isAttacking = false;
				this.groupModel.position.z = 0;
			} else {
				this.groupModel.position.z = Math.sin(timeProperties.elapsedTime * 50) / 20;
			}
		}
	}
}

export class TowerCubeMVPUI {
	static properties: UIProperties = {
		type: UITypes.Tower,
		icon: 'assets/models/towers/Tower.Slinger.UI.icon.png',
		clickCallback: TowerCubeMVPUI.placeTower,
	};

	static placeTower(intersects: THREE.Intersection[], main: Main) {
		console.log('PLACE', intersects, main);
		console.log('CHeck that the intersect is correct');
		const intersect = intersects[0];
		main.level.addTower(new TowerCubeMVP(main), intersect.point);
	}
}
