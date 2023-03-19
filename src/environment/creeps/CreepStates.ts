export enum CreepStates {
	any = 'any',
	idle = 'idle',
	moving = 'moving',
	hurting = 'hurting', // Has recently been hurt
	hurt = 'hurt', // Has been hurt ever
	healing = "healing",
	activatingStandingPower = 'activatingStandingPower',
	activatingMovingPower = 'activatingStandingPower',
}

export enum CreepTransitions {
	pause = "pause",
	unpause = "unpause",
	moving = "moving",
	stop = "stop",
	took_damage = "took_damage",
	activating_standing_power = "activating_standing_power",
	healed = "healed",
	full_heal = "full_heal",
}

export enum CreepStateTriggers {}
