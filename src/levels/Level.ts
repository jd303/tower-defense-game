import * as THREE from 'three';
import { Creep } from '../environment/creeps/Creep';
import { Terrain } from '../environment/Terrain';
import { Main } from '../core/Main';
import { LevelDefinition, LevelResults, TerrainTypes } from '../dataTypes/LevelInterfaces';
import { TickCallback, TickService, TickSpeed, TickTimeProperties } from '../core/TickService';
import { UIService } from '../game/UIService';
import { CameraService } from '../core/CameraService';
import { SpritePropManager } from '../environment/propManager/SpritePropManager';
import { TowerManager } from '../environment/towers/TowerManager';
import { CreepManager } from '../environment/creeps/CreepManager';
import { WaveManager } from './WaveManager';
import { LevelCameraManager } from './LevelCameraManager';
import { EconomyService } from '../game/EconomyService';
import { EventService } from '../core/EventService';
import { HeroManager } from '../environment/heroes/HeroManager';
import { InstancedMeshService } from '../game/InstancedMeshService';
import { PowersManager } from '../environment/powers/PowersManager';
import { LightingService } from '../core/LightingService';
import { DebugService } from '../core/DebugService';
import { UserDataService } from '../data/UserData/UserDataService';
import { LevelCompletePopup } from '../screens/LevelCompletePopup';
import { RunEndLevelPopup } from '../screens/RunEndLevelPopup';
import { ProgressDataService } from '../data/ProgressData/ProgressDataService';

export class Level {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Statics
	 */
	static levelWidth: number = 140; // Width of all levels
	static levelHeight: number = 120; // Height of all levels

	/**
	 * Core
	 * */
	levelDetails: LevelDefinition;
	levelResults: LevelResults = {
		creepsInLevel: 0,
		creepsSeen: 0,
		creepsKilled: 0,
		creepsEscaped: 0,
	}

	/**
	 * Level Assets
	 * */
	levelCameraManager: LevelCameraManager;
	terrain: Terrain | null;
	waveManager: WaveManager;
	propManager: SpritePropManager;
	towerManager: TowerManager;
	creepManager: CreepManager;
	heroManager: HeroManager;
	powersManager: PowersManager;

	/**
	 * Constructor
	 */
	constructor(levelDetails: LevelDefinition, main: Main) {
		this.levelDetails = levelDetails;
		this.main = main;
		this.main.s('Level').currentLevel = this;
		this.levelCameraManager = new LevelCameraManager(this.main, this);
		this.propManager = new SpritePropManager(this.main, this);
		this.towerManager = new TowerManager(this.main);
		this.creepManager = new CreepManager(this.main, this);
		this.waveManager = new WaveManager(this.main, this);
		this.heroManager = new HeroManager(this.main, this);
		this.powersManager = new PowersManager(this.main, this);

		if (this.main.debugMode) this.setupDebugs(levelDetails);

		this.setTerrain(levelDetails.terrain);
		this.setupLevel();
	}

	/**
	 * Sets the level's terrain
	 * @param terrainType 
	 */
	setTerrain(terrainType: TerrainTypes) {
		if (this.terrain) {
			this.terrain.removeFromScene();
			this.terrain = null;
		}
		this.terrain = new Terrain(terrainType, this.main);
		this.terrain.addToScene();
	}

	/**
	 * Sets up all the assets required for the level
	 */
	async setupLevel() {
		this.levelCameraManager.setup();
		this.creepManager.setupCreepPaths(this.levelDetails);
		this.propManager.setup(this.levelDetails);
		this.setupLights();

		await this.main.s('UserData').awaitDev();

		this.setupUI();
		this.setupEconomy();
		this.setupHero();
		this.setupTowers();
		this.setupPowers();
		this.setupMainTick();

		await this.waveManager.createLevelWaves(this.levelDetails.difficulty, this.levelDetails.creepOptions);
		this.waveManager.startWaveTimer();
	}

	/**
	 * Sets up lights
	 */
	setupLights() {
		const sLighting: LightingService = this.main.s('Lighting');
		const ambientLight = sLighting.createAmbientLight("WorldAmbient", '#ffffff', 3);
		sLighting.enableLight(ambientLight);
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');
		const directionalLight = sLighting.createDirectionalLight('WorldDirectional', new THREE.Vector3(40, 40, 40), '#ffffff', 2);
		sLighting.enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');

		// Set instanced Mesh colours
		const sInstancedMesh: InstancedMeshService = this.main.s('InstancedMesh');
		const environmentColour = sLighting.getEnvironmentColourByIntensity(this.levelDetails.environmentColour.colour, this.levelDetails.environmentColour.intensity);
		if (environmentColour) sInstancedMesh.setEnvironmentColour(environmentColour);

		// Enable shadows
		setTimeout(() => {
			sLighting.setRendererShadows(true);
			this.terrain?.enableShadows();
			directionalLight.enableShadows();
		}, 100);
	}

	/**
	 * Setup a UI (towers defaulted, but in the future players should be able to choose)
	 */
	setupUI() {
		const sUI: UIService = this.main.s('UI');
		sUI.addEconomyLabel('money', 'commerce_money_changed');
		sUI.addEconomyLabel('power', 'commerce_power_changed');
		sUI.addEconomyLabel('hearts', 'commerce_hearts_changed');
	}

	/**
	 * Sets up the economy for the level
	 */
	async setupEconomy() {
		const sEconomy: EconomyService = this.main.s('Economy');
		const sEvent: EventService = this.main.s('Event');
		const sUserData: UserDataService = this.main.s('UserData');

		const userEconomyData = await sUserData.getEconomyData();
		sEconomy.setEconomyValue("money", userEconomyData.money.current);
		sEvent.fire('commerce_money_changed', userEconomyData.money.current);
		sEconomy.setEconomyValue("hearts", userEconomyData.hearts.current);
		sEvent.fire("commerce_hearts_changed", userEconomyData.hearts.current);
		sEconomy.setEconomyValue("power", userEconomyData.power.current);
		sEvent.fire("commerce_power_changed", userEconomyData.power.current);
	}

	/**
	 * Sets up the hero for the level
	 */
	async setupHero() {
		const sUserData: UserDataService = this.main.s('UserData');
		const heroUpgrades = sUserData.getHeroUpgrades();
		this.heroManager.heroUpgrades = heroUpgrades;

		const heroes = await sUserData.getEquippedHeroes();
		heroes.forEach(hero => this.heroManager.createHero(hero.assetProperties.assetName, new THREE.Vector3(-28, 0, -20)));
	}

	/**
	 * Sets up towers for the level
	 */
	async setupTowers() {
		const sUserData: UserDataService = this.main.s('UserData');

		const towers = await sUserData.getEquippedTowers();
		await this.towerManager.setup(this.levelDetails, towers);

		const towerUpgrades = await sUserData.getTowerUpgrades();
		this.towerManager.towerUpgrades = towerUpgrades;
	}

	/**
	 * Sets up powers for the level
	 */
	async setupPowers() {
		const sUserData: UserDataService = this.main.s('UserData');

		const powers = await sUserData.getEquippedPowers();
		const powerUpgrades = await sUserData.getPowerUpgrades();
		this.powersManager.powerUpgrades = powerUpgrades;
		this.powersManager.setup(powers);
	}

	/**
	 * Registers callback for tick
	 * */
	setupMainTick() {
		console.log("SETUP MAIN TICK");
		const sTick: TickService = this.main.s('Tick');
		const sInstancedMesh: InstancedMeshService = this.main.s('InstancedMesh');
		sTick.start();
		sTick.registerCallback(new TickCallback("Level", this.gameplayTickCallback.bind(this)));
		sTick.registerCallback(new TickCallback("InstancedMeshes", sInstancedMesh.updateInstancedMeshes.bind(sInstancedMesh)));
	}

	/**
	 * Animates creeps and towers and other game items
	 * */
	gameplayTickCallback(timeProperties: TickTimeProperties) {
		this.heroManager.heroes.forEach((hero) => hero.animateCore(timeProperties));
		this.creepManager.tick(timeProperties);
		this.towerManager.tick(timeProperties);
	}

	/**
	 * The level ends, and the caravan continues
	 */
	levelComplete() {
		const sCamera: CameraService = this.main.s('Camera');
		sCamera.removeOrbitControls();

		const sTick: TickService = this.main.s('Tick');
		sTick.end();

		const sUI: UIService = this.main.s('UI');
		sUI.removeEconomyUI();
		sUI.removeTowersUI();
		sUI.removePowersUI();

		// Write that we completed the stage
		const sProgressData: ProgressDataService = this.main.s('ProgressData');
		sProgressData.updateLevelCompletion(this.levelDetails.levelId, true);

		// Create a results popup
		const popup: LevelCompletePopup = sUI.openPopup(LevelCompletePopup, "LevelLost") as LevelCompletePopup;
		popup.setResults(this.levelResults);
	}

	/**
	 * The caravan's last lives were cut short on this level
	 */
	levelFailed() {
		const sCamera: CameraService = this.main.s('Camera');
		sCamera.removeOrbitControls();

		const sTick: TickService = this.main.s('Tick');
		sTick.end();

		const sUI: UIService = this.main.s('UI');
		sUI.removeEconomyUI();
		sUI.removeTowersUI();
		sUI.removePowersUI();

		// Create a results popup
		sUI.openPopup(RunEndLevelPopup, "LevelLost") as RunEndLevelPopup;
	}

	/**
	 * Updates a level result
	 */
	updateLevelResults(key: keyof LevelResults, valueChange: number) {
		this.levelResults[key] += valueChange;

		if (this.levelResults.creepsInLevel > 0) {
			console.log(this.levelResults.creepsEscaped, this.levelResults.creepsKilled, this.levelResults.creepsInLevel)
			if (this.levelResults.creepsEscaped + this.levelResults.creepsKilled >= this.levelResults.creepsInLevel) {
				this.levelComplete();
			}
		}
	}

	/**
	 * A creep passes the finish line
	 * */
	creepEscaped(creep: Creep) {
		console.log("A creep passed the line:", creep);

		const sEconomy: EconomyService = this.main.s('Economy');
		const vpValue = sEconomy.adjustEconomyValue('hearts', -1 * creep.stats.activeStats.vp_loss!.value);

		this.updateLevelResults('creepsEscaped', 1);

		if (vpValue <= 0) {
			this.levelFailed();
		}
	}

	/**
	 * Debug objects and helpers
	 */
	setupDebugs(levelDetails: LevelDefinition) {
		const sDebug: DebugService = this.main.s('Debug');
		const sTick: TickService = this.main.s('Tick');

		sDebug.lilGUI.add(sTick, 'pauseTick').name('Pause Tick');
		sDebug.lilGUI.add(sTick, 'unpauseTick').name('Unpause Tick');

		sDebug.addDebugNumber({
			folder: '',
			objectParent: sTick,
			property: 'masterSpeed',
			min: 0,
			max: 10,
			step: 0.01,
			name: `Tick Speed`,
		});

		sDebug.watchDrawCalls();
		sDebug.addTerrainPositionWatcher();

		// SOME DEBUG OBJECTS OFF TO THE LEFT
		this.propManager.registerProp({ assetName: 'MountainInitial', position: new THREE.Vector3(-90, 0, -50) }, levelDetails);
		this.propManager.registerProp({ assetName: 'TreeBulbous', position: new THREE.Vector3(-90, 0, -55) }, levelDetails);

		// Setup a Debug to initiate level creation
		this.main.s('Debug').createLevelEditor(this);

		/**
		 * DEBUG Objects
		 * */
		//sDebug.addDebugSphere({ position: new THREE.Vector3(0, 5, 30), scale: new THREE.Vector3(5, 5, 5) });
	}

	/**
	 * Pauses the level
	 */
	setPaused(isPaused: boolean) {
		const sTick: TickService = this.main.s('Tick');
		console.log("Set game speed", isPaused ? TickSpeed.paused : TickSpeed.default);
		sTick.setGameSpeed(isPaused ? TickSpeed.paused : TickSpeed.default);
	}

	/**
	 * Removes all assets from the scene and UI
	 */
	disposeLevel() {
		console.log("%c Disposing the Level has not been fully tested.  Check registered objects in debugger", "color: red");
		this.terrain?.removeFromScene();
		this.terrain = null;

		this.waveManager.disposeWaves();
		this.propManager.disposeAll();
		this.towerManager.disposeAll();
		this.creepManager.disposeAll();
		this.heroManager.disposeAll();

		const sUI: UIService = this.main.s('UI');
		sUI.clearUI();
	}
}
