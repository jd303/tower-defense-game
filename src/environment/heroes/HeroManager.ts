import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Hero } from './Hero';
import { Man0 } from './Man0';

export class HeroManager {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Stats
	 * */
	heroes: Hero[] = [];

	/**
	 * Construtor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Creates a hero
	 */
	createDefaultHero(point: THREE.Vector3) {
		const man0 = new Man0(this.main);
		this.heroes.push(man0);
		this.main.scene.add(man0.groupMain);
		man0.groupMain.position.set(point.x, point.y, point.z);
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