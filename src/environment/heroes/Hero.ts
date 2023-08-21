import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickCallback, TickService, TickTimeProperties, TickTimeTypes } from '../../core/TickService';
import { ModelAsset, ModelCommons } from '../ModelAsset';
import { HeroStats } from './HeroStats';
import { MovePathDefinition, PathSegment, PathTypes } from '../../data/PathInterfaces';
import { StateMachine, StateMachineEvents, StateMachineTransitions } from '../../core/StateMachine';
import { HeroStates, HeroTransitions } from './HeroStates';
import { CreepStats } from '../creeps/CreepStats';
import { RaycasterIntersection, RaycasterOrders, RaycasterService } from '../../core/RaycasterService';
import { Interactable, InteractableOrders, InteractionService } from '../../game/InteractionService';
import { Creep } from '../creeps/Creep';
import { MovementTypes } from '../../data/MovementTypes';

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
	 * Combat States
	 * */
	interceptedCreeps: (Creep | ModelAsset)[] = [];

	/**
	 * Construtor
	 * */
	constructor(main: Main) {
		super(main);
		
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
				onEnter: this.stateEnterIdle.bind(this),
				onExit: this.stateExitIdle.bind(this)
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
			{
				name: HeroStates.attacking,
				onEnter: this.stateEnterAttack.bind(this),
				onExit: this.stateExitAttack.bind(this)
			}
		]);

		stateMachine.addTransitions([
			{
				name: HeroTransitions.stop,
				activatedStates: [HeroStates.idle],
				deactivatedStates: StateMachineTransitions.All,
			},
			{
				name: HeroTransitions.moving,
				activatedStates: [HeroStates.moving],
				deactivatedStates: [HeroStates.idle, HeroStates.attacking, HeroStates.activatingStandingPower],
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
			{
				name: HeroTransitions.attacking,
				activatedStates: [HeroStates.attacking]
			}
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
		this.stateMachine.transition(HeroTransitions.stop);
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
	registerMovement(intersect: RaycasterIntersection) {
		const sPath = this.main.s('Path');

		// Create path segments
		const pathSegments: PathSegment[] = [{
			type: PathTypes.straight,
			points: [this.groupMain.position, intersect.point.point]
		}];

		const movePath = sPath.createMovePath(`${this.stats.heroName}_move`, pathSegments);
		this.pathProgress = 0;
		this.setPath(movePath);
		this.stateMachine.transition(HeroTransitions.moving);

		this.cancelDefaultClick();
	}

	/**
	 * Sets a path for a creep
	 * */
	setPath(path: MovePathDefinition) {
		this.path = path;
		this.pathTravelPercentagePerSec = this.stats.movement.speed / path.pathLength;
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

		if (states.has(HeroStates.attacking)) {
			this.animationAttack(timeProperties);
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
	 * When Idling
	 * */
	stateEnterIdle() {
		// Listen for interceptions
		const callback = new TickCallback(`${this.stats.heroName}_intercept`, this.findInterceptees.bind(this));
		const sTick: TickService = this.main.s('Tick');
		sTick.registerCallback(callback, true, TickTimeTypes.second);
	}
	stateExitIdle() {
		const sTick: TickService = this.main.s('Tick');
		sTick.deregisterCallback(`${this.stats.heroName}_intercept`);
		this.disengageAsIntercepter();
	}

	/**
	 * Combat and Interception
	 * */
	findInterceptees() {
		// First, watch and find more interceptees
		const remainingIntercepts = this.stats.numberIntercepted - this.interceptedCreeps.length;
		if (remainingIntercepts > 0) {
			const omissionCallback = (interceptee: Creep) => interceptee.intercepter !== null || interceptee.stats.movement.type == MovementTypes.flying;
			const intercepted: ModelAsset[] = this.sLocation.findTargetsInRange(this.sLevel.currentLevel.creeps, this.groupMain.position, this.stats.interceptDistance, omissionCallback).splice(0, remainingIntercepts);
			
			if (intercepted.length) {
				this.interceptedCreeps = this.interceptedCreeps.concat(intercepted);
				this.interceptedCreeps.forEach((thisCreep) => (thisCreep as Creep).setIntercepted(this));
			}
		}

		// Then set attack state if needs be
		if (this.interceptedCreeps.length && !this.stateMachine.isInState(HeroStates.attacking)) {
			this.stateMachine.transition(HeroTransitions.attacking);
		} else if (!this.interceptedCreeps.length) {
			this.stateMachine.transition(HeroTransitions.stop);
		}
	}

	/**
	 * Engage and disengage
	 * */
	disengageAsIntercepter() {
		this.interceptedCreeps.forEach((thisCreep) => (thisCreep as Creep).setDisintercepted(this));
		this.interceptedCreeps = [];
	}
	removeInterceptee(removed: ModelAsset) {
		this.interceptedCreeps = this.interceptedCreeps.filter((intercepted: ModelAsset) => intercepted !== removed);
	}

	/**
	 * Combat states
	 * */
	stateEnterAttack() {
		const sTick: TickService = this.main.s('Tick');
		const callback = new TickCallback(`${this.stats.heroName}_attacking`, this.attackInterceptee.bind(this));
		sTick.registerCallback(callback, true, TickTimeTypes.halfsecond);
	}
	stateExitAttack() {
		const sTick: TickService = this.main.s('Tick');
		sTick.deregisterCallback(`${this.stats.heroName}_attacking`);
	}
	attackInterceptee() {
		console.log("ATTACK");
		const attackTarget: Creep = this.interceptedCreeps[0] as Creep;
		if (attackTarget) {
			attackTarget.resolveAttack(this.stats.attack);
		} else {
			this.stateMachine.transition(HeroTransitions.stop);
		}
	}

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
		sInteraction.setSelectionState(this, true);

		const targetSet = new Set<Interactable>();
		targetSet.add(new Interactable(InteractableOrders.terrain, this.main.s('Level').currentLevel.terrain));
		sInteraction.registerContextInteraction(this.registerMovement.bind(this), targetSet);
	}

	cancelDefaultClick() {
		const sInteraction: InteractionService = this.main.s('Interaction');
		sInteraction.setSelectionState(this, false);
		sInteraction.deregisterContextInteraction();
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