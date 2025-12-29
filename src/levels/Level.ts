import * as THREE from 'three';
import { Creep } from '../environment/creeps/Creep';
import { Terrain } from '../environment/Terrain';
import { Main } from '../core/Main';
import { LevelDefinition, TerrainTypes } from '../data/LevelInterfaces';
import { TickCallback, TickService, TickTimeProperties } from '../core/TickService';
import { UIService } from '../game/UIService';
import { CameraService } from '../core/CameraService';
import { PropManager } from '../environment/propManager/PropManager';
import { TowerManager } from '../environment/towers/TowerManager';
import { CreepManager } from '../environment/creeps/CreepManager';
import { WaveManager } from './WaveManager';
import { LevelCameraManager } from './LevelCameraManager';
import { TowerMage } from '../environment/towers/TowerMage';
import { TowerBomber } from '../environment/towers/TowerBomber';
import { TowerArcher } from '../environment/towers/TowerArcher';
import { EconomyService } from '../game/EconomyService';
import { EventService } from '../core/EventService';
import { HeroManager } from '../environment/heroes/HeroManager';
import { LevelCreator } from './LevelCreator';

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
	terrain: Terrain | null;
	waveManager: WaveManager;
	propManager: PropManager;
	towerManager: TowerManager;
	creepManager: CreepManager;
	heroManager: HeroManager;

	/**
	 * Constructor
	 */
	constructor(levelDetails: LevelDefinition, main: Main) {
		this.levelDetails = levelDetails;
		this.main = main;
		this.main.s('Level').currentLevel = this;
		this.levelCameraManager = new LevelCameraManager(this.main);
		this.propManager = new PropManager(this.main);
		this.towerManager = new TowerManager(this.main);
		this.creepManager = new CreepManager(this.main);
		this.waveManager = new WaveManager(this, this.main);
		this.heroManager = new HeroManager(this.main);

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
			console.log("REMOVING FIRST");
			this.terrain.removeFromScene();
			this.terrain = null;
		}
		console.log(terrainType);
		this.terrain = new Terrain(terrainType, this.main);
		this.terrain.addToScene();
	}

	/**
	 * Sets up all the assets required for the level
	 */
	setupLevel() {
		this.levelCameraManager.setup();
		this.creepManager.setupCreepPaths(this.levelDetails);
		this.propManager.setup(this.levelDetails);
		this.towerManager.setup(this.levelDetails, [TowerArcher, TowerMage, TowerBomber]);
		this.waveManager.setup(this.levelDetails);
		this.setupLights();
		this.setupUI();
		this.setupEconomy();
		this.setupHero();
		this.setupMainTick();
		this.waveManager.startWaveTimer();
		this.propManager.render();
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
		sUI.addEconomyLabel('vp', 'vp_changed');
	}

	/**
	 * Sets up the economy for the level
	 */
	setupEconomy() {
		const sEconomy: EconomyService = this.main.s('Economy');
		const sEvent: EventService = this.main.s('Event');
		sEconomy.setEconomyValue("money", 600);
		sEvent.fire('commerce_money_changed', 600);
		sEconomy.setEconomyValue("vp", 20);
		sEvent.fire("vp_changed", 20);
	}

	/**
	 * Sets up the hero for the level
	 */
	setupHero() {
		this.heroManager.createDefaultHero(new THREE.Vector3(-28, 0, -20));
	}

	/**
	 * Registers callback for tick
	 * */
	setupMainTick() {
		this.main.s('Tick').start();
		this.main.s('Tick').registerCallback(new TickCallback("Level", this.gameplayTickCallback.bind(this)));
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
		const vpValue = sEconomy.adjustEconomyValue('vp', -1 * creep.stats.vp_loss);

		if (vpValue <= 0) {
			this.loseLevel();
		}
	}

	/**
	 * Debug objects and helpers
	 */
	setupDebugs(levelDetails: LevelDefinition) {
		// SOME DEBUG OBJECTS OFF TO THE LEFT
		this.propManager.registerProp({ assetName: 'mountain_2', position: new THREE.Vector3(-130, 0, -50) }, levelDetails);
		this.propManager.registerProp({ assetName: 'mountain_3', position: new THREE.Vector3(-110, 0, -50) }, levelDetails);
		this.propManager.registerProp({ assetName: 'mountain_4', position: new THREE.Vector3(-150, 0, -15) }, levelDetails);
		this.propManager.registerProp({ assetName: 'mountain_5', position: new THREE.Vector3(-130, 0, -15) }, levelDetails);
		this.propManager.registerProp({ assetName: 'mese_1', position: new THREE.Vector3(-110, 0, -15) }, levelDetails);

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

		/**
		 * DEBUG SOME TREES
		 */
		const loader = new THREE.TextureLoader();
		const texture = loader.load('assets/temp/spritesheet-tree.png');
		texture.colorSpace = THREE.SRGBColorSpace;

		// 2. Create the material (specifically SpriteMaterial)
		const material = new THREE.SpriteMaterial({ map: texture });

		// 3. Create the Sprite
		const sprite = new THREE.Sprite(material);

		// 4. Scale it (since it has no geometry, it defaults to 1x1 unit)
		sprite.scale.set(4, 4, 1);
		sprite.position.set(0, 2, 0);

		const cols = 1; // Number of horizontal frames
		const rows = 1; // Number of vertical frames

		// Tell the texture to only show 1/4th of the width and height
		texture.repeat.set(1 / cols, 1 / rows);

		for (let x = 0; x < 125; x++) {
			const posX = Math.random() * 20 - 55;
			const posZ = Math.random() * 20 - 15;
			const scale = 2 + (Math.random() * 2);
			const trollClone = sprite.clone();
			sprite.position.x = posX;
			sprite.position.z = posZ;
			sprite.scale.set(scale, scale, scale);
			this.main.scene.add(trollClone);
		}

		/**
		 * DEBUG SOME Mountains
		 */
		const texture2 = loader.load('assets/temp/spritesheet-mountain.png');
		texture2.colorSpace = THREE.SRGBColorSpace;

		// 2. Create the material (specifically SpriteMaterial)
		const material2 = new THREE.SpriteMaterial({ map: texture2 });
		material2.color.set(0x99AACA);

		// 3. Create the Sprite
		const sprite2 = new THREE.Sprite(material2);

		// 4. Scale it (since it has no geometry, it defaults to 1x1 unit)
		sprite2.scale.set(4, 4, 1);
		sprite2.position.set(0, 2, 0);

		const cols2 = 1; // Number of horizontal frames
		const rows2 = 1; // Number of vertical frames

		// Tell the texture to only show 1/4th of the width and height
		texture2.repeat.set(1 / cols2, 1 / rows2);

		for (let x = 0; x < 50; x++) {
			const posX = Math.random() * 20 - 50;
			const posZ = Math.random() * 20 + 10;
			const scale = 0 + (Math.random() * 14);
			const mountainClone = sprite2.clone();
			sprite2.position.x = posX;
			sprite2.position.z = posZ;
			sprite2.scale.set(scale, scale, scale);
			this.main.scene.add(mountainClone);
		}
	}

	/**
	 * Removes all assets from the scene and UI
	 */
	disposeLevel() {
		console.log("%c Disposing the Level has not been fully tested.  Check registered objects in debugger", "color: red");
		this.terrain?.removeFromScene();
		this.terrain = null;

		this.waveManager.disposeWaves();
		this.propManager.disposeProps();
		this.towerManager.disposeTowers();
		this.creepManager.disposeCreeps();
		this.heroManager.disposeHeroes();

		const sUI: UIService = this.main.s('UI');
		sUI.clearUI();
	}
}
