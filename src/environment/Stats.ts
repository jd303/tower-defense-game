import { DamageTypeDefences, DamageTypes } from "../dataTypes/DamageTypes";
import { MovementTypes } from "../dataTypes/MovementTypes";
import { ProjectileHitTypes, ProjectileTravelTypes } from "./attacks/Projectile";
import { EffectConstructor } from "./Effect";

export class Stats {
	activeStats: StatBlockCharacter | StatBlockPower; // Live statistics
	baseStats: StatBlockCharacter | StatBlockPower; // The entity's base stats
	permanentUpgrades: (StatBlockCharacterModification | StatBlockPowerModification)[] = []; // Permanent user upgrades 
	temporaryModifiers: StatBlockModificationDefinition[] = []; // 

	/**
	 * Constructor
	 * */
	constructor(baseStats: StatBlockCharacter | StatBlockPower) {
		this.baseStats = baseStats;
		this.calculateActiveStats();
	}

	/**
	 * Register / add an upgrade to this entity
	 */
	addUpgrade(upgrade: StatBlockCharacterModification | StatBlockPowerModification) {
		this.permanentUpgrades.push(upgrade);
		this.calculateActiveStats();
	}
	addUpgrades(upgrades: StatBlockCharacterModification) {
		this.permanentUpgrades = this.permanentUpgrades.concat(upgrades);
		this.calculateActiveStats();
	}

	/**
	 * Register / add a temporary modifier to this entity
	 */
	addModifier(name: string, modifier: StatBlockCharacterModification) {
		this.temporaryModifiers.push({
			name: name,
			statBlock: modifier
		});
		this.calculateActiveStats();
	}

	/**
	 * Register / add a temporary modifier to this entity
	 */
	removeModifier(name: string) {
		this.temporaryModifiers = this.temporaryModifiers.filter(modifier => modifier.name !== name)
		this.calculateActiveStats();
	}

	/**
	 * Calculates active values of stats
	 */
	calculateActiveStats() { }

	/**
	 * Traverses the properties of stats and updates
	 */
	mergeWithActive(target: Record<string, any>, source: Record<string, any>) {
		for (const key in source) {
			const sourceValue = source[key];
			const targetValue = target[key];

			if (target[key] == undefined || target[key] == null) return console.error(`Not adding new Stat property ${key}`);

			if (typeof sourceValue === 'number' && typeof targetValue === 'number') {
				target[key] = targetValue + sourceValue;
			} else if (typeof sourceValue === 'string' && typeof targetValue === 'string') {
				target[key] = targetValue + sourceValue;
			} else if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
				this.mergeWithActive(target[key], sourceValue);
			} else {
				target[key] = sourceValue;
			}
		}
	}
}

/** ************************************************************
 * CHARACTER STATS
 */

export class CharacterStats extends Stats {
	activeStats: StatBlockCharacter; // Live statistics
	baseStats: StatBlockCharacter; // The entity's base stats

	constructor(baseStats: StatBlockCharacter) {
		super(baseStats);
	}

	/**
	 * Calculates active values of stats
	 */
	calculateActiveStats() {
		this.activeStats = {
			movement: this.baseStats.movement && { ...this.baseStats.movement },
			interception: this.baseStats.interception && { ...this.baseStats.interception },
			attack: this.baseStats.attack && { ...this.baseStats.attack },
			projectile: this.baseStats.projectile && { ...this.baseStats.projectile },
			life: this.baseStats.life && { ...this.baseStats.life },
			defenses: this.baseStats.defenses && { ...this.baseStats.defenses },
			kill_rewards: this.baseStats.kill_rewards && { ...this.baseStats.kill_rewards },
			vp_loss: this.baseStats.vp_loss && { ...this.baseStats.vp_loss },
		}

		// Add upgrades and Modifiers
		this.permanentUpgrades.forEach((upgrade: any) => this.mergeWithActive(this.activeStats, upgrade));
		this.temporaryModifiers.forEach(modifier => this.mergeWithActive(this.activeStats, modifier.statBlock));
	}

	/**
	 * Calculates actual damage applied, given defences of this creature
	 */
	calculateDamage(damage: number, damage_type: DamageTypes) {
		switch (damage_type) {
			case DamageTypes.piercing:
				damage = Math.max(0, damage - (this.activeStats.defenses?.piercing || 0));
				break;
			case DamageTypes.crushing:
				damage = Math.max(0, damage - (this.activeStats.defenses?.crushing || 0));
				break;
			case DamageTypes.arcane:
				damage = Math.max(0, damage - (this.activeStats.defenses?.arcane || 0));
				break;
			case DamageTypes.poison:
				damage = Math.max(0, damage - (this.activeStats.defenses?.poison || 0));
				break;
			case DamageTypes.fire:
				damage = Math.max(0, damage - (this.activeStats.defenses?.fire || 0));
				break;
		}
		return damage;
	}
}

// Base Stat Block
export interface StatBlockCharacter {
	movement?: CharacterMovementStats;
	interception?: CharacterInterceptionStats;
	attack?: CharacterAttackStats;
	projectile?: TowerProjectileDefinition;
	life?: CharacterLifeStats;
	defenses?: DamageTypeDefences;
	kill_rewards?: CharacterKillRewardsStats;
	vp_loss?: CharacterVPLossStats;
}

export interface StatBlockCharacterModification {
	movement?: Partial<CharacterMovementStats>;
	interception?: Partial<CharacterInterceptionStats>;
	attack?: Partial<CharacterAttackStats>;
	projectile?: Partial<TowerProjectileDefinition>;
	life?: Partial<CharacterLifeStats>;
	defenses?: Partial<DamageTypeDefences>;
	kill_rewards?: Partial<CharacterKillRewardsStats>;
	vp_loss?: Partial<CharacterVPLossStats>;
}

interface CharacterMovementStats {
	speed: number;
	type: MovementTypes;
}

interface CharacterInterceptionStats {
	distance: number;
	interceptionCount: number;
}

export interface CharacterAttackStats {
	speed: number;
	accuracy: number;
	damage: number;
	damageType: DamageTypes;
	rangeType: AttackRangeTypes;
	range?: number;
}

interface TowerProjectileDefinition {
	effect: EffectConstructor,
	travelType: ProjectileTravelTypes,
	hitType: ProjectileHitTypes;
	speed: number;
	splashRadius: number;
}

interface CharacterLifeStats {
	total: number;
	current: number;
}

interface CharacterKillRewardsStats {
	economic_property: string,
	value: number
}

interface CharacterVPLossStats {
	value: number
}

interface StatBlockModificationDefinition {
	name: string;
	statBlock: StatBlockCharacterModification;
}

export enum AttackRangeTypes {
	melee,
	ranged
}


/** ************************************************************
 * POWER STATS
 */
export class PowerStats extends Stats {
	activeStats: StatBlockPower; // Live statistics
	baseStats: StatBlockPower; // The entity's base stats

	constructor(baseStats: StatBlockPower) {
		super(baseStats);
	}

	/**
	 * Calculates active values of stats
	 */
	calculateActiveStats() {
		this.activeStats = { ...this.baseStats };

		// Add upgrades and Modifiers
		this.permanentUpgrades.forEach((upgrade: any) => this.mergeWithActive(this.activeStats, upgrade));
		this.temporaryModifiers.forEach(modifier => this.mergeWithActive(this.activeStats, modifier.statBlock));
	}
}


export interface StatBlockPower {
	cost: number;
	damage?: number;
	radiusPrimary?: number;
	radiusSecondary?: number;
	duration?: number;
}

export interface StatBlockPowerModification {
	cost?: number;
	damage?: number;
	radiusPrimary?: number;
	radiusSecondary?: number;
	duration?: number;
}


/*
E.g. CORE:
{
	attack: {
		speed: 1,
		damage: 12,
		damageType: "Fire"
	},
	defence: {
		piercing: 0,
		crushing: 2,
		arcane: 3,
		poison: 4,
		lightning: 6,
		fire: 2,
	}
}

e.g MODIFIER (attack speed spell):
{
	attack: {
		speed: 5
	}
}
*/