import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Level } from '../../levels/Level';
import { Power, PowerCommons } from './Power';
import { TickCallback, TickService, TickTimeProperties } from '../../core/TickService';
import { PowerStats } from '../Stats';

export class PowerTowerMotivation extends Power {
	/**
	 * Static properties
	 */
	static powerProperties = {
		assetName: 'PowerTowerMotivation',
		icon: 'assets/powers/towerMotivation/Power.TowerMotivation.UI.icon.png',
		art: ''
	}
	static radiusOfEffect = 10;
	static powerDuration = 7500;
	static towerMotivationBuff = {
		attack: {
			damage: 10,
			accuracy: 1,
			range: 5
		}
	}

	/**
	 * Unique properties for this Power
	 */
	launchTime: number;
	mesh1: THREE.Mesh;
	mesh2: THREE.Mesh;

	/**
	 * Stats
	 */
	static stats = new PowerStats({
		cost: 20
	})

	/**
	 * Constructor
	 * */
	constructor(main: Main, level: Level, position: THREE.Vector3) {
		super(main, level, position);

		this.createTimeDistortion();
	}

	/**
	 * Creates the catapult barrage
	 */
	async createTimeDistortion() {
		console.log("We lob some encouragement at towers");

		this.mesh1 = PowerCommons.activityCircle(PowerTowerMotivation.radiusOfEffect, 0.25);
		this.mesh1.position.set(this.position.x, this.position.y + 2, this.position.z);
		this.mesh1.scale.set(0.7, 0.7, 0.7);

		this.mesh2 = PowerCommons.activityCircle(PowerTowerMotivation.radiusOfEffect, 0.25);
		this.mesh2.position.set(this.position.x, this.position.y + 2, this.position.z);
		this.mesh2.scale.set(1.2, 1.2, 1.2);

		PowerCommons.activityCircleMaterial.color = new THREE.Color(0x6F27D8);
		PowerCommons.activityCircleMaterial.transparent = true;

		// Add them
		this.main.scene.add(this.mesh1);
		this.main.scene.add(this.mesh2);

		// Animate them
		const sTick: TickService = this.main.s('Tick');
		const callback = new TickCallback('animateTimeMotivation', this.animate.bind(this));
		sTick.registerCallback(callback);

		setTimeout(() => {
			sTick.deregisterCallback('animateTimeMotivation');
			this.main.scene.remove(this.mesh1);
			this.main.scene.remove(this.mesh2);

			PowerCommons.activityCircleMaterial.color = new THREE.Color(0x4298B5);
			PowerCommons.activityCircleMaterial.transparent = false;
			PowerCommons.activityCircleMaterial.opacity = 1;
		}, 1500);

		// Add a buff to the towers
		const towersAffected = this.level.towerManager.findTowersInRangeOf(this.position, PowerTowerMotivation.radiusOfEffect);
		towersAffected.forEach(tower => {
			tower.stats.addModifier('towerMotivationBuff', PowerTowerMotivation.towerMotivationBuff);
			tower.setColourisation({ g: 1 });
		});
		setTimeout(() => {
			towersAffected.forEach(tower => {
				tower.stats.removeModifier('towerMotivationBuff');
				tower.setColourisation({});
			});
		}, PowerTowerMotivation.powerDuration);
	}

	/**
	 * Animates the barrage
	 */
	animate(tickTimeProperties: TickTimeProperties) {
		if (!this.launchTime) this.launchTime = tickTimeProperties.elapsedTime;

		const elapsedTime = tickTimeProperties.elapsedTime - this.launchTime;

		const sScale = Math.min(1.5, 0 + elapsedTime);
		this.mesh1.scale.set(sScale, sScale, sScale);
		this.mesh2.scale.set(sScale - 0.1, sScale - 0.1, sScale - 0.1);

		PowerCommons.activityCircleMaterial.opacity = 1 - (elapsedTime * 0.75);
	}
}