import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
//import { DamageTypes } from '../../data/DamageTypes';
import { Hero } from './Hero';
import { HeroStats } from './HeroStats';

export class Man0 extends Hero {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/heroes/Man0.v2.glb';
	assetScale: number = 0.25;
	shadowsEnabled = true;
	interactive = true;

	/**
	 * Stats
	 * */
	stats = new HeroStats({
		name: "Man0",
		hp_total: 40,
		move_speed: 3.5,
		damage: 10,
		damageType: DamageTypes.piercing,
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: -10,
		},
		interceptDistance: 5,
		numberIntercepted: 2
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
