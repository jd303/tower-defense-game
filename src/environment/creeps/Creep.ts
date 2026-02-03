import { Main } from '../../core/Main';
import { StateMachine, StateMachineEvents } from '../../core/StateMachine';
import { TickTimeProperties } from '../../core/TickService';
import { CreepStates, CreepTransitions } from './CreepStates';
import { Hero } from '../heroes/Hero';
import { InteractableOrders, InteractableTypes, InteractionService2 } from '../../game/InteractionService2';
import { MovePathDefinition } from '../../data/PathInterfaces';
import { MovePathManager } from '../MovePathManager';
import { CharacterAsset } from '../assets/CharacterAsset';
import { ShaderAnimationAttributes, SpriteSheetRow } from '../assets/SpriteAsset';
import { CharacterAttackStats, CharacterStats } from '../Stats';

export abstract class Creep extends CharacterAsset {
	/**
	 * Static values
	 */
	static instancedMeshInstanceCount: number = 100;
	static waveDifficulty: number;

	/**
	 * Stats
	 * */
	interactiveTypeName: InteractableTypes = "creep";
	interactiveOrder = InteractableOrders.creeps;
	stats: CharacterStats;
	newStats: CharacterStats;

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Status
	 * */
	selectionGeometryScale = 1.5;
	states: CreepStates;

	/**
	 * Combat and Interception
	 * */
	intercepter: Hero | null = null;

	/**
	 * Movement / Path Properties (Creeps and Heroes)
	 * */
	movePathManager: MovePathManager = new MovePathManager(this);

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetType: string, assetScale: number, assetPositionY: number, spriteSheetRows: SpriteSheetRow[], animationAttributes: ShaderAnimationAttributes) {
		super(main, assetName, 'creep', assetScale, assetPositionY, spriteSheetRows, animationAttributes);

		this.stateMachine = this.setDefaultStates();
		this.setInteractive();
		this.setInteractiveCreep();

		this.registerOnLoadCallback(() => {
			this.stateMachine.transition(CreepStates.pathmoving);
		});
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
				name: CreepStates.pathmoving,
			},
			{
				name: CreepStates.interceptedmoving
			},
			{
				name: CreepStates.uninterceptable,
				autoTransition: CreepTransitions.becomeinterceptable,
				autoTransitionTimeMS: 7500,
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
				deactivatedStates: [CreepStates.pathmoving, CreepStates.activatingStandingPower],
			},
			{
				name: CreepTransitions.unpause,
				activatedStates: [CreepStates.pathmoving],
				deactivatedStates: [CreepStates.idle],
			},
			{
				name: CreepTransitions.pathmoving,
				activatedStates: [CreepStates.pathmoving],
				deactivatedStates: [CreepStates.intercepted]
			},
			{
				name: CreepTransitions.stop,
				deactivatedStates: [CreepStates.pathmoving],
			},
			{
				name: CreepTransitions.took_damage,
				activatedStates: [CreepStates.hurting, CreepStates.hurt],
			},
			{
				name: CreepTransitions.activating_standing_power,
				activatedStates: [CreepStates.activatingStandingPower],
				deactivatedStates: [CreepStates.pathmoving],
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
			{
				name: CreepTransitions.intercepted,
				activatedStates: [CreepStates.intercepted, CreepStates.interceptedmoving],
				deactivatedStates: [CreepStates.pathmoving, CreepStates.activatingStandingPower, CreepStates.activatingMovingPower],
			},
			{
				name: CreepTransitions.becomeinterceptable,
				deactivatedStates: [CreepStates.uninterceptable]
			}
		]);

		return stateMachine;
	}

	/**
	 * Adds the creep to a path
	 */
	setCreepPath(creepPath: MovePathDefinition) {
		this.movePathManager.addPath(creepPath);
		this.movePathManager.setActivePath(creepPath.id);
	}

	/**
	 * Resolves when a creep was attacked
	 * */
	resolveAttack(attack: CharacterAttackStats) {
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
		const minHealth = Math.max(0, this.stats.activeStats.life!.current + difference);
		const maxHealth = Math.min(this.stats.activeStats.life!.total, minHealth);
		this.stats.activeStats.life!.current = maxHealth;

		this.checkHealthStatus();
	}

	/**
	 * Sets a Creep's health to a percentage
	 * @param { number } percentage Percentage of health to set
	 * */
	setHealthByPercentage(percentage: number) {
		this.stats.activeStats.life!.current = this.stats.activeStats.life!.total * percentage / 100;

		this.checkHealthStatus();
	}

	/**
	 * Checks the health status and orgnaises health bars
	 * */
	checkHealthStatus() {
		switch (true) {
			// The Creep has died
			case this.stats.activeStats.life!.current <= 0:
				this.killCreep();
				break;

			// The Creep has full health
			case this.stats.activeStats.life!.current >= this.stats.activeStats.life!.total:
				this.removeHealthBar();
				break;

			// The Creep has lost some health
			default:
				if (!this.healthBar) this.createHealthBar(this.stats.activeStats.life!.current / this.stats.activeStats.life!.total);
				else {
					this.updateHealthBar(this.stats.activeStats.life!.current / this.stats.activeStats.life!.total);
				}

				this.stateMachine.transition(CreepTransitions.took_damage);
				break;
		}
	}

	/**
	 * Combat and Interception
	 * */
	setIntercepted(byWhom: Hero) {
		this.intercepter = byWhom;
		this.stats.addModifier('intercepted_speed', { movement: { speed: 5 } });
		this.stateMachine.transition(CreepTransitions.intercepted);
		console.log("I got intercepted", this);
	}
	setDisintercepted(byWhom: Hero) {
		console.log("I got disintercepted", this);
		if (this.intercepter == byWhom) {
			this.intercepter = null;
			this.stats.removeModifier('intercepted_speed');
			this.movePathManager.rejoinCorePath();
			this.stateMachine.transition(CreepTransitions.pathmoving);
		}
	}

	/**
	 * A creep has died
	 * */
	killCreep() {
		const rewards = this.stats.activeStats.kill_rewards;
		this.main.s('Economy').adjustEconomyValue(rewards!.economic_property, rewards!.value);
		if (this.intercepter) this.intercepter.removeInterceptee(this);
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
		this.hideInstancedMesh();
		this.main.s('Level').currentLevel.creepManager.removeCreep(this);
	}

	/**
	 * Animation
	 * */
	animateCore(timeProperties: TickTimeProperties) {
		const states = this.stateMachine.activeStates;

		if (states.has(CreepStates.pathmoving) || states.has(CreepStates.interceptedmoving)) {
			this.animationMove(timeProperties);
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
	animate(timeProperties: TickTimeProperties) { }

	/**
	 * Resolves what happens at the end of a path
	 * */
	finaliseEndOfPath(): void {
		if (this.movePathManager.activePath!.id == 'core') {
			this.creepEscaped();
		} else {
			this.movePathManager.completeActivePath();
		}
	}

	/**
	 * Creep Powers
	 * */
	activateStandingPower() { }
	activateIdlePower() { }

	/**
	 * Sets this interactive
	 */
	setInteractiveCreep() {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractableListener('creep', 'selectCreep', this.select);
	}

	/**
	 * Interaction
	 */
	select() {
		console.group();
		console.log(`Creep: ${this.constructor.name}`);
		console.log('Stats:', this.stats);
		console.groupEnd();

		return { handled: true, cancelListeners: true };
	}
	deselect() {
	}
}