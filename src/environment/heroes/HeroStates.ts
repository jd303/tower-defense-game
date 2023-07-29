export enum HeroStates {
	any = 'any',
	idle = 'idle',
	moving = 'moving',
	hurting = 'hurting', // Has recently been hurt
	hurt = 'hurt', // Has been hurt ever
	healing = "healing",
	activatingStandingPower = 'activatingStandingPower',
	activatingMovingPower = 'activatingStandingPower',
	disabled = 'disabled'
}

export enum HeroTransitions {
	pause = "pause",
	unpause = "unpause",
	moving = "moving",
	stop = "stop",
	took_damage = "took_damage",
	activating_standing_power = "activating_standing_power",
	healed = "healed",
	full_heal = "full_heal",
	became_disabled = "became_disabled",
	revived = "revived"
}
