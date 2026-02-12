import { StatBlockCharacterModification, StatBlockPowerModification } from "../environment/Stats";
import { EconomyData } from "../game/EconomyService";

export interface UserLoadoutData {
	heroes: string[];
	heroUpgrades: Record<string, StatBlockCharacterModification[]>;

	towers: string[];
	towerUpgrades: Record<string, StatBlockCharacterModification[]>;

	powers: string[];
	powerUpgrades: Record<string, StatBlockPowerModification[]>;

	economyData: EconomyData;

	chronoData: ChronosData;
}

export class UserLoadout {
	heroes: string[];
	heroUpgrades: Record<string, StatBlockCharacterModification[]>;

	towers: string[];
	towerUpgrades: Record<string, StatBlockCharacterModification[]>;

	powers: string[];
	powerUpgrades: Record<string, StatBlockPowerModification[]>;

	economyData: EconomyData;

	chronoData: ChronosData;

	constructor(data: UserLoadoutData) {
		this.heroes = data.heroes || []
		this.heroUpgrades = data.heroUpgrades || {}

		this.towers = data.towers || [];
		this.towerUpgrades = data.towerUpgrades || {};

		this.powers = data.powers || [];
		this.powerUpgrades = data.powerUpgrades || {};

		this.economyData = data.economyData || {};
	}

	/**
	 * Serialises the data
	 */
	serialise() {
		return JSON.stringify(this);
	}
}

export interface ChronosData {
	chronoblips: number;
	chronobloops: number;
	chronoblobs: number;
}