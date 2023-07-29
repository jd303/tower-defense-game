import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
//import { DamageTypes } from '../../data/DamageTypes';
import { Hero } from './Hero';
import { HeroStats } from './HeroStats';

export class Man0 extends Hero {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/heroes/Man0.glb';
	assetScale: number = 0.5;
	shadowsEnabled = true;

	/**
	 * Stats
	 * */
	stats = new HeroStats({
		hp_total: 40,
		move_speed: 2,
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: -10,
		},
		/*attack_speed: 10,
		attack_damage: 10,
		attack_damagetype: DamageTypes.crushing*/
	});
	healthBarY: 2;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.loadModel();

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) {}
}
