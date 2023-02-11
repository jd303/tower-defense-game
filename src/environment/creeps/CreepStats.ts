import { DamageTypes } from '../../data/DamageTypes';

export class CreepStats {
	/**
	 * Stats
	 * */
	hp_total: number;
	move_speed: number;
	defenses: DamageTypes;
	damage_taken = 0;

	/**
	 * Constructor
	 * */
	constructor(stats: CreepStatSetup) {
		this.hp_total = stats.hp_total;
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

	// Commented as unsure this is the direction
	/*takeDamage(damage: number, damage_type: string) {
		switch (damage_type) {
			case 'piercing':
				damage = Math.max(0, damage - this.defenses.piercing);
				break;
			case 'crushing':
				damage = Math.max(0, damage - this.defenses.crushing);
				break;
			case 'arcane':
				damage = Math.max(0, damage - this.defenses.arcane);
				break;
			case 'poison':
				damage = Math.max(0, damage - this.defenses.poison);
				break;
		}
		this.damage_taken -= damage;

		if (this.damage_taken >= this.hp_total) {
			console.log('DIE');
		}
	}*/
}

interface CreepStatSetup {
	hp_total: number;
	move_speed: number;
	defenses: DamageTypes;
}

export interface CreepStates {
	moving: CreepMoving;
	hurting: CreepHurting;
	hurt: boolean;
}

export interface CreepMoving {
	isMoving: boolean;
}

export interface CreepHurting {
	isHurting: boolean;
	hurtStartTime: number;
	hurtingStateLength: number;
}
