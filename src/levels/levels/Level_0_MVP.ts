import * as THREE from 'three';
import { Vector3 } from 'three';
import { perspectiveCameraDefaults } from '../../config/cameraSettingsDefault';
import { orthographicCameraLevel } from '../../config/cameraSettingsLevel';
import { Maths } from '../../core/Maths';
import { Main } from '../../core/Main';
import { Level } from '../Level';
import { LevelPath } from '../LevelPath';
import { TreeCone1 } from '../../environment/props/TreeCone1';
import { Mountain_Type1 } from '../../environment/props/Mountain_Type1';
import { WaveManager } from '../WaveManager';
import { TowerArcher } from '../../environment/towers/TowerArcher';
import { TowerBomber } from '../../environment/towers/TowerBomber';
import { TowerMage } from '../../environment/towers/TowerMage';
import { levelDetails } from './Level_0_MVP_JSON';
import { EconomyService } from '../../game/EconomyService';
import { UIService } from '../../game/UIService';
import { EventService } from '../../core/EventService';
import { RaycasterOrders, RaycasterService } from '../../core/RaycasterService';
import { Man0 } from '../../environment/heroes/Man0';

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
			const levelPath = new LevelPath(path);
			this.levelPaths.push(levelPath);
			main.scene.add(levelPath.groupMain);
		});

		// Setup a Wave Manager
		this.waveManager = new WaveManager(levelDetails.waves, this, this.main);

		// Create 2 tree groups
		const position1 = { x: -60, z: -10 };
		const position2 = { x: 25, z: -25 };
		const position3 = { x: 30, z: 55 };
		const position4 = { x: -5, z: 15 };
		for (let i = 0; i < 200; i++) {
			const tree = new TreeCone1(main);

			const rando1 = (Math.random() - 0.5) * 30;
			const rando2 = (Math.random() - 0.5) * 30;

			let positionPick: Vector3;
			const positionRandom = Math.random();
			if (positionRandom < 0.25) {
				positionPick = new Vector3(position1.x, 0, position1.z);
			} else if (positionRandom < 0.5) {
				positionPick = new Vector3(position2.x, 0, position2.z);
			} else if (positionRandom < 0.75) {
				positionPick = new Vector3(position3.x, 0, position3.z);
			} else {
				positionPick = new Vector3(position4.x, 0, position4.z);
			}

			positionPick.x += rando1;
			positionPick.z += rando2;

			tree.groupMain.rotation.y = Math.PI * Math.random();
			//tree.groupMain.rotation.x = Math.PI * -0.07; // Fake an Orthographic look
			//tree.groupMain.rotation.x = Math.PI * -0.35; // Fake an Orthographic look

			tree.groupMain.traverse((child) => (child.castShadow = true));

			this.addProp(tree, positionPick);

			const scale = Math.random() * 2 + 0.5;
			tree.groupMain.scale.set(scale, scale, scale);
		}

		// Create Mountains
		const mountain1 = new Mountain_Type1(main);
		this.addProp(mountain1, new Vector3(50, 0, -60));
		mountain1.groupMain.rotation.y = Math.PI * 0.75;
		mountain1.groupMain.position.y = -2;
		mountain1.groupMain.scale.set(3, 3, 3);
		const mountain2 = new Mountain_Type1(main);
		this.addProp(mountain2, new Vector3(-80, 0, 0));
		mountain2.groupMain.rotation.y = Math.PI * -0.5;
		mountain2.groupMain.scale.set(2, 2, 2);

		// LISTEN TO CLICKS ON TERRAIN TO HELP CREATE PATHS
		const sRaycaster: RaycasterService = this.main.s('Raycaster');
		sRaycaster.enableRaycaster();
		sRaycaster.addRaycasterSubjects([{ order: RaycasterOrders.terrain, object: this.terrain }]); // Listen to clicks on terrain
		sRaycaster.addRaycasterSubjects(this.levelPaths.map(path => { return { order: RaycasterOrders.props, object: path } })); // Listen to clicks on level paths
		sRaycaster.addClickHandler(
			this.terrain,
			(event: any) => {
				console.log("EP", event.object);
				console.log({
					x: Maths.roundQuarter(event.point.point.x),
					y: Maths.roundQuarter(event.point.point.y),
					z: Maths.roundQuarter(event.point.point.z),
				})},
			() => {}
		);

		// Create Lights (maybe temp, if we can get MatCaps to work
		const ambientLight = this.main.s('Lighting').createAmbientLight("WorldAmbient");
		this.main.s('Lighting').enableLight(ambientLight);
		const directionalLight = this.main.s('Lighting').createDirectionalLight(true);
		this.main.s('Lighting').enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');

		// Setup a UI (towers defaulted, but in the future players should be able to choose)
		const sUI: UIService = this.main.s('UI');
		TowerArcher.setup(this.main);
		TowerBomber.setup(this.main);
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
		this.addHero(HeroMan0, new Vector3(-20, 0, 50));

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
