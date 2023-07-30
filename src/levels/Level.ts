import * as THREE from 'three';
import { Creep } from '../environment/creeps/Creep';
import { Tower } from '../environment/towers/Tower';
import { Prop } from '../environment/Prop';
import { Terrain } from '../environment/Terrain';
import { Main } from '../core/Main';
import { LevelPath } from './LevelPath';
import { LevelDefinition } from '../data/LevelInterfaces';
import { TickCallback, TickService, TickTimeProperties } from '../core/TickService';
import { UIService } from '../game/UIService';
import { CameraService } from '../core/CameraService';
import { Hero } from '../environment/heroes/Hero';

export class Level {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Path
	 * */
	levelPaths: LevelPath[] = [];

	/**
	 * Level Assets
	 * */
	terrain: Terrain;
	creeps: Creep[] = [];
	towers: Tower[] = [];
	props: Prop[] = [];
	heroes: Hero[] = [];

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;
		this.main.s('Level').currentLevel = this;
		this.setupMainTick();
	}

	/**
	 * Adds a creep to the level
	 * */
	addTerrain(levelDetails: LevelDefinition) {
		const terrain = new Terrain(levelDetails.terrain, this.main);
		this.terrain = terrain;
		this.main.scene.add(terrain.groupMain);
	}

	/**
	 * Adds a creep to the level
	 * */
	addCreep(creep: Creep) {
		// if (!this.creeps.find((creep) => creep)) this.creeps.push(creep);
		this.creeps.push(creep);
		this.main.scene.add(creep.groupMain);
	}

	/**
	 * Removes a creep from the level
	 * */
	removeCreep(removedCreep: Creep) {
		this.creeps = this.creeps.filter((creep) => creep !== removedCreep);
		this.main.scene.remove(removedCreep.groupMain);
	}

	/**
	 * Adds a tower to the level
	 * */
	addTower(tower: Tower, point: THREE.Vector3) {
		// if (!this.towers.find((tower) => tower)) this.towers.push(tower);
		this.towers.push(tower);
		this.main.scene.add(tower.groupMain);
		tower.groupMain.position.set(point.x, point.y, point.z);
	}

	/**
	 * Adds a prop to the level
	 * */
	addProp(prop: Prop, point: THREE.Vector3) {
		this.props.push(prop);
		this.main.scene.add(prop.groupMain);
		prop.groupMain.position.set(point.x, point.y, point.z);
	}

	/**
	 * Adds a prop to the level
	 * */
	addHero(hero: Hero, point: THREE.Vector3) {
		this.heroes.push(hero);
		this.main.scene.add(hero.groupMain);
		hero.groupMain.position.set(point.x, point.y, point.z);
	}

	/**
	 * Registers callback for tick
	 * */
	setupMainTick() {
		this.main.s('Tick').registerCallback(new TickCallback("Level", this.gameplayTickCallback.bind(this)));
	}

	/**
	 * Animates creeps and towers and other game items
	 * */
	gameplayTickCallback(timeProperties: TickTimeProperties) {
		this.creeps.forEach((creep) => creep.animateCore(timeProperties));
		this.towers.forEach((tower) => tower.animateCore(timeProperties));
	}

	/**
	 * If the player wins the level!
	 * */
	winLevel() {
		console.log("You win the level!");
	}

	/**
	 * If the player loses the level!
	 * */
	loseLevel() {
		console.log("You lose the level!");
		const sTick: TickService = this.main.s('Tick');
		const sUI: UIService = this.main.s('UI');
		const sCamera: CameraService = this.main.s('Camera');
		sTick.end();
		
		sUI.removeEconomyUI();
		sUI.removeTowersUI();
		sUI.removeHeroesUI();
		sUI.createPopup("lose-level", "Sorry, you lost the level.  Sad face", ['bubble-in']);
		sCamera.removeOrbitControls();
	}

	/**
	 * A creep passes the finish line
	 * */
	creepEscaped(creep: Creep) {
		console.log("A creep passed the line:", creep);

		const sEconomy = this.main.s('Economy');
		const sEvent = this.main.s('Event');
		const vpValue = sEconomy.adjustEconomyValue('vp', -1 * creep.stats.vp_loss);
		sEvent.fire('vp_changed', vpValue);

		if (vpValue <= 0) {
			this.loseLevel();
		}
	}
}
