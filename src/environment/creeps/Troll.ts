import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';

export class Troll extends Creep {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/creeps/creep_troll.glb';
	assetScale: number = 0.5;

	/**
	 * Stats
	 * */
	stats = new CreepStats({
		hp_total: 40,
		move_speed: 2,
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: 0,
		},
		kill_rewards: {
			economic_property: "money",
			value: 10
		},
		vp_loss: 2
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
