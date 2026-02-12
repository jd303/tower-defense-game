import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Level } from '../../levels/Level';
import { Power, PowerCommons } from './Power';
import { TickCallback, TickService, TickTimeProperties } from '../../core/TickService';
import { PowerStats } from '../Stats';

export class PowerHeroMotivation extends Power {
	/**
	 * Static properties
	 */
	static powerProperties = {
		assetName: 'PowerHeroMotivation',
		icon: 'assets/powers/heroMotivation/Power.HeroMotivation.UI.icon.png',
		art: '',
	}
	static radiusOfEffect = 4;
	static powerDuration = 10000;
	static heroMotivationBuff = {
		attack: {
			damage: 20,
			accuracy: 1,
		}
	}

	/**
	 * Unique properties for this Power
	 */
	launchTime: number;
	growingMesh: THREE.Mesh;
	shrinkingMesh: THREE.Mesh;

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

		this.growingMesh = PowerCommons.activityCircle(PowerHeroMotivation.radiusOfEffect, 0.25);
		this.growingMesh.position.set(this.position.x, this.position.y + 2, this.position.z);
		this.growingMesh.scale.set(0.7, 0.7, 0.7);

		this.shrinkingMesh = PowerCommons.activityCircle(PowerHeroMotivation.radiusOfEffect, 0.25);
		this.shrinkingMesh.position.set(this.position.x, this.position.y + 2, this.position.z);
		this.shrinkingMesh.scale.set(1.2, 1.2, 1.2);

		PowerCommons.activityCircleMaterial.color = new THREE.Color(0x6F27D8);
		PowerCommons.activityCircleMaterial.transparent = true;
		PowerCommons.activityCircleMaterial.opacity = 0.65;

		// Add them
		this.main.scene.add(this.growingMesh);
		this.main.scene.add(this.shrinkingMesh);

		// Animate them
		const sTick: TickService = this.main.s('Tick');
		const callback = new TickCallback('animateTimeMotivation', this.animate.bind(this));
		sTick.registerCallback(callback);

		setTimeout(() => {
			sTick.deregisterCallback('animateTimeMotivation');
			this.main.scene.remove(this.growingMesh);
			this.main.scene.remove(this.shrinkingMesh);

			PowerCommons.activityCircleMaterial.color = new THREE.Color(0x4298B5);
			PowerCommons.activityCircleMaterial.transparent = false;
			PowerCommons.activityCircleMaterial.opacity = 1;
		}, 3000);

		// Determine which towers were affected
		const heroesAffected = this.level.heroManager.findHeroesInRangeOf(this.position, PowerHeroMotivation.radiusOfEffect);
		heroesAffected.forEach(hero => {
			hero.stats.addModifier('heroMotivationBuff', PowerHeroMotivation.heroMotivationBuff);
			hero.setColourisation({ r: 1 });
		});
		setTimeout(() => {
			heroesAffected.forEach(hero => {
				hero.stats.removeModifier('heroMotivationBuff');
				hero.setColourisation({ r: 0, g: 0 });
			});
		}, PowerHeroMotivation.powerDuration);
	}

	/**
	 * Animates the barrage
	 */
	animate(tickTimeProperties: TickTimeProperties) {
		if (!this.launchTime) this.launchTime = tickTimeProperties.elapsedTime;

		const elapsedTime = tickTimeProperties.elapsedTime - this.launchTime;

		// CONFIGURATION
		const duration = 3.5;       // Total time for the effect
		const frequency = 2.5;       // How fast it wobbles
		const decayConstant = 2.0;  // How fast the wobbling dies down
		const initialOffset = 0.15;  // Difference from 1.0 (1.3 and 0.7)

		// 1. Normalized progress (0 to 1)
		const t = Math.min(1, elapsedTime / duration);

		if (t < 1) {
			const damping = Math.exp(-decayConstant * t) * (1 - t);
			const wave = Math.sin(elapsedTime * frequency);
			const currentOffset = initialOffset * damping * wave;
			const sScale = 1 + currentOffset;
			this.shrinkingMesh.scale.set(sScale, sScale, sScale);
			const gScale = 1 - currentOffset;
			this.growingMesh.scale.set(gScale, gScale, gScale);
		}
	}
}