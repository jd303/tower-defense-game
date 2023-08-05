export enum HeroStates {
	any = 'any',
	idle = 'idle',
	moving = 'moving',
	hurting = 'hurting', // Has recently been hurt
	hurt = 'hurt', // Has been hurt ever
	healing = "healing",
	activatingStandingPower = 'activatingStandingPower',
	activatingMovingPower = 'activatingStandingPower',
	disabled = 'disabled',
	attacking = 'attacking'
}

export enum HeroTransitions {
	moving = "moving",
	stop = "stop",
	took_damage = "took_damage",
	activating_standing_power = "activating_standing_power",
	healed = "healed",
	full_heal = "full_heal",
	became_disabled = "became_disabled",
	revived = "revived",
	attacking = "attacking",
}
