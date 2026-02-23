import { ChronosData, EconomyData } from "../../game/EconomyService";

export class UserLoadout {
	permanentUnlocks: {
		towers: string[],
		heroes: string[],
		powers: string[]
	};

	runDiscoveries: {
		towers: string[],
		heroes: string[],
		powers: string[]
	};

	runModifiers: RunModifier[];

	heroesEquipped: string[];
	heroUpgradePurchases: Record<HeroUpgradeProperty, number>;

	towersEquipped: string[];
	towerUpgradePurchases: Record<TowerUpgradeProperty, number>;

	powersEquipped: string[];
	powerUpgradePurchases: Record<PowerUpgradeProperty, number>;

	economyData: EconomyData;

	chronosData: ChronosData;

	constructor(data: UserLoadoutData) {
		this.permanentUnlocks = data.permanentUnlocks;
		this.runDiscoveries = data.runDiscoveries;
		this.runModifiers = data.runModifiers;

		this.heroesEquipped = data.heroesEquipped || []
		this.heroUpgradePurchases = data.heroUpgradePurchases || {}

		this.towersEquipped = data.towersEquipped || [];
		this.towerUpgradePurchases = data.towerUpgradePurchases || {};

		this.powersEquipped = data.powersEquipped || [];
		this.powerUpgradePurchases = data.powerUpgradePurchases || {};

		this.economyData = data.economyData || {};
		this.chronosData = data.chronosData || {};
	}

	/**
	 * Serialises the data
	 */
	serialise() {
		return JSON.stringify(this);
	}
}

export interface UserLoadoutData {
	permanentUnlocks: {
		towers: string[],
		heroes: string[],
		powers: string[]
	},

	runDiscoveries: {
		towers: string[],
		heroes: string[],
		powers: string[]
	},

	runModifiers: RunModifier[],

	heroesEquipped: string[];
	heroUpgradePurchases: Record<HeroUpgradeProperty, number>;

	towersEquipped: string[];
	towerUpgradePurchases: Record<TowerUpgradeProperty, number>;

	powersEquipped: string[];
	powerUpgradePurchases: Record<PowerUpgradeProperty, number>;

	economyData: EconomyData;

	chronosData: ChronosData;
}

export type HeroUpgradeProperty = "movement" | "power" | "life";
export type TowerUpgradeProperty = "accuracy" | "power" | "range" | "attackrate";
export type PowerUpgradeProperty = "cooldown" | "power" | "size";

const runModifiers = ["Pyroclasm", "Cyoclasm"] as const;
export type RunModifier = typeof runModifiers[number];