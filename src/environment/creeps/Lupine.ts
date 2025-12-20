import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';

export class Lupine extends Creep {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/creeps/creep_lupine.glb';
	assetScale: number = 0.25;
	shadowsEnabled = true;

	/**
	 * Stats
	 * */
	stats = new CreepStats({
		hp_total: 25,
		movement: {
			speed: 4,
			interception_modifier: 2,
			type: MovementTypes.walking,
		},
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
			value: 5
		},
		vp_loss: 1,
		attack_speed: 15,
		attack_damage: 10,
		attack_damagetype: DamageTypes.crushing
	});
	healthBarY: 3;

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
	animate(timeProperties: TickTimeProperties) { }
}
