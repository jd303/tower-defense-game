import { Main } from '../core/Main';
import { Power } from '../environment/powers/Power';
import { AssetGenerator } from '../environment/assets/AssetGenerator';
import { EconomyData } from '../game/EconomyService';

// TEMP
import { tempUserLoadoutData } from './_userLoadoutData';
import { Tower } from '../environment/towers/Tower';

export class UserLoadoutManager {
	/**
	 * System Properties
	 * */
	main: Main;
	userLoadout: UserLoadoutData;

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;

		this.setup();
	}

	/**
	 * Loads data ready for use
	 */
	setup() {
		this.userLoadout = tempUserLoadoutData;
	}

	/**
	 * Gets equipped powers
	 */
	async getEquippedHeroes() {
		const heroes = this.userLoadout.heroes;
		return heroes.map((heroName) => AssetGenerator.getAssetAsSpriteAsset(heroName));
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
	getEconomyData(): EconomyData {
		return this.userLoadout.economyData;
	}

}

export interface UserLoadoutData {
	heroes: string[];
	towers: string[];
	powers: string[];
	economyData: EconomyData;
	//upgrades: UserLoadoutUpgrades; // To do later
}