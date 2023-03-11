import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from './Creep';
import { CreepStates } from './CreepStates';
import { CreepStats } from './CreepStats';

export class Wisp extends Creep {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/creeps/creep_wisp.glb';
	assetScale: number = 0.5;

	/**
	 * Stats
	 * */
	stats = new CreepStats({
		hp_total: 10,
		move_speed: 5,
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: 0,
		},
	});
	healthBarY: 1;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.loadModel();
		this.modifyStateMachine();
		this.stateMachine.trigger('moving');

		return this;
	}

	/**
	 * Adds unique state items for the Wisp
	 * */
	modifyStateMachine() {
		// Wisps stop to use their ability
		this.stateMachine.modifyState(CreepStates.moving, {
			name: CreepStates.moving,
			autoStateChange: 'activatingStandingPower',
			autoStateChangeTimeMS: 5000,
		});
		this.stateMachine.modifyState(CreepStates.activatingStandingPower, {
			name: CreepStates.activatingStandingPower,
			autoStateChange: 'moving',
			autoStateChangeTimeMS: 1500,
		});
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) {}
}
