import * as THREE from 'three';
import { Main } from '../../core/Main';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { StateMachine, StateMachineEvents } from '../../core/StateMachine';
import { TickTimeProperties } from '../../core/TickService';
import { LevelPathDefinition } from '../../data/PathInterfaces';
import { ModelAsset } from '../ModelAsset';
import { CreepStates, CreepTransitions } from './CreepStates';
import { CreepStats } from './CreepStats';
import { TowerAttackStats } from '../towers/TowerStats';

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
	healthBar: THREE.Group | null;
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
		this.stateMachine.transition('moving');
	}

	/**
	 * Sets default States for creeps
	 * */
	setDefaultStates() {
		const stateMachine = new StateMachine(this.main);

		stateMachine.addStates([
			{
				name: CreepStates.idle,
			},
			{
				name: CreepStates.moving,
			},
			{
				name: CreepStates.hurting,
				autoTransition: StateMachineEvents.Stop,
				autoTransitionTimeMS: 1000,
			},
			{
				name: CreepStates.hurt,
			},
			{
				name: CreepStates.healing,
				autoTransition: StateMachineEvents.Stop,
				autoTransitionTimeMS: 1500,
				onEnter: this.stateEnterHealing.bind(this),
				onExit: this.stateExitHealing.bind(this)
			},
			{
				name: CreepStates.activatingStandingPower,
				onEnter: this.activateStandingPower.bind(this),
			},
		]);

		stateMachine.addTransitions([
			{
				name: CreepTransitions.pause,
				activatedStates: [CreepStates.idle],
				deactivatedStates: [CreepStates.moving, CreepStates.activatingStandingPower],
			},
			{
				name: CreepTransitions.unpause,
				activatedStates: [CreepStates.moving],
				deactivatedStates: [CreepStates.idle],
			},
			{
				name: CreepTransitions.moving,
				activatedStates: [CreepStates.moving],
			},
			{
				name: CreepTransitions.stop,
				deactivatedStates: [CreepStates.moving],
			},
			{
				name: CreepTransitions.took_damage,
				activatedStates: [CreepStates.hurting, CreepStates.hurt],
			},
			{
				name: CreepTransitions.activating_standing_power,
				activatedStates: [CreepStates.activatingStandingPower],
				deactivatedStates: [CreepStates.moving],
			},
			{
				name: CreepTransitions.full_heal,
				deactivatedStates: [CreepStates.hurt],
			},
			{
				name: CreepTransitions.healed,
				activatedStates: [CreepStates.healing],
				deactivatedStates: [CreepStates.hurt, CreepStates.hurting],
			},
		]);

		return stateMachine;
	}

	/**
	 * Resolves when a creep was attacked
	 * */
	resolveAttack(attack: TowerAttackStats) {
		// Check any weaknesses or resistances, such as resistance to magic damage

		// Adjust the creeps's health by this damage
		const damage = this.stats.calculateDamage(attack.damage, attack.damageType)
		this.adjustHealthByNumber(-1 * damage);
	}

	/**
	 * Changes a Creep's health
	 * @param { number } difference Positive or negative number to adjust the creeps' health
	 * */
	adjustHealthByNumber(difference: number) {
		const minHealth = Math.max(0, this.stats.hp_current + difference);
		const maxHealth = Math.min(this.stats.hp_total, minHealth);
		this.stats.hp_current = maxHealth;

		this.checkHealthStatus();
	}

	/**
	 * Sets a Creep's health to a percentage
	 * @param { number } percentage Percentage of health to set
	 * */
	setHealthByPercentage(percentage: number) {
		this.stats.hp_current = this.stats.hp_total * percentage / 100;

		this.checkHealthStatus();
	}

	/**
	 * Checks the health status and orgnaises health bars
	 * */
	checkHealthStatus() {

		switch (true) {

			// The Creep has died
			case this.stats.hp_current <= 0:
				this.killCreep();
				break;

			// The Creep has full health
			case this.stats.hp_current >= this.stats.hp_total:
				this.removeHealthBar();
				break;

			// The Creep has lost some health
			default:
				if (!this.healthBar) this.createHealthBar();
				else this.updateHealthBar();
	
				this.stateMachine.transition(CreepTransitions.took_damage);
				break;
			}
	}

	/**
	 * A creep has died
	 * */
	killCreep() {
		const rewards = this.stats.kill_rewards;
		const newValue = this.main.s('Economy').adjustEconomyValue(rewards.economic_property, rewards.value);
		this.main.s('Event').fire('commerce_money_changed', newValue);
		this.deleteCreep();
	}

	/**
	 * A creep has escaped their path / beaten the player
	 * */
	creepEscaped() {
		const sLevel = this.main.s('Level');
		sLevel.currentLevel.creepEscaped(this);
		this.deleteCreep();
	}

	/**
	 * Final deletions of Creeps
	 * */
	deleteCreep() {
		this.stateMachine.remove();
		this.main.s('Level').currentLevel.removeCreep(this);
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
		const barBG = CreepCommons.healthBarGeometry;
		const barFG = CreepCommons.healthBarGeometry;
		barBG.setAttribute( 'position', new THREE.BufferAttribute( CreepCommons.healthBarVertices, 3 ) );
		const healthBarGroup = new THREE.Group();
		const bgMesh = new THREE.Mesh(barBG, CreepCommons.healthBarBGMaterial);
		const fgMesh = new THREE.Mesh(barFG, CreepCommons.healthBarFGMaterial);
		fgMesh.name = this.healthBarName;
		healthBarGroup.name = this.healthBarGroupName;
		healthBarGroup.add(bgMesh);
		healthBarGroup.add(fgMesh);
		healthBarGroup.position.y = this.healthBarY;
		healthBarGroup.position.z = 1;
		this.healthBar = healthBarGroup;
		this.groupTransforms.add(healthBarGroup);

		this.updateHealthBar();
	}

	/**
	 * Updates the health bar
	 * */
	updateHealthBar() {
		const healthBarGroup = this.groupTransforms.getObjectByName(this.healthBarGroupName);
		healthBarGroup!.scale.x = this.stats.hp_current / this.stats.hp_total;
		healthBarGroup!.position.x = (this.stats.hp_current / this.stats.hp_total) / 2;
		healthBarGroup!.position.x = 0;
		console.log("TODO: Align item properly");
	}

	/**
	 * Removes a health bar if one exists
	 * */
	removeHealthBar() {
		if (this.healthBar) {
			this.groupTransforms.remove(this.healthBar);
			this.healthBar = null;
		}
	}

	/**
	 * Animation
	 * */
	animateCore(timeProperties: TickTimeProperties) {
		const states = this.stateMachine.activeStates;

		if (states.has(CreepStates.moving)) {
			this.animationMoveMe(timeProperties);
		}

		if (states.has(CreepStates.hurting)) {
			this.animationHurtMe(timeProperties);
		}

		if (states.has(CreepStates.healing)) {
			this.animationHealing();
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
	animationMoveMe(timeProperties: TickTimeProperties) {
		// Calculate travel distance
		let distanceSinceLastFrame = timeProperties.deltaTime * this.pathTravelPercentagePerSec;
		this.pathProgress = Math.min(1, this.pathProgress + distanceSinceLastFrame);

		// If this creature has finished its path
		if (this.pathProgress >= 0.99) {
			this.creepEscaped();
		}

		const point = this.path.path.getPoint(this.pathProgress) as THREE.Vector3;
		this.groupMain.position.set(point.x, point.y, point.z);

		this.groupTransforms.position.y = Math.sin(timeProperties.elapsedTime * 50) / 20;
	}

	/**
	 * Shows that a Creep is hurt
	 * */
	animationHurtMe(timeProperties: TickTimeProperties) {
		this.groupModel.position.x = Math.sin(timeProperties.elapsedTime * 50) / 12;
	}

	/**
	 * Animates healing crosses
	 * */
	animationHealing() {
		const healingCrosses = this.groupMain.getObjectByName("HealingAnimation");
		if (healingCrosses) {
			healingCrosses.children.forEach((cross, index) => {
				cross.position.y += index * 0.005 + 0.001;
			});
		}
	}

	/**
	 * When the Creep is healed
	 * */
	stateEnterHealing() {
		const healingAnimationGroup = new THREE.Group();

		this.stateExitHealing();

		for (let x=0; x<4; x++) {
			const thisCross = CreepCommons.healingCrossMesh();
			thisCross.position.x += Math.random() - 0.5;
			thisCross.position.y += Math.random();
			const scale = Math.random() * 0.9 + 0.1;
			thisCross.scale.set(scale, scale, scale);

			healingAnimationGroup.add(thisCross);
		}
		
		healingAnimationGroup.name = "HealingAnimation";

		this.groupMain.add(healingAnimationGroup);
		healingAnimationGroup.position.z = 2;
	}

	/**
	 * When the Creep leaves healing state (also called when entering, to clear it out)
	 * */
	stateExitHealing() {
		const healingAnimationGroup = this.groupMain.getObjectByName("HealingAnimation");
		if (healingAnimationGroup) this.groupMain.remove(healingAnimationGroup);
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
	 * Creates a temporary healing animation
	 * */
	createHealingEffect() {
		console.log("%c Creating healing effect", "color: green");
	}

	/**
	 * Creep Powers
	 * */
	activateStandingPower() {}
	activateIdlePower() {}

	/**
	 * Position Functions
	 * */
	getExpectedPositionAt(timeInMS: number) {
		let distanceTravelled = timeInMS / 1000 * this.pathTravelPercentagePerSec;
		let expectedPathProgress = Math.min(1, this.pathProgress + distanceTravelled);
		console.log(distanceTravelled, expectedPathProgress, this.path.path.getPoint(expectedPathProgress));
		return this.path.path.getPoint(expectedPathProgress) as THREE.Vector3;
	}
}

class CreepCommons {
	/* Health Bar Commons */
	//static healthBarGeometry: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(1, 0.25);
	static healthBarGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
	static healthBarVertices: Float32Array = new Float32Array( [
		-1.0, -1.0,  1.0, // v0
		1.0, -1.0,  1.0, // v1
		1.0,  1.0,  1.0, // v2
	
		1.0,  1.0,  1.0, // v3
		-1.0,  1.0,  1.0, // v4
		-1.0, -1.0,  1.0  // v5
	]);
	
	static healthBarBGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: 'grey' });
	static healthBarFGMaterial: THREE.Material = new THREE.MeshBasicMaterial({ color: '#7AE33E' });

	/** Healing commons */
	static healingCrossBeamHorizontal = new THREE.BoxGeometry(0.5, 0.1, 0.05);
	static healingCrossBeamVertical = new THREE.BoxGeometry(0.10, 0.5, 0.05);
	static healingCrossMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
	static healingCrossMerge = BufferGeometryUtils.mergeGeometries([this.healingCrossBeamHorizontal, this.healingCrossBeamVertical]);
	static healingCrossMesh = () => { return new THREE.Mesh(this.healingCrossMerge, this.healingCrossMaterial); }
}