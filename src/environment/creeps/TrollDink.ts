import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';

export class TrollDink extends Creep {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/creeps/creep_troll.glb';
	assetScale: number = 0.25;
	shadowsEnabled = true;

	/**
	 * Stats
	 * */
	stats = new CreepStats({
		hp_total: 30,
		movement: {
			speed: 2,
			type: MovementTypes.walking,
		},
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: -10,
		},
		kill_rewards: {
			economic_property: "money",
			value: 5
		},
		vp_loss: 1,
		attack_speed: 10,
		attack_damage: 10,
		attack_damagetype: DamageTypes.piercing
	});
	healthBarY: 1.5;

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
