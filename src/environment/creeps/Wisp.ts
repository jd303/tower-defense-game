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
		move_speed: 4,
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

		// Wisps then activate and move on
		this.stateMachine.modifyState(CreepStates.activatingStandingPower, {
			name: CreepStates.activatingStandingPower,
			autoStateChange: 'moving',
			autoStateChangeTimeMS: 1750,
			onEnter: this.activateStandingPower.bind(this),
		});
	}

	/**
	 * WISP POWER: Normalise health amongst nearby creeps
	 * */
	activateStandingPower(): void {
		console.log('%c WISP: Life Scales', 'color: purple');

		const creepsAroundMe = this.main.s('PositionService').findCreepsByLocation(this.groupMain.position, 15);
		const creepsThatArentMe = creepsAroundMe.filter((creep: Creep) => creep !== this);

		const averageHealthPercentage =
			creepsThatArentMe.reduce(
				(percentage: number, creep: Creep) => percentage + ((creep.stats.hp_total - creep.stats.damage_taken) / creep.stats.hp_total) * 100,
				0
			) / creepsThatArentMe.length;

		console.log('AVERAGE HEALTH IS', averageHealthPercentage);

		creepsThatArentMe.forEach((creep: Creep) => creep.setHealthByPercentage(averageHealthPercentage));
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) {}
}
