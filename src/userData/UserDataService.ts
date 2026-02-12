import { Main } from '../core/Main';
import { Power } from '../environment/powers/Power';
import { AssetGenerator } from '../environment/assets/AssetGenerator';
import { EconomyData } from '../game/EconomyService';
import { ChronosData, UserLoadout } from './UserLoadout';
import { Tower } from '../environment/towers/Tower';
import { Hero } from '../environment/heroes/Hero';
import { UserDataHandler } from './UserDataHandler';

export class UserDataService {
	/**
	 * System Properties
	 * */
	main: Main;
	userDataHandler: UserDataHandler;
	userLoadout: UserLoadout;

	/**
	 * Maximums (might be overwritten / changed with upgrades later)
	 */
	maxHeroes: number = 1;
	maxPowers: number = 2;
	maxTowers: number = 3;

	/**
	 * Statics
	 */
	static storageKey = 'user_loadout';

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;

		this.userDataHandler = new UserDataHandler();
		this.load();
	}

	/**
	 * Load data
	 */
	async load() {
		this.userLoadout = await this.userDataHandler.read();
	}

	// Dev function
	async awaitDev() {
		console.log("%c Waiting for sUserData.load().  Temp solution, won't need to wait when the game follows the expected screen path", "color: pink");
		await this.load();
	}

	/**
	 * Equips a hero
	 */
	equipHero(heroName: string) {
		if (this.userLoadout.heroes.length >= this.maxHeroes) return false;
		this.userLoadout.heroes.push(heroName);
		this.userDataHandler.write(this.userLoadout);
		return true;
	}
	unequipHero(heroName: string) {
		this.userLoadout.heroes = this.userLoadout.heroes.filter(hero => hero != heroName);
		this.userDataHandler.write(this.userLoadout);
		return true;
	}

	/**
	 * Gets equipped powers
	 */
	async getEquippedHeroes() {
		const heroNames = this.userLoadout.heroes;
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
		if (this.userLoadout.towers.length >= this.maxTowers) return false;
		this.userLoadout.towers.push(towerName);
		this.userDataHandler.write(this.userLoadout);
		return true;
	}
	unequipTower(towerName: string) {
		this.userLoadout.towers = this.userLoadout.towers.filter(tower => tower != towerName);
		this.userDataHandler.write(this.userLoadout);
		return true;
	}

	/**
	 * Gets equipped powers
	 */
	async getEquippedTowers() {
		const towerNames = this.userLoadout.towers;
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
		if (this.userLoadout.powers.length >= this.maxPowers) return false;
		this.userLoadout.powers.push(powerName);
		this.userDataHandler.write(this.userLoadout);
		return true;
	}
	unequipPower(powerName: string) {
		this.userLoadout.powers = this.userLoadout.powers.filter(hero => hero != powerName);
		this.userDataHandler.write(this.userLoadout);
		return true;
	}

	/**
	 * Gets equipped powers
	 */
	async getEquippedPowers() {
		const powerNames = this.userLoadout.powers;
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
		return this.userLoadout.chronoData;
	}
}