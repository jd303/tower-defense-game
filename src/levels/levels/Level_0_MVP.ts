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
		this.propManager.registerProp('tree_cone', { position: new Vector3(-46, 0, -28) });
		this.propManager.registerProp('tree_cone', { position: new Vector3(-42, 0, -22), scale: new Vector3(0.75, 0.75, 0.75) });
		this.propManager.registerProp('mountain_1', { position: new Vector3(55, 0, -50), rotate: new Vector3(0, 1.5, 0) });
		this.propManager.registerProp('mountain_1', { position: new Vector3(-65, 0, -20), scale: new Vector3(1, 0.5, 1), rotate: new Vector3(0, 3, 0) });
		this.propManager.registerProp('mesa_1', { position: new Vector3(50, 0, 10) });

		console.log("NEXT UP, shift zone definition here to Level JSON - OR Remove the zones altogether (sigh) in favour of curated placements");
		const points = [
			{ point: new Vector3(-19.84615384615385, 6.8441556963370904e-15, -30.823337043689378) },
			{ point: new Vector3(-21.815384615384612, 5.316442371261847e-15, -23.943127882151572) },
			{ point: new Vector3(-6.738461538461536, 1.8763440423926226e-14, -20.503023301382655) },
			{ point: new Vector3(5.815384615384609, 3.2998607821625255e-15, -14.861251788921663) },
			{ point: new Vector3(23.66153846153846, 1.7721474570872824e-15, -7.981042627383857) },
			{ point: new Vector3(32.76923076923077, -1.527713325075262e-16, 0.6880209161537891) },
			{ point: new Vector3(36.03076923076924, -2.536004119624901e-15, 11.421147208152746) },
			{ point: new Vector3(43.29230769230769, -4.1659278252747664e-15, 18.76167100155982) },
			{ point: new Vector3(46.861538461538466, 1.2559047120313733e-15, -5.656091993117343) },
			{ point: new Vector3(46, -7.931331155045169e-15, -28.280459965586573) },
			{ point: new Vector3(39.29230769230769, 2.338575901792219e-14, -41.32009559889059) },
			{ point: new Vector3(31.415384615384617, 1.2438460866775026e-14, -56.0178477246705) },
			{ point: new Vector3(26.676923076923075, -2.388159237871287e-15, -53.244686946221464) },
			{ point: new Vector3(21.076923076923077, 9.575151805858994e-15, -43.122650104882496) },
			{ point: new Vector3(12.338461538461534, 8.046283903728754e-15, -36.23724119055004) },
			{ point: new Vector3(-1.4461538461538452, 8.107705918261034e-15, -36.51386135230996) },
			{ point: new Vector3(-7.415384615384617, -6.133859804207103e-15, -36.37555127143003) },
			{ point: new Vector3(-17.200000000000003, 7.199032143013888e-15, -32.42155847670557) }
		];
		this.propManager.registerPropZone('tree_cone', { zonePathPoints: points, densityUnits: 6, zoneStrategy: PropZoneStrategy.centerOut, positionRandom: 3, scaleRandom: 0.5, rotateRandom: 0.5 });

		const points2 = [
			{ point: new Vector3(-22.676923076923078, 1.222170660060197e-15, -5.504167329230256) },
			{ point: new Vector3(-27.6, -3.238752249159519e-15, 14.586043422460165) },
			{ point: new Vector3(-36.03076923076924, 9.945740573000233e-16, 27.520836646151253) },
			{ point: new Vector3(-60.58461538461539, -1.3716737249643898e-17, 32.061774692766235) },
			{ point: new Vector3(-61.01538461538462, -1.258835779862002e-14, 56.692923491071596) },
			{ point: new Vector3(-54.800000000000004, -1.686595510883069e-14, 75.95750914337741) },
			{ point: new Vector3(-43.723076923076924, -2.6018518322032526e-14, 85.17698941983811) },
			{ point: new Vector3(-33.2, -1.021884174875227e-14, 78.02157189183879) },
			{ point: new Vector3(-23.16923076923077, -1.9096416563440557e-14, 86.00261451922266) },
			{ point: new Vector3(-10.430769230769233, -1.741593190585778e-14, 78.43438444153104) },
			{ point: new Vector3(-11.538461538461542, -5.9246147156408025e-15, 58.682092625673675) },
			{ point: new Vector3(-13.384615384615387, -9.828918077278856e-15, 44.26551179028819) },
			{ point: new Vector3(-5.87692307692308, -5.658463832669018e-15, 25.483455608297618) },
			{ point: new Vector3(2.0615384615384627, 1.0927914508210714e-14, 14.785048292885591) },
			{ point: new Vector3(9.384615384615389, -2.3136911934986215e-15, 10.41993879689079) },
			{ point: new Vector3(5.938461538461536, -5.455572113117919e-16, 2.456971253573073) },
			{ point: new Vector3(-10.615384615384615, 1.0031286304418399e-15, -4.517689726262546) },
			{ point: new Vector3(-20.615384615, 1.1031286304418399e-15, -4.517689726262546) },
			{ point: new Vector3(-22.676923076923078, 1.222170660060197e-15, -5.504167329230256) }
		];
		this.propManager.registerPropZone('tree_cone', { zonePathPoints: points2, densityUnits: 6, zoneStrategy: PropZoneStrategy.centerOut, positionRandom: 3, scaleRandom: 0.5, rotateRandom: 0.5 });

		const rockPoints = [
			{ point: new Vector3(-23.378307177266624, 1.706311195879317e-15, -7.684542465940197) },
			{ point: new Vector3(-24.045651885529978, 1.4392697459890206e-14, -0.818946917217815) },
			{ point: new Vector3(-18.03954951115977, 1.4007533288607849e-14, 0.9156783010458724) },
			{ point: new Vector3(-15.164833844794547, -1.3172516941302624e-14, -4.676257611617956) },
			{ point: new Vector3(-20.400923094245496, 1.922947762375663e-15, -8.660186826087966) }
		];
		this.propManager.registerPropZone('rock_1', { zonePathPoints: rockPoints, densityUnits: 2, zoneStrategy: PropZoneStrategy.centerOut, positionRandom: 1.5, scaleRandom: 0.5, rotateRandom: 0.5 });

		this.propManager.render();

		this.propManager.registerProp('tree_cone', { position: new Vector3(-50, 0, -28) });
		this.propManager.registerProp('tree_cone', { position: new Vector3(-50, 0, -30) });
		this.propManager.registerProp('tree_cone', { position: new Vector3(-50, 0, -32) });
		this.propManager.registerProp('tree_cone', { position: new Vector3(-50, 0, -35) });
		this.propManager.registerProp('tree_cone', { position: new Vector3(-50, 0, -38) });

		// Setup a Wave Manager
		this.waveManager = new WaveManager(levelDetails.waves, this, this.main);

		// LISTEN TO CLICKS ON TERRAIN TO HELP CREATE PATHS
		this.main.s('Debug').listenToTerrainLocationClicks(this.terrain);

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
