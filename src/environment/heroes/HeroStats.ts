import { DamageTypeDefences, DamageTypes } from '../../data/DamageTypes';

export class HeroStats {
	/**
	 * Stats
	 * */
	heroName: string;
	hp_total: number;
	hp_current: number;
	move_speed: number;
	attack: HeroAttackStats;
	defenses: DamageTypeDefences;
	interceptDistance: number;
	numberIntercepted: number;

	/**
	 * Constructor
	 * */
	constructor(stats: HeroStatSetup) {
		this.heroName = stats.name;
		this.hp_total = stats.hp_total;
		this.hp_current = stats.hp_total;
		this.move_speed = stats.move_speed;
		this.attack = {
			damage: stats.damage,
			damageType: stats.damageType
		}
		this.defenses = {
			piercing: stats.defenses.piercing,
			crushing: stats.defenses.crushing,
			arcane: stats.defenses.arcane,
			poison: stats.defenses.poison,
			lightning: stats.defenses.lightning,
			fire: stats.defenses.fire,
		};
		this.interceptDistance = stats.interceptDistance;
		this.numberIntercepted = stats.numberIntercepted;

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

export interface HeroAttackStats {
	damage: number;
	damageType: DamageTypes,
}

interface HeroStatSetup {
	name: string;
	hp_total: number;
	move_speed: number;
	damage: number;
	damageType: DamageTypes;
	defenses: DamageTypeDefences;
	interceptDistance: number;
	numberIntercepted: number;
}