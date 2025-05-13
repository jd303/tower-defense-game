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
import { PropManager } from '../../environment/props_manager/PropManager';
import { CameraService } from '../../core/CameraService';

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

		// Setup cameras
		main.s('Camera').createPerspectiveCamera(false, perspectiveCameraDefaults);
		main.s('Camera').createOrthographicCamera(true, orthographicCameraLevel);
		const cameraDebug = {
			changeMainCam: () => {
				const sCamera: CameraService = this.main.s('Camera');
				sCamera.switchCameras();
				sCamera.resetOrbitControls();
			}
		};
		main.s('Debug').addGUIDebugProperty(cameraDebug, 'changeMainCam');

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

		this.propManager.registerProp('mountain_4', { position: new Vector3(65, 0, 72), scale: new Vector3(1.25, 0.75, 1.25), rotate: new Vector3(0, -1, 0) });
		this.propManager.registerProp('mountain_5', { position: new Vector3(50, 0, 85), scale: new Vector3(1, 1, 1), rotate: new Vector3(0, 1.5, 0) });
		this.propManager.registerProp('mountain_5', { position: new Vector3(60, 0, 55), scale: new Vector3(1, 0.75, 1), rotate: new Vector3(0, -0.5, 0) });

		console.log("NEXT UP, shift zone definition here to Level JSON - OR Remove the zones altogether (sigh) in favour of curated placements");
		const treePoints1 = [
			{ point: new Vector3(-19.571, 0, -21.928) },
			{ point: new Vector3(6.928571428571427, 0, -15.000000000000002) },
			{ point: new Vector3(20.928571428571427, 0, -18.0000000000000) },
			{ point: new Vector3(32.9285714285714, 0, -12.000000000000002) },
			{ point: new Vector3(35.14285714285714, 0, 10.214285714285714) },
			{ point: new Vector3(45.42857142857142, 0, 15.57142857142857) },
			{ point: new Vector3(72.14285714285714, 0, 9.999999999999998) },
			{ point: new Vector3(56.07142857142857, 0, -29.07142857142857) },
			{ point: new Vector3(41.57142857142857, 0, -42.785714285714285) },
			{ point: new Vector3(23.64285714285714, 0, -48.57142857142857) },
			{ point: new Vector3(13.928571428571423, 0, -40.857142857142854) },
			{ point: new Vector3(-11.357142857142861, 0, -35.785714285714285) },
			{ point: new Vector3(-12.214285714285719, 0, -26.357142857142854) },
			{ point: new Vector3(-20.500000000000004, 0, -22.857142857142854) },
			{ point: new Vector3(-19.571, 0, -21.928) },
		];
		const treeControlPoints1 = [
			{ point: new Vector3(1.5076923076923125, 0, -27.2000000000136) },
			{ point: new Vector3(11.07668269230769, 0, -27.571875000013776) },
			{ point: new Vector3(30.092067307692307, 0, -34.89495192309436) },
			{ point: new Vector3(44.36899038461537, 0, -20.618028846164147) },
			{ point: new Vector3(55.507451923076914, 0, -4.618028846156149) },
		]
		this.propManager.registerPropZone(['tree_cone'], {
			zonePathPoints: treePoints1,
			propDensityFactor: 4,
			propScale: 3,
			positionRandom: 1.5,
			scaleRandom: { all: 0.25 },
			rotateRandom: 0.5,
			environmentTileDistance: 2,
			environmentTileColour: 0x6B8B42,
			dynamicScaling: {
				scalePoints: treeControlPoints1,
				attentuationDistance: 15,
				attenuatedScale: 0.75
			}
		});

		const treePoints2 = [
			{ point: new Vector3(-35.4285, 0, 27.7857) },
			{ point: new Vector3(-19.78571428571429, 0, 5.214285714285714) },
			{ point: new Vector3(-10, 0, -1.5) },
			{ point: new Vector3(0, 0, -1) },
			{ point: new Vector3(16.7142, 0, 8) },
			{ point: new Vector3(9.8571428, 0, 13.42857) },
			{ point: new Vector3(14.71428, 0, 19.5714) },
			{ point: new Vector3(3.571, 0, 30) },
			{ point: new Vector3(-3, 0, 40.6428) },
			{ point: new Vector3(-9.78571, 0, 48.142) },
			{ point: new Vector3(-5, 0, 71) },
			{ point: new Vector3(-10, 0, 81) },
			{ point: new Vector3(-60.3571, 0, 86.42857142857143) },
			{ point: new Vector3(-85, 0, 60) },
			{ point: new Vector3(-80.5, 0, 38) },
			{ point: new Vector3(-60.5714, 0, 29.7857) },
			{ point: new Vector3(-36.8571, 0, 29.2857) },
			{ point: new Vector3(-35.4285, 0, 27.7857) }
		];
		const treeControlPoints2 = [
			{ point: new Vector3(-52.66225961538462, 0, 49.18698069092138) },
			{ point: new Vector3(-7.659014423076934, 0, 21.8194081950816) },
			{ point: new Vector3(-25.295432692307653, 0, 57.686420062091976) }
		]
		this.propManager.registerPropZone(['tree_cone'],
			{
				zonePathPoints: treePoints2,
				propDensityFactor: 4,
				propScale: 3,
				positionRandom: 3,
				scaleRandom: { all: 0.25, y: 0.25 },
				rotateRandom: 0.5,
				environmentTileDistance: 2,
				environmentTileColour: 0x6B8B42,
				dynamicScaling:
				{
					scalePoints: treeControlPoints2,
					attentuationDistance: 25,
					attenuatedScale: 0.75
				}
			});

		const treePoints3 = [
			{ point: new Vector3(-95.40783942269796, 0, -56.880699061193134) },
			{ point: new Vector3(-75, 0, -60) },
			{ point: new Vector3(-65.60518129642527, 0, -56) },
			{ point: new Vector3(-55.72677214221129, 0, -50.350903179590794) },
			{ point: new Vector3(-51.45729021962728, 0, -41.728224002603085) },
			{ point: new Vector3(-41.83002706085942, 0, -37.45874208001695) },
			{ point: new Vector3(-35.37477854750678, 0, -33.10554482561538) },
			{ point: new Vector3(-35.62592454295289, 0, -21.971405694165238) },
			{ point: new Vector3(-36.630508524737365, 0, -13.516157180808358) },
			{ point: new Vector3(-38.04908518381423, 0, -6.400353976498126) },
			{ point: new Vector3(-42.99287374270569, 0, -3.3866020311432017) },
			{ point: new Vector3(-45.34607099710507, 0, 2.138609868674172) },
			{ point: new Vector3(-49.448122256058326, 0, 9.924135727507727) },
			{ point: new Vector3(-56.06163346947278, 0, 14.69590964098636) },
			{ point: new Vector3(-55.326531410272324, 0, 18.044522913602947) },
			{ point: new Vector3(-55.833407382949034, 0, 27.67178607237563) },
			{ point: new Vector3(-68.61893324177869, 0, 28.425224058714356) },
			{ point: new Vector3(-83.0179703140228, 0, 24.49060346338987) },
			{ point: new Vector3(-96.16127740903632, 0, 9.254413072984413) },
			{ point: new Vector3(-90.71978084103709, 0, -5.060908667451491) },
			{ point: new Vector3(-83.10168564583817, 0, -9.832682580930118) },
			{ point: new Vector3(-74.81386779611627, 0, -7.237507294652269) },
			{ point: new Vector3(-67.53063392817884, 0, -8.158375944621833) },
			{ point: new Vector3(-57.317363446703375, 0, -10.16754390819178) },
			{ point: new Vector3(-50.11784491058132, 0, -21.552797276420655) },
			{ point: new Vector3(-50.368990906027435, 0, -30.594139154187932) },
			{ point: new Vector3(-54.55475749679608, 0, -37.040281048522004) },
			{ point: new Vector3(-60.66597671931828, 0, -40.054142794180464) },
			{ point: new Vector3(-76.9067510915006, 0, -39.719276488087914) },
			{ point: new Vector3(-95.40783942269796, 0, -56.880699061193134) },
		];
		const treeControlPoints3 = [
			{ point: new Vector3(-74.33028846153846, 0, -51.90823840722425) },
			{ point: new Vector3(-72.49903846153845, 0, 7.807626978579599) },
			{ point: new Vector3(-48.99134615384614, 0, -32.00775763682493) }
		]
		this.propManager.registerPropZone(['tree_cone'],
			{
				zonePathPoints: treePoints3,
				propDensityFactor: 4,
				propScale: 3,
				positionRandom: 3,
				scaleRandom: { all: 0.5 },
				rotateRandom: 0.5,
				environmentTileDistance: 2,
				environmentTileColour: 0x6B8B42,
				dynamicScaling: {
					scalePoints: treeControlPoints3,
					attentuationDistance: 30,
					attenuatedScale: 0.75
				}
			});

		const rockPoints = [
			{ point: new Vector3(-23.37830, 0, -7.6845) },
			{ point: new Vector3(-24.0456, 0, 0) },
			{ point: new Vector3(-22.039549, 0, 1) },
			{ point: new Vector3(-18.164833, 0, -4.6762) },
			{ point: new Vector3(-22.400923, 0, -8.6601) },
			{ point: new Vector3(-23.37830, 0, -7.6845) },
		];
		this.propManager.registerPropZone(['rubble_1'],
			{
				zonePathPoints: rockPoints,
				propDensityFactor: 1.5,
				propScale: 3,
				positionRandom: 1.5,
				scaleRandom: { all: 1 },
				rotateRandom: 0.75,
				environmentTileDistance: 1,
				environmentTileColour: 0x9E8D51
			});

		const rockPoints2 = [
			{ point: new Vector3(95.3855, 0, 46.3055) },
			{ point: new Vector3(72.43173076923077, 0, 29.27475961540275) },
			{ point: new Vector3(48.73942307692308, 0, 36.58245192309521) },
			{ point: new Vector3(34.1548076923077, 0, 36.70552884617219) },
			{ point: new Vector3(28.493269230769236, 0, 42.367067307713484) },
			{ point: new Vector3(24.800961538461543, 0, 51.536298076948846) },
			{ point: new Vector3(29.908653846153847, 0, 58.182451923106015) },
			{ point: new Vector3(36.49326923076923, 0, 64.27475961541674) },
			{ point: new Vector3(35.07788461538462, 0, 71.96706728165677) },
			{ point: new Vector3(30.400961538461537, 0, 79.47475961542435) },
			{ point: new Vector3(32.33317307692306, 0, 90.40528846158365) },
			{ point: new Vector3(42.36394230769229, 0, 105.55913461543288) },
			{ point: new Vector3(57.3793269230769, 0, 105.05145799448269) },
			{ point: new Vector3(82.85745192307694, 0, 100.75024610613912) },
			{ point: new Vector3(95.3855, 0, 46.3055) },
		];
		const rockControlPoints3 = [
			{ point: new Vector3(59.28293269230771, 0, 54.36514668020505) },
			{ point: new Vector3(63.529086538461556, 0, 70.36514668021304) },
			{ point: new Vector3(49.806009615384625, 0, 84.94976206483574) },
		]
		this.propManager.registerPropZone(['rubble_1'], {
			zonePathPoints: rockPoints2,
			propDensityFactor: 1.5,
			propScale: 6,
			positionRandom: 5.5,
			scaleRandom: { all: 0.5, y: 0.5 },
			rotateRandom: 3,
			environmentTileDistance: 2,
			environmentTileColour: 0x9E8D51,
			dynamicScaling: {
				scalePoints: rockControlPoints3,
				attentuationDistance: 25,
				attenuatedScale: 0.25
			}
		});

		const mountainPoints1 = [
			{ point: new Vector3(12, 0, -104) },
			{ point: new Vector3(-80, 0, -104) },
			{ point: new Vector3(-70, 0, -75) },
			{ point: new Vector3(-50, 0, -60) },
			{ point: new Vector3(-11, 0, -77) },
			{ point: new Vector3(5, 0, -76) },
			{ point: new Vector3(12, 0, -104) },
		];
		this.propManager.registerPropZone(['mountain_1', 'mountain_2'], {
			zonePathPoints: mountainPoints1,
			propDensityFactor: 6,
			propScale: 0.65,
			positionRandom: 5.5,
			scaleRandom: { all: 0.1, y: 0.5 },
			rotateRandom: 0.75,
			environmentTileDistance: 6,
			environmentTileColour: 0x9E8D51,
		});

		const mountainPoints2 = [
			{ point: new Vector3(35, 0, -99) },
			{ point: new Vector3(35, 0, -71) },
			{ point: new Vector3(38, 0, -55) },
			{ point: new Vector3(107, 0, -50) },
			{ point: new Vector3(116, 0, -99) },
			{ point: new Vector3(35, 0, -99) },
		];
		this.propManager.registerPropZone(['mountain_1', 'mountain_2'], {
			zonePathPoints: mountainPoints2,
			propDensityFactor: 6,
			propScale: 0.6,
			positionRandom: 5.5,
			scaleRandom: { all: 0.1, y: 0.5 },
			rotateRandom: 0.75,
			environmentTileDistance: 6,
			environmentTileColour: 0x9E8D51,
		});

		const mountainPoints3 = [
			{ point: new Vector3(-93.89255, 0, -51.47957) },
			{ point: new Vector3(-100.16947, 0, -1.01802) },
			{ point: new Vector3(-83.43101, 0, -11.60264) },
			{ point: new Vector3(-75.12332, 0, -8.64879) },
			{ point: new Vector3(-58.56947, 0, -11.29495) },
			{ point: new Vector3(-51.43101, 0, -22.00265) },
			{ point: new Vector3(-53.58486, 0, -30.18727) },
			{ point: new Vector3(-61.89255, 0, -38.67957) },
			{ point: new Vector3(-79.43101, 0, -36.64880) },
			{ point: new Vector3(-93.89255, 0, -51.47957) },
		];
		this.propManager.registerPropZone(['mountain_3', 'mountain_5'], {
			zonePathPoints: mountainPoints3,
			propDensityFactor: 6,
			propScale: 0.8,
			positionRandom: 5.5,
			scaleRandom: { y: 0.25 },
			rotateRandom: 0.75,
			environmentTileDistance: 2,
			environmentTileColour: 0x9E8D51,
		});

		const mesaPoints1 = [
			{ point: new Vector3(28.870673076923076, 0, 93.5919078742053) },
			{ point: new Vector3(27.70144230769231, 0, 73.71498479727228) },
			{ point: new Vector3(20.316826923076924, 0, 70.3919078741937) },
			{ point: new Vector3(14.43701923076922, 0, 72.79190787419489) },
			{ point: new Vector3(8.206249999999997, 0, 82.82267710496916) },
			{ point: new Vector3(10.470673076923076, 0, 92.60729248958941) },
			{ point: new Vector3(28.870673076923076, 0, 93.5919078742053) },
		];
		this.propManager.registerPropZone(['mesa_1'], {
			zonePathPoints: mesaPoints1,
			propDensityFactor: 3,
			propScale: 1,
			positionRandom: 2,
			scaleRandom: { all: 0.5, y: 0.5 },
			rotateRandom: 1.5,
			environmentTileDistance: 2,
			environmentTileColour: 0x9E8D51,
		});

		// FINALLY, SOME DEBUGS OFF TO THE LEFT
		this.propManager.registerProp('mountain_1', { position: new Vector3(-150, 0, -50) });
		this.propManager.registerProp('mountain_2', { position: new Vector3(-130, 0, -50) });
		this.propManager.registerProp('mountain_3', { position: new Vector3(-110, 0, -50) });
		this.propManager.registerProp('mountain_4', { position: new Vector3(-150, 0, -15) });
		this.propManager.registerProp('mountain_5', { position: new Vector3(-130, 0, -15) });
		this.propManager.registerProp('mesa_1', { position: new Vector3(-110, 0, -15) });

		this.propManager.render();

		// Setup a Wave Manager
		this.waveManager = new WaveManager(levelDetails.waves, this, this.main);

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
