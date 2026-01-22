import * as THREE from 'three';
import { Creep } from '../environment/creeps/Creep';
import { Terrain } from '../environment/Terrain';
import { Main } from '../core/Main';
import { LevelDefinition, TerrainTypes } from '../data/LevelInterfaces';
import { TickCallback, TickService, TickTimeProperties } from '../core/TickService';
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
import { LevelCreator } from './LevelCreator';
import { InstancedMeshService } from '../game/InstancedMeshService';
import { PowersManager } from '../environment/powers/PowersManager';
import { UserLoadoutManager } from '../userData/UserLoadoutManager';
import { LightingService } from '../core/LightingService';
import { DebugService } from '../core/DebugService';

export class Level {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Path
	 * */
	levelDetails: LevelDefinition;
	userLoadoutManager: UserLoadoutManager;

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
		this.levelCameraManager = new LevelCameraManager(this.main);
		this.propManager = new SpritePropManager(this.main);
		this.towerManager = new TowerManager(this.main);
		this.creepManager = new CreepManager(this.main, this);
		this.waveManager = new WaveManager(this.main, this);
		this.heroManager = new HeroManager(this.main, this);
		this.powersManager = new PowersManager(this.main, this);
		this.userLoadoutManager = new UserLoadoutManager(this.main);

		this.setTerrain(levelDetails.terrain);
		this.setupLevel();
		if (this.main.debugMode) this.setupDebugs(levelDetails);
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
		this.setupUI();
		this.setupEconomy();
		this.setupHero();
		this.setupTowers();
		this.setupPowers();
		this.setupMainTick();

		/**
		 * New Instanced Mesh Generation
		 */
		const includedCreeps = [
			{
				difficulty: 0,
				chance: 0.4,
				name: 'CreepTrollDink'
			},
			{
				chance: 0.4,
				difficulty: 1,
				name: 'CreepLupine'
			},
			{
				chance: 0.1,
				difficulty: 2,
				name: 'CreepTroll',
			},
			{
				chance: 0.1,
				difficulty: 1,
				name: 'CreepWisp'
			}];
		await this.waveManager.createLevelWaves(1, includedCreeps);
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

		// Enable shadows
		setTimeout(() => {
			//this.main.renderer.physicallyCorrectLights = true;
			//this.main.renderer.outputEncoding = THREE.sRGBEncoding;
			this.main.renderer.shadowMap.enabled = true;
			this.main.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			this.terrain?.enableShadows();
			this.main.s('Lighting').addShadowsToLight(directionalLight);
		}, 100);
	}

	/**
	 * Setup a UI (towers defaulted, but in the future players should be able to choose)
	 */
	setupUI() {
		const sUI: UIService = this.main.s('UI');
		sUI.addEconomyLabel('money', 'commerce_money_changed');
		sUI.addEconomyLabel('power', 'power_changed');
		sUI.addEconomyLabel('hearts', 'hearts_changed');
	}

	/**
	 * Sets up the economy for the level
	 */
	setupEconomy() {
		const sEconomy: EconomyService = this.main.s('Economy');
		const sEvent: EventService = this.main.s('Event');

		const userEconomyData = this.userLoadoutManager.getEconomyData();
		sEconomy.setEconomyValue("money", userEconomyData.money.current);
		sEvent.fire('commerce_money_changed', userEconomyData.money.current);
		sEconomy.setEconomyValue("hearts", userEconomyData.hearts.current);
		sEvent.fire("hearts_changed", userEconomyData.hearts.current);
		sEconomy.setEconomyValue("power", userEconomyData.power.current);
		sEvent.fire("power_changed", userEconomyData.power.current);
	}

	/**
	 * Sets up the hero for the level
	 */
	async setupHero() {
		const heroUpgrades = await this.userLoadoutManager.userLoadout.heroUpgrades;
		this.heroManager.heroUpgrades = heroUpgrades;

		const heroes = await this.userLoadoutManager.getEquippedHeroes();
		heroes.forEach(hero => this.heroManager.createHero(hero.assetName, new THREE.Vector3(-28, 0, -20)));
	}

	/**
	 * Sets up towers for the level
	 */
	async setupTowers() {
		const towers = await this.userLoadoutManager.getEquippedTowers();
		await this.towerManager.setup(this.levelDetails, towers);

		const towerUpgrades = await this.userLoadoutManager.userLoadout.towerUpgrades;
		this.towerManager.towerUpgrades = towerUpgrades;
	}

	/**
	 * Sets up powers for the level
	 */
	async setupPowers() {
		const powers = await this.userLoadoutManager.getEquippedPowers();
		const powerUpgrades = await this.userLoadoutManager.userLoadout.powerUpgrades;
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
		sUI.removePowersUI();
		sUI.createPopup("lose-level", "Sorry, you lost the level.  Sad face", ['bubble-in']);
		sCamera.removeOrbitControls();
	}

	/**
	 * A creep passes the finish line
	 * */
	creepEscaped(creep: Creep) {
		console.log("A creep passed the line:", creep);

		const sEconomy = this.main.s('Economy');
		const vpValue = sEconomy.adjustEconomyValue('vp', -1 * creep.stats.activeStats.vp_loss!.value);

		if (vpValue <= 0) {
			this.loseLevel();
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
			max: 5,
			step: 0.01,
			name: `Tick Speed`,
		});

		sDebug.watchDrawCalls();
		sDebug.addTerrainPositionWatcher();

		// SOME DEBUG OBJECTS OFF TO THE LEFT
		this.propManager.registerProp({ assetName: 'MountainInitial', position: new THREE.Vector3(-90, 0, -50) }, levelDetails);
		this.propManager.registerProp({ assetName: 'TreeBulbous', position: new THREE.Vector3(-90, 0, -55) }, levelDetails);

		// Setup a Debug to initiate level creation
		const levelCreator = new LevelCreator(this.main, this);
		this.main.s('Debug').addLevelEditorLilGUI(levelCreator);

		/**
		 * DEBUG Objects
		 * */
		//sDebug.addDebugSphere({ position: new THREE.Vector3(0, 5, 30), scale: new THREE.Vector3(5, 5, 5) });
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
