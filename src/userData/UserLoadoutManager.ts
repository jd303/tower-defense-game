import { Main } from '../core/Main';
import { Power } from '../environment/powers/Power';
import { AssetGenerator } from '../environment/assets/AssetGenerator';
import { EconomyData } from '../game/EconomyService';
import { StatBlockCharacterModification, StatBlockPowerModification } from "../environment/Stats";

// TEMP
import { tempUserLoadoutData } from './_userLoadoutData';
import { Tower } from '../environment/towers/Tower';
import { Hero } from '../environment/heroes/Hero';

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
		const heroNames = this.userLoadout.heroes;
		const heroes = [];
		for (let x = 0; x < heroNames.length; x++) {
			heroes.push(await AssetGenerator.getAssetAsSpriteAsset(heroNames[x]) as typeof Hero);
		}
		return heroes;
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
	heroUpgrades: Record<string, StatBlockCharacterModification[]>;

	towers: string[];
	towerUpgrades: Record<string, StatBlockCharacterModification[]>;

	powers: string[];
	powerUpgrades: Record<string, StatBlockPowerModification[]>;

	economyData: EconomyData;
}