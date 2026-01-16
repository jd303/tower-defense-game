import { DamageTypeDefences, DamageTypes } from "../data/DamageTypes";
import { MovementTypes } from "../data/MovementTypes";
import { ProjectileHitTypes, ProjectileTravelTypes } from "./attacks/Projectile";
import { EffectConstructor } from "./Effect";

export class Stats {
	activeStats: StatBlock; // Live statistics
	baseStats: StatBlock; // The entity's base stats
	permanentUpgrades: StatBlockModification[] = []; // Permanent user upgrades 
	temporaryModifiers: StatBlockModificationDefinition[] = []; // 

	/**
	 * Constructor
	 * */
	constructor(baseStats: StatBlock) {
		this.baseStats = baseStats;
		this.calculateActiveStats();
	}

	/**
	 * Returns a stat value
	 */
	getStat() {
		console.log("GETTING A STAT VALUE");
	}

	/**
	 * Register / add an upgrade to this entity
	 */
	addUpgrade(upgrade: StatBlockModification) {
		this.permanentUpgrades.push(upgrade);
		this.calculateActiveStats();
	}

	/**
	 * Register / add a temporary modifier to this entity
	 */
	addModifier(name: string, modifier: StatBlockModification) {
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
		this.permanentUpgrades.forEach(upgrade => this.mergeWithActive(this.activeStats, upgrade));
		this.temporaryModifiers.forEach(modifier => this.mergeWithActive(this.activeStats, modifier.statBlock));
	}

	/**
	 * Traverses the properties of stats and updates
	 */
	private mergeWithActive(target: Record<string, any>, source: Record<string, any>) {
		for (const key in source) {
			if (key == "projectile") {
				console.error("Currently not overwriting Projectile due to class constructor loss");
				continue;
			}

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
export interface StatBlock {
	movement?: MovementStats;
	interception?: InterceptionStats;
	attack?: AttackStats;
	projectile?: TowerProjectileDefinition;
	life?: LifeStats;
	defenses?: DamageTypeDefences;
	kill_rewards?: KillRewardsStats;
	vp_loss?: VPLossStats;
}

interface StatBlockModification {
	movement?: Partial<MovementStats>;
	interception?: Partial<InterceptionStats>;
	attack?: Partial<AttackStats>;
	projectile?: Partial<TowerProjectileDefinition>;
	life?: Partial<LifeStats>;
	defenses?: Partial<DamageTypeDefences>;
	kill_rewards?: Partial<KillRewardsStats>;
	vp_loss?: Partial<VPLossStats>;
}

interface MovementStats {
	speed: number;
	type: MovementTypes;
}

interface InterceptionStats {
	distance: number;
	interceptionCount: number;
}

export interface AttackStats {
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

interface LifeStats {
	total: number;
	current: number;
}

interface KillRewardsStats {
	economic_property: string,
	value: number
}

interface VPLossStats {
	value: number
}

interface StatBlockModificationDefinition {
	name: string;
	statBlock: StatBlockModification;
}

export enum AttackRangeTypes {
	melee,
	ranged
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