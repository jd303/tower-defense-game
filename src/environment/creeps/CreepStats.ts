import { DamageTypeDefences, DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';

export class CreepStats {
	/**
	 * Stats
	 * */
	hp_total: number;
	movement: CreepMovement;
	defenses: DamageTypeDefences;
	hp_current: number;
	kill_rewards: CreepKillAwards;
	vp_loss: number;
	attack_speed: number;
	attack_damage: number;
	attack_damagetype: DamageTypes;

	/**
	 * Constructor
	 * */
	constructor(stats: CreepStatSetup) {
		this.hp_total = stats.hp_total;
		this.hp_current = stats.hp_total;
		this.movement = stats.movement;
		this.defenses = {
			piercing: stats.defenses.piercing,
			crushing: stats.defenses.crushing,
			arcane: stats.defenses.arcane,
			poison: stats.defenses.poison,
			lightning: stats.defenses.lightning,
			fire: stats.defenses.fire,
		};
		this.kill_rewards = stats.kill_rewards;
		this.vp_loss = stats.vp_loss;
		this.attack_speed = stats.attack_speed;
		this.attack_damage = stats.attack_damage;
		this.attack_damagetype = stats.attack_damagetype;

		return this;
	}

	// Commented as unsure this is the direction
	calculateDamage(damage: number, damage_type: DamageTypes) {
		switch (damage_type) {
			case DamageTypes.piercing:
				damage = Math.max(0, damage - this.defenses.piercing);
				break;
			case DamageTypes.crushing:
				damage = Math.max(0, damage - this.defenses.crushing);
				break;
			case DamageTypes.arcane:
				damage = Math.max(0, damage - this.defenses.arcane);
				break;
			case DamageTypes.poison:
				damage = Math.max(0, damage - this.defenses.poison);
				break;
			case DamageTypes.fire:
				damage = Math.max(0, damage - this.defenses.fire);
				break;
		}
		return damage;
	}
}

interface CreepStatSetup {
	hp_total: number;
	movement: CreepMovement;
	defenses: DamageTypeDefences;
	kill_rewards: CreepKillAwards;
	vp_loss: number;
	attack_speed: number;
	attack_damage: number;
	attack_damagetype: DamageTypes;
}

interface CreepKillAwards {
	economic_property: string;
	value: number;
}

interface CreepMovement {
	speed: number;
	type: MovementTypes;
}