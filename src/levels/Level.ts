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
		this.waveManager = new WaveManager(this, this.main);
		this.heroManager = new HeroManager(this.main, this);
		this.powersManager = new PowersManager(this.main, this);
		this.userLoadoutManager = new UserLoadoutManager(this.main);

		this.setTerrain(levelDetails.terrain);
		this.setupLevel();
		this.setupDebugs(levelDetails);
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
		const includedCreeps = [{
			difficulty: 2,
			name: 'CreepTroll',
		}, {
			difficulty: 1,
			name: 'CreepWisp'
		}, {
			difficulty: 1,
			name: 'CreepLupine'
		}, {
			difficulty: 0,
			name: 'CreepTrollDink'
		}];
		this.waveManager.createLevelWaves(1, includedCreeps);
		this.waveManager.startWaveTimer();
	}

	/**
	 * Sets up lights
	 */
	setupLights() {
		const ambientLight = this.main.s('Lighting').createAmbientLight("WorldAmbient");
		this.main.s('Lighting').enableLight(ambientLight);
		const directionalLight = this.main.s('Lighting').createDirectionalLight(true);
		this.main.s('Lighting').enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');

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
		//const heroes = this.userLoadoutManager.getEquippedHeroes();
		await this.heroManager.createDefaultHero(new THREE.Vector3(-28, 0, -20));
	}

	/**
	 * Sets up towers for the level
	 */
	async setupTowers() {
		const towers = await this.userLoadoutManager.getEquippedTowers();
		this.towerManager.setup(this.levelDetails, towers);
	}

	/**
	 * Sets up powers for the level
	 */
	async setupPowers() {
		const powers = await this.userLoadoutManager.getEquippedPowers();
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
		// SOME DEBUG OBJECTS OFF TO THE LEFT
		this.propManager.registerProp({ assetName: 'MountainInitial', position: new THREE.Vector3(-90, 0, -50) }, levelDetails);
		this.propManager.registerProp({ assetName: 'TreeBulbous', position: new THREE.Vector3(-90, 0, -55) }, levelDetails);

		// Setup a Debug to initiate level creation
		const levelCreator = new LevelCreator(this.main, this);
		this.main.s('Debug').addLevelCreatorLilGUI(levelCreator);

		/**
		 * DEBUG Objects
		 * */
		/*const mat = new THREE.MeshStandardMaterial();
		mat.roughness = 0.7;
		mat.color.set('#888888');
		const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere.position.y = 5;
		sphere.position.z = 2;
		sphere.castShadow = true;
		this.scene.add(sphere);

		const sphere2 = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere2.scale.set(2, 2, 2);
		sphere2.position.y = 2;
		sphere2.position.x = 4;
		sphere2.castShadow = true;
		sphere2.receiveShadow = true;
		this.scene.add(sphere2);

		const sphere3 = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere3.scale.set(4, 4, 4);
		sphere3.position.y = 5;
		sphere3.position.x = 15;
		sphere3.castShadow = true;
		sphere3.receiveShadow = true;
		this.scene.add(sphere3);

		const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(50, 50), mat);
		plane.rotation.x = Math.PI * -0.5;
		plane.position.y = 0.1;
		plane.receiveShadow = true;
		this.scene.add(plane);
		// END DEBUG THINGS*/
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
