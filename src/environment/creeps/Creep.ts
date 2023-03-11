import * as THREE from 'three';
import { Main } from '../../core/Main';
import { StateMachine, StateMachineEvents, StateTransitionTypes } from '../../core/StateMachine';
import { TickTimeProperties } from '../../core/TickService';
import { LevelPathDefinition } from '../../data/PathInterfaces';
import { ModelAsset } from '../ModelAsset';
import { CreepStates } from './CreepStates';
import { CreepStats } from './CreepStats';

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
	stateMachine: StateMachine;

	/**
	 * Health bar
	 * */
	healthBarBGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: 'grey' });
	healthBarFGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: '#7AE33E' });
	healthBarGroupName: string = 'healthbargroup';
	healthBarName: string = 'healthbar';
	healthBarY: number = 1;

	/**
	 * Construtor
	 * */
	constructor(main: Main) {
		super(main);
		this.groupMain = new THREE.Group();
		this.groupTransforms = new THREE.Group();
		this.groupModel = new THREE.Group();
		this.groupTransforms.add(this.groupModel);
		this.groupMain.add(this.groupTransforms);
		this.stateMachine = this.setDefaultStates();
		this.stateMachine.trigger('moving');
	}

	/**
	 * Sets default States for creeps
	 * */
	setDefaultStates() {
		const stateMachine = new StateMachine();

		stateMachine.addStates([
			{
				name: CreepStates.idle,
			},
			{
				name: CreepStates.moving,
			},
			{
				name: CreepStates.hurting,
				autoStateChange: StateMachineEvents.Stop,
				autoStateChangeTimeMS: 1000,
			},
			{
				name: CreepStates.hurt,
			},
			{
				name: CreepStates.activatingStandingPower,
				onEnter: this.activateStandingPower.bind(this),
			},
		]);

		stateMachine.addTransitions([
			{
				name: 'pause',
				activatedStates: [CreepStates.idle],
				deactivatedStates: [CreepStates.moving, CreepStates.activatingStandingPower],
			},
			{
				name: 'unpause',
				activatedStates: [CreepStates.moving],
				deactivatedStates: [CreepStates.idle],
			},
			{
				name: 'moving',
				activatedStates: [CreepStates.moving],
			},
			{
				name: 'stop',
				deactivatedStates: [CreepStates.moving],
			},
			{
				name: 'hurting',
				activatedStates: [CreepStates.hurting, CreepStates.hurt],
			},
			{
				name: 'activatingStandingPower',
				activatedStates: [CreepStates.activatingStandingPower],
				deactivatedStates: [CreepStates.moving],
			},
			{
				name: 'fullHeal',
				deactivatedStates: [CreepStates.hurt],
			},
		]);

		return stateMachine;
	}

	/**
	 * Resolves when a creep was attacked
	 * */
	resolveAttack(damage: number) {
		// Check any weaknesses or resistances, such as resistance to magic damage

		// Adjust the creeps's health by this damage
		this.adjustHealthByNumber(damage);
	}

	/**
	 * Changes a Creep's health
	 * @param { number } difference Positive or negative number to adjust the creeps' health
	 * */
	adjustHealthByNumber(difference: number) {
		this.stats.damage_taken += difference;

		this.checkHealthStatus();
	}

	/**
	 * Sets a Creep's health to a percentage
	 * @param { number } percentage Percentage of health to set
	 * */
	setHealthByPercentage(percentage: number) {
		this.stats.damage_taken = this.stats.hp_total - Math.floor((this.stats.hp_total * percentage) / 100);
		console.log('SETTING HEALTH', this.stats.hp_total - Math.floor((this.stats.hp_total * percentage) / 100));

		this.checkHealthStatus();
	}

	/**
	 * Checks the health status and orgnaises health bars
	 * */
	checkHealthStatus() {
		// If the creep died
		if (this.stats.damage_taken >= this.stats.hp_total) {
			this.main.s('Level').currentLevel.removeCreep(this);

			// If the creep is fresh
		} else if (this.stats.damage_taken == 0) {
			// Should remove health bar
			// DO THAT HERE
			console.log('FULL HEALTH');

			// Otherwise the creep's status bar needs to be set
		} else {
			if (!this.stateMachine.activeStates.has(CreepStates.hurt)) {
				this.createHealthBar();
			} else {
				this.updateHealthBar();
			}

			this.stateMachine.trigger(CreepStates.hurting);

			console.log('>>>> UPDATED STATES', this.stateMachine.activeStates);
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
		const barBG = new THREE.PlaneBufferGeometry(1, 0.25);
		const barFG = new THREE.PlaneBufferGeometry(1, 0.25);
		const healthBarGroup = new THREE.Group();
		const bgMesh = new THREE.Mesh(barBG, this.healthBarBGMaterial);
		const fgMesh = new THREE.Mesh(barFG, this.healthBarFGMaterial);
		fgMesh.name = this.healthBarName;
		healthBarGroup.name = this.healthBarGroupName;
		healthBarGroup.add(bgMesh);
		healthBarGroup.add(fgMesh);
		healthBarGroup.position.y = this.healthBarY;
		healthBarGroup.position.z = 1;
		this.groupTransforms.add(healthBarGroup);

		this.updateHealthBar();
	}

	/**
	 * Updates the health bar
	 * */
	updateHealthBar() {
		const healthBarGroup = this.groupTransforms.getObjectByName(this.healthBarGroupName);
		healthBarGroup!.scale.x = 1 - this.stats.damage_taken / this.stats.hp_total;
		healthBarGroup!.position.x = -(this.stats.damage_taken / this.stats.hp_total) / 2;
	}

	/**
	 * Animation
	 * */
	animateCore(timeProperties: TickTimeProperties) {
		const states = this.stateMachine.activeStates;

		if (states.has(CreepStates.moving)) {
			this.moveMe(timeProperties);
		}

		if (states.has(CreepStates.hurting)) {
			this.hurtMe(timeProperties);
		}

		this.animate(timeProperties);
	}

	/**
	 * Overridden functions
	 * */
	animate(timeProperties: TickTimeProperties) {}

	/**
	 * Moves a Creep according to its movement speed
	 * */
	moveMe(timeProperties: TickTimeProperties) {
		// Calculate travel distance
		let distanceSinceLastFrame = timeProperties.deltaTime * this.pathTravelPercentagePerSec;

		this.pathProgress = Math.min(1, this.pathProgress + distanceSinceLastFrame);
		const point = this.path.path.getPoint(this.pathProgress) as THREE.Vector3;
		this.groupMain.position.set(point.x, point.y, point.z);

		this.groupTransforms.position.y = Math.sin(timeProperties.elapsedTime * 50) / 20;
	}

	/**
	 * Shows that a Creep is hurt
	 * */
	hurtMe(timeProperties: TickTimeProperties) {
		/*if (this.states.hurting.hurtStartTime + this.states.hurting.hurtingStateLength < new Date().getTime()) {
			this.states.hurting.isHurting = false;
			this.groupModel.position.x = 0;
		} else {
			this.groupModel.position.x = Math.sin(timeProperties.elapsedTime * 50) / 20;
		}*/
		this.groupModel.position.x = Math.sin(timeProperties.elapsedTime * 50) / 12;
	}

	/**
	 * Enabled Shadows
	 * */
	enableShadows(cast: boolean = true, receive: boolean = false) {
		// THis should be replaced when moving to ModelAsset
		this.groupModel.children.forEach((child: any) => {
			if (child.isMesh) {
				if (cast) child.castShadow = true;
				//if (receive) child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}

	/**
	 * Creep Powers
	 * */
	activateStandingPower() {}
	activateIdlePower() {}
}
