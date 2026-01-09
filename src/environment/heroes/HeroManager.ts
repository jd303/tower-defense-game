import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Hero } from './Hero';
import { Level } from '../../levels/Level';
import { AssetGenerator } from '../assets/AssetGenerator';

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
	async createDefaultHero(point: THREE.Vector3) {
		const hero = await AssetGenerator.createSpriteAsset('Man0', this.level.main) as Hero;
		hero.registerOnLoadCallback(() => {
			hero.setPosition(point);
		});
		this.heroes.push(hero);
	}

	/**
	 * Removes the hero from the game
	 */
	disposeHeroes() {
		this.heroes.forEach((hero) => {
			hero.dispose();
		});
		this.heroes = [];
	}
}