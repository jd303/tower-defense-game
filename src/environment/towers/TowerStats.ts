import { DamageTypes } from "../../dataTypes/DamageTypes";
import { TowerProjectileDefinition } from "../Stats";

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

export interface TowerAttacking {
	isAttacking: boolean;
	attackStartTime: number;
	attackDuration: number;
}

export interface TowerStunned {
	isStunned: boolean;
	stunStartTime: number;
}
