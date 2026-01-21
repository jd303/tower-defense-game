import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickCallback, TickService, TickTimeProperties, TickTimeTypes } from '../../core/TickService';
import { CharacterStats } from '../Stats';
import { MovePathDefinition } from '../../data/PathInterfaces';
import { StateMachine, StateMachineEvents, StateMachineTransitions } from '../../core/StateMachine';
import { HeroStates, HeroTransitions } from './HeroStates';
import { CreepStats } from '../creeps/CreepStats';
import { Creep } from '../creeps/Creep';
import { MovementTypes } from '../../data/MovementTypes';
import { InterceptionHandler, InterceptionSlotCountInterface } from '../InterceptionHandler';
import { PathService } from '../../game/PathService';
import { CreepStates } from '../creeps/CreepStates';
import { InteractionEvent, InteractionService2, InteractableOrders, InteractableTypes } from '../../game/InteractionService2';
import { SpriteService } from '../../game/SpriteService';
import { Asset } from '../assets/Asset';
import { MovePathManager } from '../MovePathManager';
import { CharacterAsset } from '../assets/CharacterAsset';
import { SpriteSheetRow } from '../assets/SpriteAsset';

export abstract class Hero extends CharacterAsset {
	/**
	 * Static values
	 */
	static instancedMeshInstanceCount: number = 1;
	static instancedMeshAnimates: boolean = true;

	/**
	 * Stats
	 * */
	typeName: InteractableTypes = "hero";
	interactiveOrder = InteractableOrders.heroes;
	stats: CharacterStats;

	/**
	 * Three Assets
	 * */
	textMessage: THREE.Sprite | null;

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Level Properties
	 * */
	path: MovePathDefinition;

	/**
	 * Status
	 * */
	states: HeroStates;

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
	selectionGeometryScale = 1.4;
	interceptionHandler: InterceptionHandler = new InterceptionHandler(this);

	/**
	 * Movement / Path Properties (Creeps and Heroes)
	 * */
	movePathManager: MovePathManager = new MovePathManager(this);

	/**
	 * Construtor
	 * */
	constructor(main: Main, assetName: string, assetType: string, assetPositionY: number, spriteSheetRows: SpriteSheetRow[], instancedMeshAssetScale: number) {
		super(main, assetName, 'hero', assetPositionY, spriteSheetRows, instancedMeshAssetScale, Hero.instancedMeshInstanceCount);

		this.assetType = 'hero';
		this.stateMachine = this.setDefaultStates();
		this.setInteractive();
		this.setInteractiveHero();

		setTimeout(() => {
			this.stateEnterIdle();
		}, 500);

		//this.talkSurprised();
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
	 * Resolves what happens at the end of a path
	 * */
	finaliseEndOfPath(): void {
		console.log("END OF PATH");
		this.stateMachine.transition(HeroTransitions.stop);
		this.movePathManager.completeActivePath();
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
		const minHealth = Math.max(0, this.stats.activeStats.life!.current + difference);
		const maxHealth = Math.min(this.stats.activeStats.life!.total, minHealth);
		this.stats.activeStats.life!.current = maxHealth;

		this.checkHealthStatus();
	}

	/**
	 * Sets a Hero's health to a percentage
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

			// The Hero has died
			case this.stats.activeStats.life!.current <= 0:
				this.disableHero();
				break;

			// The Hero has full health
			case this.stats.activeStats.life!.current >= this.stats.activeStats.life!.total:
				this.removeHealthBar();
				break;

			// The Hero has lost some health
			default:
				if (!this.healthBar) {
					this.createHealthBar(this.stats.activeStats.life!.current / this.stats.activeStats.life!.total);
				}
				else {
					this.updateHealthBar(this.stats.activeStats.life!.current / this.stats.activeStats.life!.total);
				}

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
	registerMovement(event: InteractionEvent) {
		const endingPoint = event.raycasterInteraction.point.point;
		const sPath: PathService = this.main.s('Path');

		this.movePathManager.removePath('activemovement');
		const movePath = sPath.createMovePath('activemovement', [{ point: this.groupMain.position }, { point: endingPoint }]);
		console.log("REGISTER MOVEMENT", movePath);
		this.movePathManager.addPath(movePath);
		this.movePathManager.setActivePath(movePath.id);
		this.stateMachine.transition(HeroTransitions.moving);

		// Mirror if necessary
		const startingPoint = this.groupMain.position;
		this.spriteSheetFrameManager.mirrorSpriteSheet(startingPoint.x > endingPoint.x);

		// Set the animation
		this.spriteSheetFrameManager.changeAnimation("walk");

		this.deselect();

		return { handled: true, cancelListeners: true }
	}

	/**
	 * Animation
	 * */
	animateCore(timeProperties: TickTimeProperties) {
		const states = this.stateMachine.activeStates;

		if (states.has(HeroStates.moving)) {
			this.animationMove(timeProperties);
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
	animate(timeProperties: TickTimeProperties) { }

	/**
	 * When Idling
	 * */
	stateEnterIdle() {
		console.log("IDLING");
		// Listen for interceptions
		const callback = new TickCallback(`${this.assetName}_intercept`, this.findInterceptees.bind(this));
		const sTick: TickService = this.main.s('Tick');
		sTick.registerCallback(callback, true, TickTimeTypes.second);

		this.spriteSheetFrameManager.changeAnimation("idle");
	}
	stateExitIdle() {
		console.log("EXIT IDLE");
		const sTick: TickService = this.main.s('Tick');
		sTick.deregisterCallback(`${this.assetName}_intercept`);
		this.disengageAsIntercepter();
	}

	/**
	 * Combat and Interception
	 * */
	findInterceptees() {
		// First, watch and find more interceptees
		const slotCounts: InterceptionSlotCountInterface = this.interceptionHandler.slotCounts;
		if (slotCounts.available > 0) {
			const omissionCallback = (interceptee: Creep) => interceptee.intercepter !== null || interceptee.stats.activeStats.movement!.type == MovementTypes.flying || interceptee.stateMachine.activeStates.has(CreepStates.uninterceptable);
			const interceptables: Asset[] = this.sLocation.findTargetsInRange({ potentialTargets: this.sLevel.currentLevel.creepManager.creeps, fromPoint: this.groupMain.position, range: this.stats.activeStats.interception!.distance, omissionCallback: omissionCallback, maximumResults: slotCounts.available });
			if (interceptables.length) this.interceptionHandler.addInterceptees(interceptables);
		}

		// Then set attack state if needs be
		const updatedSlotCounts: InterceptionSlotCountInterface = this.interceptionHandler.slotCounts;
		if (updatedSlotCounts.occupied > 0 && !this.stateMachine.isInState(HeroStates.attacking)) {
			this.stateMachine.transition(HeroTransitions.attacking);
		} else if (updatedSlotCounts.occupied == 0 && !this.stateMachine.isInState(HeroStates.idle)) {
			this.stateMachine.transition(HeroTransitions.stop);
		}
	}

	/**
	 * Engage and disengage
	 * */
	disengageAsIntercepter() {
		this.interceptionHandler.disengageAll();
	}
	removeInterceptee(removed: Asset) {
		this.interceptionHandler.removeInterceptee(removed);
	}

	/**
	 * Combat states
	 * */
	stateEnterAttack() {
		const sTick: TickService = this.main.s('Tick');
		const callback = new TickCallback(`${this.assetName}_attacking`, this.attackInterceptee.bind(this));
		sTick.registerCallback(callback, true, TickTimeTypes.second);

		this.spriteSheetFrameManager.changeAnimation("attack");

		console.log("STATE ENTER ATTACK");
		this.talkSurprised();
	}
	stateExitAttack() {
		const sTick: TickService = this.main.s('Tick');
		sTick.deregisterCallback(`${this.assetName}_attacking`);

		this.spriteSheetFrameManager.changeAnimation("walk");
	}
	attackInterceptee() {
		console.log("ATTACK");
		const attackTarget: Creep = this.interceptionHandler.firstAttackableCreep as Creep;
		if (attackTarget) {
			attackTarget.resolveAttack(this.stats.activeStats.attack!);
		} else {
			this.stateMachine.transition(HeroTransitions.stop);
		}
	}

	/**
	 * Hero Powers
	 * */
	activateStandingPower() { }
	activateIdlePower() { }

	/**
	* Interactions
	* */
	setInteractiveHero() {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractableListener('hero', 'selectHero', this.select);
	}

	/**
	 * Have the hero show text
	 */
	talk(message: string) {
		if (this.textMessage) {
			this.groupMain.remove(this.textMessage);
		}

		const sSprite: SpriteService = this.main.s('Sprite');
		this.textMessage = sSprite.makeTextSprite(message, { fontSizePx: 120, fontFamily: 'Arial', fontColour: 'red', bgColour: 'transparent' });
		this.textMessage.position.set(0, 5, 0);
		this.groupMain.add(this.textMessage);
	}

	/**
	 * Removes a text message
	 * */
	removeTextMessage() {
		if (this.textMessage) {
			this.groupMain.remove(this.textMessage);
			this.textMessage = null;
		}
	}

	talkSurprised() {
		console.log("TALKING SURPRISED TALKING SURPRISED TALKING SURPRISED TALKING SURPRISED TALKING SURPRISED TALKING SURPRISED");
		this.talk("!!!");
		setTimeout(() => {
			this.removeTextMessage();
		}, 1000);
	}

	/**
	 ******************************************************* UI INTERACTIONS
	 * */

	/**
	 * Selection Callbacks
	 * */
	select(/*event: InteractionEvent*/) {
		if (this.selected) {
			this.deselect();
		} else {
			this.selected = true;
			this.addSelectionVisibleMesh();

			// Register a new listener to make the movement
			const sInteraction2: InteractionService2 = this.main.s('Interaction2');
			sInteraction2.registerInteractableListener('terrain', 'registerHeroMovement', this.registerMovement.bind(this));
		}

		return { handled: true, cancelListeners: true }
	}
	deselect() {
		this.selected = false;
		this.removeSelectionVisibleMesh();

		// Register a new listener to make the movement
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.deregisterInteractableListener('terrain', 'registerHeroMovement');
	}
}