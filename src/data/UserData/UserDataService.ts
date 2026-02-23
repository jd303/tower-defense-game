import { Main } from '../../core/Main';
import { Power } from '../../environment/powers/Power';
import { AssetGenerator } from '../../environment/assets/AssetGenerator';
import { ChronosData, EconomyData } from '../../game/EconomyService';
import { HeroUpgradeProperty, PowerUpgradeProperty, TowerUpgradeProperty, UserLoadout } from './UserLoadout';
import { Tower } from '../../environment/towers/Tower';
import { Hero } from '../../environment/heroes/Hero';
import { EventService } from '../../core/EventService';

// Data Source
import { tempUserLoadoutData } from './_userLoadoutData';
import { StorageService } from '../../core/StorageService';
import { StorageKey } from '../../config/storageKeys';

export class UserDataService {
	/**
	 * System Properties
	 * */
	main: Main;
	userLoadout: UserLoadout;

	storageKey: StorageKey = "user_loadout";

	/**
	 * Maximums (might be overwritten / changed with upgrades later)
	 */
	maxHeroes: number = 1;
	maxPowers: number = 2;
	maxTowers: number = 3;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;
		this.loadUserData();
	}

	/**
	 * Load and save data
	 */
	async loadUserData() {
		const sStorage: StorageService = this.main.s('Storage');
		const userLoadout = await sStorage.read(this.storageKey);

		if (userLoadout) {
			console.log("%c Loading User Loadout from storage", "color: pink");
			this.userLoadout = new UserLoadout(JSON.parse(userLoadout));
		} else {
			console.log("%c Loading User Loadout from tempUserLoadoutData", "color: pink");
			this.userLoadout = new UserLoadout(tempUserLoadoutData);
		}
	}
	async saveUserData() {
		const sStorage: StorageService = this.main.s('Storage');
		await sStorage.write(this.storageKey, this.userLoadout.serialise());

		const sEvent: EventService = this.main.s('Event');
		sEvent.fire('user_loadout_changed', this.userLoadout);
	}

	// Dev function
	async awaitDev() {
		console.log("%c Waiting for sUserData.loadUserData().  Temp solution, won't need to wait when the game follows the expected screen path", "color: pink");
		await this.loadUserData();
	}

	/**
	 * Equips a hero
	 */
	equipHero(heroName: string) {
		const sStorage: StorageService = this.main.s('Storage');

		if (this.userLoadout.heroesEquipped.length >= this.maxHeroes) return false;
		this.userLoadout.heroesEquipped.push(heroName);
		sStorage.write(this.storageKey, this.userLoadout.serialise());
		return true;
	}
	unequipHero(heroName: string) {
		const sStorage: StorageService = this.main.s('Storage');
		this.userLoadout.heroesEquipped = this.userLoadout.heroesEquipped.filter(hero => hero != heroName);
		sStorage.write(this.storageKey, this.userLoadout.serialise());
		return true;
	}

	/**
	 * Gets equipped powers
	 */
	async getEquippedHeroes() {
		const heroNames = this.userLoadout.heroesEquipped;
		const heroes = [];
		for (let x = 0; x < heroNames.length; x++) {
			heroes.push(await AssetGenerator.getAssetAsSpriteAsset(heroNames[x]) as typeof Hero);
		}
		return heroes;
	}

	/**
	 * Equips a Tower
	 */
	equipTower(towerName: string) {
		const sStorage: StorageService = this.main.s('Storage');

		if (this.userLoadout.towersEquipped.length >= this.maxTowers) return false;
		this.userLoadout.towersEquipped.push(towerName);
		sStorage.write(this.storageKey, this.userLoadout.serialise());
		return true;
	}
	unequipTower(towerName: string) {
		const sStorage: StorageService = this.main.s('Storage');
		this.userLoadout.towersEquipped = this.userLoadout.towersEquipped.filter(tower => tower != towerName);
		sStorage.write(this.storageKey, this.userLoadout.serialise());
		return true;
	}

	/**
	 * Gets equipped powers
	 */
	async getEquippedTowers() {
		const towerNames = this.userLoadout.towersEquipped;
		const towers = [];
		for (let x = 0; x < towerNames.length; x++) {
			towers.push(await AssetGenerator.getAssetAsSpriteAsset(towerNames[x]) as typeof Tower);
		}
		return towers;
	}

	/**
	 * Equips a hero
	 */
	equipPower(powerName: string) {
		const sStorage: StorageService = this.main.s('Storage');

		if (this.userLoadout.powersEquipped.length >= this.maxPowers) return false;
		this.userLoadout.powersEquipped.push(powerName);
		sStorage.write(this.storageKey, this.userLoadout.serialise());
		return true;
	}
	unequipPower(powerName: string) {
		const sStorage: StorageService = this.main.s('Storage');
		this.userLoadout.powersEquipped = this.userLoadout.powersEquipped.filter(hero => hero != powerName);
		sStorage.write(this.storageKey, this.userLoadout.serialise());
		return true;
	}

	/**
	 * Gets equipped powers
	 */
	async getEquippedPowers() {
		const powerNames = this.userLoadout.powersEquipped;
		const powers: typeof Power[] = [];
		for (let x = 0; x < powerNames.length; x++) {
			powers.push(await AssetGenerator.getPowerAsAsset(powerNames[x]));
		}

		return powers;
	}

	/**
	 * Gets the user's economy data
	 */
	async getEconomyData(): Promise<EconomyData> {
		return this.userLoadout.economyData;
	}

	/**
	 * Gets the user's Chronos / Upgrading data
	 */
	async getChronosData(): Promise<ChronosData> {
		return this.userLoadout.chronosData;
	}

	/**
	 * Gets the user's Chronos / Upgrading data
	 */
	async requestAdjustChronos(chronosType: "chronoblips" | "chronobloops" | "chronoblobs", amount: number) {
		const sStorage: StorageService = this.main.s('Storage');
		const currentChronos = await this.getChronosData();

		if (currentChronos[chronosType] + amount >= 0) {
			this.userLoadout.chronosData[chronosType] += amount;

			let result = await sStorage.write(this.storageKey, this.userLoadout.serialise());

			if (result) {
				const sEvent: EventService = this.main.s('Event');
				sEvent.fire("chronos_changed", this.userLoadout.chronosData);

				return true;
			}

			return false;
		}
	}

	/**
	 * Returns hero upgrades based on purchases
	 */
	getHeroUpgrades() {
		const upgradeConverter = new PurchaseUpgradeConverter();
		const heroUpgrades = this.userLoadout.heroUpgradePurchases;

		Object.keys(heroUpgrades).forEach((upgradeKey: string) => {
			upgradeConverter.addUpgrade('hero', upgradeKey as HeroUpgradeProperty, heroUpgrades[upgradeKey as HeroUpgradeProperty]);
		});

		return upgradeConverter.upgrades;
	}

	/**
	 * Returns tower upgrades based on purchases
	 */
	getTowerUpgrades() {
		const upgradeConverter = new PurchaseUpgradeConverter();
		const towerUpgrades = this.userLoadout.towerUpgradePurchases;

		Object.keys(towerUpgrades).forEach((upgradeKey: string) => {
			upgradeConverter.addUpgrade('tower', upgradeKey as TowerUpgradeProperty, towerUpgrades[upgradeKey as TowerUpgradeProperty]);
		});

		return upgradeConverter.upgrades;
	}

	/**
	 * Returns power upgrades based on purchases
	 */
	getPowerUpgrades() {
		const upgradeConverter = new PurchaseUpgradeConverter();
		const powerUpgrades = this.userLoadout.powerUpgradePurchases;

		Object.keys(powerUpgrades).forEach((upgradeKey: string) => {
			upgradeConverter.addUpgrade('tower', upgradeKey as PowerUpgradeProperty, powerUpgrades[upgradeKey as PowerUpgradeProperty]);
		});

		return upgradeConverter.upgrades;
	}

	/**
	 * Calculates the cost based on increasing x per tier
	 */
	tierStepCost(n: number, x: number = 3) {
		const tier = Math.ceil(n / 5);
		return Math.ceil(Math.pow(x, tier - 1));
	}
}

class PurchaseUpgradeConverter {

	upgrades: Record<string, any>;

	constructor() {
		this.upgrades = {
			/*accuracy: 10,
			attack: { damage: -2, range: 5 },*/
		};
	}

	/**
	 * Adds an upgrade property
	 */
	addUpgrade(target: "hero" | "tower" | "power", purchaseKey: HeroUpgradeProperty | TowerUpgradeProperty | PowerUpgradeProperty, value: number) {
		switch (target) {
			case "hero": this.convertHeroUpgrade(purchaseKey as HeroUpgradeProperty, value); break;
			case "tower": this.convertTowerUpgrade(purchaseKey as TowerUpgradeProperty, value); break;
			case "power": this.convertPowerUpgrade(purchaseKey as PowerUpgradeProperty, value); break;
		}
	}

	/**
	 * Converts a hero purchase to an upgrade
	 */
	convertHeroUpgrade(purchaseKey: HeroUpgradeProperty, value: number) {
		let property: string | null = null;
		let subProperty: string | null = null;

		switch (purchaseKey) {
			case "movement":
				property = "movement";
				subProperty = "speed";
				break;
			case "power":
				property = "attack";
				subProperty = "damage";
				break;
			case "life":
				property = "life";
				break;
		}

		// Update upgrades
		if (subProperty) {
			if (!this.upgrades[property]) this.upgrades[property] = {};

			this.upgrades[property][subProperty] = (this.upgrades[property][subProperty] || 0) + value;
		}

		else {
			this.upgrades[property] = (this.upgrades[property] || 0) + value;
		}
	}

	/**
	 * Converts a tower purchase to an upgrade
	 */
	convertTowerUpgrade(purchaseKey: TowerUpgradeProperty, value: number) {
		let property: string | null = null;
		let subProperty: string | null = null;

		switch (purchaseKey) {
			case "accuracy":
				property = "attack";
				subProperty = "accuracy";
				break;
			case "power":
				property = "attack";
				subProperty = "damage";
				break;
			case "range":
				property = "attack";
				subProperty = "range";
				break;
			case "attackrate":
				property = "attack";
				subProperty = "speed";
				break;
		}

		// Update upgrades
		if (subProperty) {
			if (!this.upgrades[property]) this.upgrades[property] = {};

			this.upgrades[property][subProperty] = (this.upgrades[property][subProperty] || 0) + value;
		}

		else {
			this.upgrades[property] = (this.upgrades[property] || 0) + value;
		}
	}

	/**
	 * Converts a power purchase to an upgrade
	 */
	convertPowerUpgrade(purchaseKey: PowerUpgradeProperty, value: number) {
		let property: string | null = null;
		let subProperty: string | null = null;

		switch (purchaseKey) {
			case "cooldown":
				property = "cooldown";
				break;
			case "power":
				property = "power";
				break;
			case "size":
				property = "size";
				break;
		}

		// Update upgrades
		if (subProperty) {
			if (!this.upgrades[property]) this.upgrades[property] = {};

			this.upgrades[property][subProperty] = (this.upgrades[property][subProperty] || 0) + value;
		}

		else {
			this.upgrades[property] = (this.upgrades[property] || 0) + value;
		}
	}
}