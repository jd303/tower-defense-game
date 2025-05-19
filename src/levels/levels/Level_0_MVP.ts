import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from '../../core/Main';
import { Level } from '../Level';
import { WaveManager } from '../WaveManager';
import { TowerArcher } from '../../environment/towers/TowerArcher';
import { TowerBomber } from '../../environment/towers/TowerBomber';
import { TowerMage } from '../../environment/towers/TowerMage';
import { levelDetails } from './Level_0_MVP_JSON';
import { EconomyService } from '../../game/EconomyService';
import { UIService } from '../../game/UIService';
import { EventService } from '../../core/EventService';
import { Man0 } from '../../environment/heroes/Man0';
import { CreepPath } from '../../environment/creeps/CreepPath';

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
	creepPaths: CreepPath[] = [];

	/**
	 * Properties
	 * */
	constructor(main: Main) {
		super(levelDetails, main);

		// FINALLY, SOME DEBUGS OFF TO THE LEFT
		this.propManager.registerProp({ assetName: 'mountain_2', position: new Vector3(-130, 0, -50) });
		this.propManager.registerProp({ assetName: 'mountain_3', position: new Vector3(-110, 0, -50) });
		this.propManager.registerProp({ assetName: 'mountain_4', position: new Vector3(-150, 0, -15) });
		this.propManager.registerProp({ assetName: 'mountain_5', position: new Vector3(-130, 0, -15) });
		this.propManager.registerProp({ assetName: 'mese_1', position: new Vector3(-110, 0, -15) });

		// Apply colour randomisation - TODO: Move this to somehwere better that can control these assets
		const tree_cone_2_group = this.propManager.propGroups.find(propGroup => propGroup.asset.name == "tree_cone_2");
		if (tree_cone_2_group) tree_cone_2_group.colorRandom = { g: 0.5 };
		const tree_spread_group = this.propManager.propGroups.find(propGroup => propGroup.asset.name == "tree_spread");
		if (tree_spread_group) tree_spread_group.colorRandom = { g: 0.5 };
		const rubble_1_group = this.propManager.propGroups.find(propGroup => propGroup.asset.name == "rubble_1");
		if (rubble_1_group) rubble_1_group.colorRandom = { l: -0.5 };
		this.propManager.render();

		// Create Lights (maybe temp, if we can get MatCaps to work
		const ambientLight = this.main.s('Lighting').createAmbientLight("WorldAmbient");
		this.main.s('Lighting').enableLight(ambientLight);
		const directionalLight = this.main.s('Lighting').createDirectionalLight(true);
		this.main.s('Lighting').enableLight(directionalLight);
		this.main.s('Debug').debugLight(directionalLight, 'Directional Light');
		this.main.s('Debug').debugLight(ambientLight, 'Ambient Light');

		// Setup a UI (towers defaulted, but in the future players should be able to choose)
		const sUI: UIService = this.main.s('UI');
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
		this.addHero(HeroMan0, new Vector3(-28, 0, -20));

		// Enable shadows
		setTimeout(() => {
			//this.main.renderer.physicallyCorrectLights = true;
			//this.main.renderer.outputEncoding = THREE.sRGBEncoding;
			this.main.renderer.shadowMap.enabled = true;
			this.main.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			this.terrain.enableShadows();
			this.main.s('Lighting').addShadowsToLight(directionalLight);
		}, 100);


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
