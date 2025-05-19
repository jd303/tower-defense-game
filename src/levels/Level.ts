import * as THREE from 'three';
import { Creep } from '../environment/creeps/Creep';
import { Terrain } from '../environment/Terrain';
import { Main } from '../core/Main';
import { LevelDefinition } from '../data/LevelInterfaces';
import { TickCallback, TickService, TickTimeProperties } from '../core/TickService';
import { UIService } from '../game/UIService';
import { CameraService } from '../core/CameraService';
import { Hero } from '../environment/heroes/Hero';
import { PropManager } from '../environment/propManager/PropManager';
import { TowerManager } from '../environment/towers/TowerManager';
import { CreepManager } from '../environment/creeps/CreepManager';
import { WaveManager } from './WaveManager';
import { LevelCameraManager } from './LevelCameraManager';

export class Level {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Path
	 * */
	levelDetails: LevelDefinition;

	/**
	 * Level Assets
	 * */
	levelCameraManager: LevelCameraManager;
	terrain: Terrain;
	waveManager: WaveManager;
	propManager: PropManager;
	towerManager: TowerManager;
	creepManager: CreepManager;
	heroes: Hero[] = [];

	/**
	 * Constructor
	 */
	constructor(levelDetails: LevelDefinition, main: Main) {
		this.levelDetails = levelDetails;
		this.main = main;
		this.main.s('Level').currentLevel = this;
		this.levelCameraManager = new LevelCameraManager(this.main);
		this.terrain = new Terrain(levelDetails.terrain, this.main);
		this.propManager = new PropManager(this.main);
		this.towerManager = new TowerManager(this.main);
		this.creepManager = new CreepManager(this.main);
		this.waveManager = new WaveManager(this, this.main);

		this.setupLevel();
	}

	/**
	 * Sets up all the assets required for the level
	 */
	setupLevel() {
		this.levelCameraManager.setup();
		this.creepManager.setupCreepPaths(this.levelDetails);
		this.propManager.setup(this.levelDetails);
		this.towerManager.setup(this.levelDetails);
		this.waveManager.setup(this.levelDetails);

		this.renderLevel();
		this.setupMainTick();
		this.waveManager.startWaveTimer();
	}

	/**
	 * Renders all the objects in the level
	 */
	renderLevel() {
		console.log("%c TODO: Migrate all rendering (props, creeps, etc) to here", "color:green");
		this.main.scene.add(this.terrain.groupMain);

		// Start the timer
		this.main.s('Tick').start();
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

		this.heroes.forEach((hero) => hero.animateCore(timeProperties));
		this.creepManager.tick(timeProperties);
		this.towerManager.tick(timeProperties);
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
