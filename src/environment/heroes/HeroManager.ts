import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Hero } from './Hero';
import { Level } from '../../levels/Level';
import { AssetGenerator } from '../assets/AssetGenerator';
import { StatBlockCharacterModification } from '../Stats';

export class HeroManager {
	/**
	 * System Properties
	 * */
	main: Main;
	level: Level;

	/**
	 * Stats
	 * */
	heroes: Hero[] = [];
	heroUpgrades: StatBlockCharacterModification = {};

	/**
	 * Construtor
	 * */
	constructor(main: Main, level: Level) {
		this.main = main;
		this.level = level;
	}

	/**
	 * Creates a hero
	 */
	async createHero(assetName: string, point: THREE.Vector3) {
		const hero = await AssetGenerator.createSpriteAsset(assetName, this.level.main) as Hero;
		hero.registerOnLoadCallback(() => {
			hero.setPosition(point);
		});
		this.heroes.push(hero);

		hero.stats.addUpgrades(this.heroUpgrades);
	}

	/**
	 * Finds heroes within a range of a point
	 */
	findHeroesInRangeOf(testPosition: THREE.Vector3, range: number) {
		return this.heroes.filter((hero: Hero) => {
			const heroPosition = hero.groupMain.position;
			return heroPosition.distanceTo(testPosition) <= range;
		});
	}

	/**
	 * Removes the hero from the game
	 */
	disposeAll() {
		this.heroes.forEach((hero) => {
			hero.dispose();
		});
		this.heroes = [];
	}
}