import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Creep } from './Creep';
import { CreepStates, CreepTransitions } from './CreepStates';
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
		move_speed: 3,
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
			value: 15
		},
		vp_loss: 1
	});
	healthBarY: 1;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.loadModel();
		this.modifyStateMachine();
		this.stateMachine.transition('moving');

		return this;
	}

	/**
	 * Adds unique state items for the Wisp
	 * */
	modifyStateMachine() {
		// Wisps stop to use their ability
		this.stateMachine.modifyState(CreepStates.moving, {
			name: CreepStates.moving,
			autoTransition: CreepTransitions.activating_standing_power,
			autoTransitionTimeMS: 5000,
		});

		// Wisps then activate and move on
		this.stateMachine.modifyState(CreepStates.activatingStandingPower, {
			name: CreepStates.activatingStandingPower,
			autoTransition: CreepTransitions.moving,
			autoTransitionTimeMS: 1750,
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

		const combinedHealthPercentage =
			creepsThatArentMe.reduce((percentage: number, creep: Creep) => percentage + (creep.stats.hp_current / creep.stats.hp_total) * 100, 0);
		const averageHealthPercentage = combinedHealthPercentage / creepsThatArentMe.length;

		creepsThatArentMe.forEach((creep: Creep) => {
			creep.stateMachine.transition(CreepTransitions.healed);
			//creep.adjustHealthByNumber(20);
			creep.setHealthByPercentage(averageHealthPercentage);
		});
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) {}
}
