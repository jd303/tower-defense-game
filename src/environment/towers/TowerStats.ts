import { ProjectileHitTypes, ProjectileTypes } from "../attacks/Projectile";

export class TowerStats {
	cost: number;
	costType: string;
	attack: TowerAttackStats;
	last_attack_time: number;
	attack_cooldown: number;
}

export interface TowerAttackStats {
	damage: number;
	type: ProjectileTypes,
	hitType: ProjectileHitTypes;
	range: number;
	radius?: number;
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
