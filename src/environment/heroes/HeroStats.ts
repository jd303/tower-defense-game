import { DamageTypeDefences, DamageTypes } from '../../data/DamageTypes';

export class HeroStats {
	/**
	 * Stats
	 * */
	hp_total: number;
	hp_current: number;
	move_speed: number;
	defenses: DamageTypeDefences;

	/**
	 * Constructor
	 * */
	constructor(stats: HeroStatSetup) {
		this.hp_total = stats.hp_total;
		this.hp_current = stats.hp_total;
		this.move_speed = stats.move_speed;
		this.defenses = {
			piercing: stats.defenses.piercing,
			crushing: stats.defenses.crushing,
			arcane: stats.defenses.arcane,
			poison: stats.defenses.poison,
			lightning: stats.defenses.lightning,
			fire: stats.defenses.fire,
		};

		return this;
	}

	// Calculates Damage
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

interface HeroStatSetup {
	hp_total: number;
	move_speed: number;
	defenses: DamageTypeDefences;
}