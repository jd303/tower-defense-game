import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { ModelAsset, ModelCommons } from '../ModelAsset';
import { HeroStats } from './HeroStats';
import { MovePathDefinition } from '../../data/PathInterfaces';
import { StateMachine, StateMachineEvents } from '../../core/StateMachine';
import { HeroStates, HeroTransitions } from './HeroStates';
import { CreepStats } from '../creeps/CreepStats';
import { RaycasterIntersection, RaycasterOrders, RaycasterService } from '../../core/RaycasterService';
import { Interactable, InteractableOrders, InteractionService } from '../../game/InteractionService';

export class Hero extends ModelAsset {
	/**
	 * Stats
	 * */
	stats: HeroStats;

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
	path: MovePathDefinition;
	pathTravelPercentagePerSec: number;
	pathProgress: number = 0;

	/**
	 * Status
	 * */
	states: HeroStates;
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
		this.setupInteractions();

		this.setInteractive();
	}

	/**
	 * Sets default States for creeps
	 * */
	setDefaultStates() {
		const stateMachine = new StateMachine(this.main);

		stateMachine.addStates([
			{
				name: HeroStates.idle,
			},
			{
				name: HeroStates.moving,
			},
			{
				name: HeroStates.hurting,
				autoTransition: StateMachineEvents.Stop,
				autoTransitionTimeMS: 1000,
			},
			{
				name: HeroStates.hurt,
			},
			{
				name: HeroStates.healing,
				autoTransition: StateMachineEvents.Stop,
				autoTransitionTimeMS: 1500,
				onEnter: this.stateEnterHealing.bind(this),
				onExit: this.stateExitHealing.bind(this)
			},
			{
				name: HeroStates.activatingStandingPower,
				onEnter: this.activateStandingPower.bind(this),
			},
			{
				name: HeroStates.disabled,
				autoTransition: HeroTransitions.revived,
				autoTransitionTimeMS: 1500,
			},
		]);

		stateMachine.addTransitions([
			{
				name: HeroTransitions.pause,
				activatedStates: [HeroStates.idle],
				deactivatedStates: [HeroStates.moving, HeroStates.activatingStandingPower],
			},
			{
				name: HeroTransitions.unpause,
				activatedStates: [HeroStates.moving],
				deactivatedStates: [HeroStates.idle],
			},
			{
				name: HeroTransitions.moving,
				activatedStates: [HeroStates.moving],
			},
			{
				name: HeroTransitions.stop,
				deactivatedStates: [HeroStates.moving],
			},
			{
				name: HeroTransitions.took_damage,
				activatedStates: [HeroStates.hurting, HeroStates.hurt],
			},
			{
				name: HeroTransitions.activating_standing_power,
				activatedStates: [HeroStates.activatingStandingPower],
				deactivatedStates: [HeroStates.moving],
			},
			{
				name: HeroTransitions.full_heal,
				deactivatedStates: [HeroStates.hurt],
			},
			{
				name: HeroTransitions.healed,
				activatedStates: [HeroStates.healing],
				deactivatedStates: [HeroStates.hurt, HeroStates.hurting],
			},
			{
				name: HeroTransitions.became_disabled,
				activatedStates: [HeroStates.disabled],
				deactivatedStates: [HeroStates.moving, HeroStates.activatingStandingPower, HeroStates.hurting, HeroStates.hurt],
			},
			{
				name: HeroTransitions.revived,
				activatedStates: [HeroStates.idle],
				deactivatedStates: [HeroStates.disabled],
			},
		]);

		return stateMachine;
	}

	/**
	 * Adds interactions and movements
	 * */
	setupInteractions() {
		const sRaycaster: RaycasterService = this.main.s('Raycaster');
		sRaycaster.addRaycasterSubjects([{ order: RaycasterOrders.heroes, object: this }]);
	}

	/**
	 * Resolves what happens at the end of a path
	 * */
	resolveEndOfPath(): void {
		this.stateMachine.activateStateByName(HeroStates.idle);
	}

	/**
	 * Resolves when a hero was attacked
	 * */
	resolveAttack(attack: CreepStats) {
		const damage = this.stats.calculateDamage(attack.attack_damage, attack.attack_damagetype)
		this.adjustHealthByNumber(-1 * damage);
	}

	/**
	 * Changes a Hero's health
	 * @param { number } difference Positive or negative number to adjust the heros' health
	 * */
	adjustHealthByNumber(difference: number) {
		const minHealth = Math.max(0, this.stats.hp_current + difference);
		const maxHealth = Math.min(this.stats.hp_total, minHealth);
		this.stats.hp_current = maxHealth;

		this.checkHealthStatus();
	}

	/**
	 * Sets a Hero's health to a percentage
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
				this.disableHero();
				break;

			// The Creep has full health
			case this.stats.hp_current >= this.stats.hp_total:
				this.removeHealthBar();
				break;

			// The Creep has lost some health
			default:
				if (!this.healthBar) this.createHealthBar();
				else this.updateHealthBar();
	
				this.stateMachine.transition(HeroTransitions.took_damage);
				break;
			}
	}

	/**
	 * A hero has lost all health and is disabled
	 * */
	disableHero() {
		this.stateMachine.transition(HeroTransitions.became_disabled);
	}

	/**
	 * Registers movement
	 * */
	registerMovement(intersect: RaycasterIntersection, main: Main) {
		const path = new THREE.LineCurve3(this.groupMain.position, intersect.point);
		console.log(path);
		this.stateMachine.transition(HeroTransitions.moving);
	}

	/**
	 * Sets a path for a creep
	 * */
	setPath(path: MovePathDefinition) {
		this.path = path;
		this.pathTravelPercentagePerSec = this.stats.move_speed / path.pathLength;
	}

	/**
	 * Creates a health bar for this creep
	 * */
	createHealthBar() {
		const barBG = ModelCommons.healthBarGeometry;
		const barFG = ModelCommons.healthBarGeometry;
		barBG.setAttribute( 'position', new THREE.BufferAttribute( ModelCommons.healthBarVertices, 3 ) );
		const healthBarGroup = new THREE.Group();
		const bgMesh = new THREE.Mesh(barBG, ModelCommons.healthBarBGMaterial);
		const fgMesh = new THREE.Mesh(barFG, ModelCommons.healthBarFGMaterial);
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
		//healthBarGroup!.position.x = (this.stats.hp_current / this.stats.hp_total) - 1; // left aligned
		healthBarGroup!.position.x = 0;
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

		if (states.has(HeroStates.moving)) {
			this.animationMoveMe(timeProperties);
		}

		if (states.has(HeroStates.hurting)) {
			this.animationHurtMe(timeProperties);
		}

		if (states.has(HeroStates.healing)) {
			this.animationHealing();
		}

		this.animate(timeProperties);
	}

	/**
	 * Overridden functions
	 * */
	animate(timeProperties: TickTimeProperties) {}

	/**
	 * Hero Powers
	 * */
	activateStandingPower() {}
	activateIdlePower() {}

	/**
	 ******************************************************* UI INTERACTIONS
	 * */
	defaultClick() {
		console.log("Default Click: Hero");
		const sInteraction: InteractionService = this.main.s('Interaction');
		sInteraction.markAsSelected(this);

		const targetSet = new Set<Interactable>();
		targetSet.add(new Interactable(InteractableOrders.terrain, this.main.s('Level').currentLevel.terrain));
		sInteraction.registerContextInteraction(this.registerMovement.bind(this), targetSet);
	}

	/**
	 * Selection Callbacks
	 * */
	select() {
		console.log("TODO: Add a selection graphic: Hero");
	}
	deselect() {
		console.log("TODO: Remove the selection graphic: Hero");
	}
}