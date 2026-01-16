import { DamageTypes } from "../../data/DamageTypes";
import { ProjectileHitTypes, ProjectileTravelTypes } from "../attacks/Projectile";
import { EffectConstructor } from "../Effect";

export class TowerStats {
	attack: TowerAttackStats;
	projectile: TowerProjectileDefinition;
	last_attack_time: number;
	attack_cooldown: number;
}

export interface TowerAttackStats {
	damage: number;
	damageType: DamageTypes,
	range: number;
	radius: number;
	accuracy: number;
}

export interface TowerProjectileDefinition {
	effect: EffectConstructor,
	travelType: ProjectileTravelTypes,
	hitType: ProjectileHitTypes;
	speed: number;
}

export class TowerStatesLegacy {
	attacking: TowerAttacking;
	stunned: TowerStunned;

	constructor() {
		this.attacking = {
			isAttacking: false,
			attackStartTime: 0,
			attackDuration: 750,
		};
		this.stunned = {
			isStunned: false,
			stunStartTime: 0,
		};

		return this;
	}
}

export interface TowerAttacking {
	isAttacking: boolean;
	attackStartTime: number;
	attackDuration: number;
}

export interface TowerStunned {
	isStunned: boolean;
	stunStartTime: number;
}
