import * as THREE from 'three';
import { Vector3 } from 'three';
import { perspectiveCameraDefaults } from '../../config/cameraSettingsDefault';
import { orthographicCameraLevel } from '../../config/cameraSettingsLevel';
import { Main } from '../../core/Main';
import { Level } from '../Level';
import { LevelPath } from '../LevelPath';
import { WaveManager } from '../WaveManager';
import { TowerArcher } from '../../environment/towers/TowerArcher';
import { TowerBomber } from '../../environment/towers/TowerBomber';
import { TowerMage } from '../../environment/towers/TowerMage';
import { levelDetails } from './Level_0_MVP_JSON';
import { EconomyService } from '../../game/EconomyService';
import { UIService } from '../../game/UIService';
import { EventService } from '../../core/EventService';
import { Man0 } from '../../environment/heroes/Man0';
import { PropManager, PropZoneStrategy } from '../../environment/PropManager';

export class Level0MVP extends Level {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Level Properties
	 * */
	waveManager: WaveManager;
	lights: THREE.Light[];
	levelPaths: LevelPath[] = [];

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		super(main);

		console.log('TODO:: Convert Creep to ModelAsset');

		// Setup cameras
		main.s('Camera').createPerspectiveCamera(false, perspectiveCameraDefaults);
		main.s('Camera').createOrthographicCamera(true, orthographicCameraLevel);
		const cameraDebug = {
			changeMain: main.s('Camera').switchCameras.bind(main.s('Camera')),
		};
		main.s('Debug').addGUIDebugProperty(cameraDebug, 'changeMain');

		// Start basic shit
		main.s('Tick').start();

		// Setup OrbitControls
		this.main.s('Camera').setupOrbitControls();

		// Create the environment
		this.addTerrain(levelDetails);

		// Create LevelPaths
		levelDetails.paths.forEach((path) => {
			const levelPath = new LevelPath(path, main);
			this.levelPaths.push(levelPath);
			main.scene.add(levelPath.groupMain);
		});

		// Setup a Prop Manager
		this.propManager = new PropManager(levelDetails.terrain, this.main);
		this.propManager.registerProp('tree_cone', { position: new Vector3(-16, 0, -28) });
		this.propManager.registerProp('tree_cone', { position: new Vector3(-10, 0, -30) });
		this.propManager.registerProp('tree_cone', { position: new Vector3(-12, 0, -22), scale: new Vector3(0.75, 0.75, 0.75) });
		this.propManager.registerProp('mountain_1', { position: new Vector3(55, 0, -50), rotate: new Vector3(0, 1.5, 0) });
		this.propManager.registerProp('mountain_1', { position: new Vector3(-65, 0, -20), scale: new Vector3(1, 0.5, 1), rotate: new Vector3(0, 3, 0) });
		this.propManager.registerProp('mesa_1', { position: new Vector3(50, 0, 10) });
		this.propManager.registerPropZone('tree_cone', { zonePath: [], count: 50, zoneStrategy: PropZoneStrategy.centerOut, scaleRandom: 0.5, rotateRandom: 0.5 });
		this.propManager.render();

		// Setup a Wave Manager
		this.waveManager = new WaveManager(levelDetails.waves, this, this.main);

		// LISTEN TO CLICKS ON TERRAIN TO HELP CREATE PATHS
		this.main.s('Debug').listenToTerrainClicks(this.terrain);

		// Create Lights (maybe temp, if we can get MatCaps to work
		const ambientLight = this.main.s('Lighting').createAmbientLight("WorldAmbient");
		this.main.s('Lighting').enableLight(ambientLight);
		const directionalLight = this.main.s('Lighting').createDirectionalLight(true);
		this.main.s('Lighting').enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');

		// Setup a UI (towers defaulted, but in the future players should be able to choose)
		const sUI: UIService = this.main.s('UI');
		TowerArcher.setupUI(this.main);
		TowerBomber.setupUI(this.main);
		TowerMage.setupUI(this.main);
		//sUI.addLevelUIButtons(this.terrain, [TowerArcher, TowerBomber, TowerMage]);
		sUI.addEconomyLabel('money', 'commerce_money_changed');
		sUI.addEconomyLabel('vp', 'vp_changed');

		// Setup Economy for this level
		const sEconomy: EconomyService = this.main.s('Economy');
		const sEvent: EventService = this.main.s('Event');
		sEconomy.setEconomyValue("money", 600);
		sEvent.fire('commerce_money_changed', 600);
		sEconomy.setEconomyValue("vp", 20);
		sEvent.fire("vp_changed", 20);

		// Create a Hero
		const HeroMan0 = new Man0(this.main);
		this.addHero(HeroMan0, new Vector3(-5, 0, 50));

		// Enable shadows
		setTimeout(() => {
			//this.main.renderer.physicallyCorrectLights = true;
			//this.main.renderer.outputEncoding = THREE.sRGBEncoding;
			this.main.renderer.shadowMap.enabled = true;
			this.main.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			/*this.props.forEach((prop) => prop.enableShadows(true, false));
			this.towers.forEach((tower) => tower.enableShadows(true, true));
			this.creeps.forEach((creep) => creep.enableShadows(true, true));*/

			this.terrain.enableShadows();

			this.main.s('Lighting').addShadowsToLight(directionalLight);
		}, 1000);


		/**
		 * DEBUG THINGS
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
}
