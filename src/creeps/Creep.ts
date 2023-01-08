import * as THREE from 'three';
import { Main } from '../core/Main';
import { TickTimeProperties } from '../core/Tick';
import { LevelPathDefinition } from '../data/PathInterfaces';
import { ModelAsset } from '../ModelAsset';
import { CreepStates, CreepStats } from './CreepStats';

export class Creep extends ModelAsset {
	/**
	 * Stats
	 * */
	stats: CreepStats;

	/**
	 * Three Assets
	 * */
	groupMain: THREE.Group; // Outermost group - transforms the whole model
	groupTransforms: THREE.Group; // Inner group - applies minor transformations
	groupModel: THREE.Group; // Innermost group - applies status transforms
	mesh: THREE.Mesh;

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Level Properties
	 * */
	path: LevelPathDefinition;
	pathTravelPercentagePerSec: number;
	pathProgress: number = 0;

	/**
	 * Status
	 * */
	states: CreepStates;

	/**
	 * Prefabs
	 * */
	healthBarBGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: 'grey' });
	healthBarFGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: '#7AE33E' });
	healthBarName: string = 'healthbar';

	/**
	 * Construtor
	 * */
	constructor(main: Main) {
		super(main);
		//this.main = main;
		this.groupMain = new THREE.Group();
		this.groupTransforms = new THREE.Group();
		this.groupModel = new THREE.Group();
		this.groupTransforms.add(this.groupModel);
		this.groupMain.add(this.groupTransforms);
	}

	/**
	 * Creates and groups the Three objects
	 * */
	createCreep(mesh: THREE.Mesh) {
		this.groupModel.add(mesh);
		this.main.scene.add(this.groupMain);
	}

	/**
	 * Resolves when a creep was attacked
	 * */
	resolveAttack(damage: number) {
		this.stats.damage_taken += damage;
		if (this.stats.damage_taken >= this.stats.hp_total) {
			this.main.level.removeCreep(this);
		} else {
			this.stateTakeDamage();
		}
	}

	/**
	 * Sets a path for a creep
	 * */
	setPath(path: LevelPathDefinition) {
		this.path = path;
		this.pathTravelPercentagePerSec = this.stats.move_speed / path.pathLength;
	}

	/**
	 * Creates a health bar for this creep
	 * */
	createHealthBar() {
		const barBG = new THREE.PlaneBufferGeometry(1, 0.1);
		const barFG = new THREE.PlaneBufferGeometry(1, 0.1);
		const healthBarGroup = new THREE.Group();
		const bgMesh = new THREE.Mesh(barBG, this.healthBarBGMaterial);
		const fgMesh = new THREE.Mesh(barFG, this.healthBarFGMaterial);
		fgMesh.name = this.healthBarName;
		healthBarGroup.add(bgMesh);
		healthBarGroup.add(fgMesh);
		healthBarGroup.position.y = 1;
		this.groupModel.add(healthBarGroup);

		this.updateHealthBar();
	}

	/**
	 * Updates the health bar
	 * */
	updateHealthBar() {
		const healthBar = this.groupModel.getObjectByName(this.healthBarName);
		healthBar!.scale.x = 1 - this.stats.damage_taken / this.stats.hp_total;
		healthBar!.position.x = -(this.stats.damage_taken / this.stats.hp_total) / 2;
	}

	/**
	 * Overridden functions
	 * */
	animate(timeProperties: TickTimeProperties) {}

	/**
	 * Update Creep State: Creep took damage
	 * */
	stateTakeDamage() {
		this.states.hurting.isHurting = true;
		this.states.hurting.hurtStartTime = new Date().getTime();

		if (!this.states.hurt) {
			this.createHealthBar();
			this.states.hurt = true;
		} else {
			this.updateHealthBar();
		}
	}

	/**
	 * Enabled Shadows
	 * */
	enableShadows(cast: boolean = true, receive: boolean = false) {
		// THis should be replaced when moving to ModelAsset
		this.groupModel.children.forEach((child: any) => {
			if (child.isMesh) {
				console.log(child);
				if (cast) child.castShadow = true;
				if (receive) child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}
}
