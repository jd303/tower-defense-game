import { Main } from '../core/Main';
import { RaycasterIntersection, RaycasterService } from '../core/RaycasterService';
import { StateMachine, StateMachineTransitions } from '../core/StateMachine';
import { ModelAsset } from '../environment/ModelAsset';
import { Terrain } from '../environment/Terrain';
import { LevelPath } from '../levels/LevelPath';

export class InteractionService {
	/**
	 * System Properties
	 * */
	main: Main;
	sRaycaster: RaycasterService;

	/**
	 * States
	 * */
	stateMachine: StateMachine;
	selectedObject: ModelAsset | Terrain | LevelPath | null = null;

	/**
	 * Registered Handlers
	 * */
	defaultTargetMode: boolean;
	defaultTargets: Set<Interactable> = new Set();
	contextClickTargets: Set<Interactable> = new Set();
	contextCancelTargets: Set<Interactable> = new Set();
	contextClickCallback: Function | null;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
		this.sRaycaster = this.main.s('Raycaster');

		// Setup Click Listener
		this.setupClickListener();

		// Setup Statemachine
		this.stateMachine = new StateMachine(main);
		this.setupStates();
	}

	/**
	 * Sets up the State Machine for interactions
	 * Helps track which interaction mode we are in
	 * */
	setupStates = function() {
		// Add states
		this.stateMachine.addStates([
			{
				// The board or UI buttons are tappable
				name: InteractionStates.default,
				onEnter: this.enterStateDefault.bind(this)
			},
			{
				// The user has tapped an interactive object on the board
				name: InteractionStates.context_selection,
				onEnter: this.enterContextInteraction.bind(this)
			},
			{
				// The user has opened a menu
				name: InteractionStates.menu_open,
				onEnter: this.enterStateMenu
			}
		]);

		// Add transitions
		this.stateMachine.addTransitions([
			{
				name: InteractionTransitions.default,
				deactivatedStates: StateMachineTransitions.All,
				activatedStates: [InteractionStates.default]
			},
			{
				name: InteractionTransitions.context_selection,
				deactivatedStates: StateMachineTransitions.All,
				activatedStates: [InteractionStates.context_selection]
			}
		]);

		this.stateMachine.transition(InteractionTransitions.default);
	}

	/**
	 * Registers default targets
	 * */
	registerDefaultTarget(target: Interactable) {
		this.defaultTargets.add(target);
		let setAsArray = Array.from(this.defaultTargets);
		setAsArray = setAsArray.sort((a, b) => a.order < b.order && 1 || -1);
		this.defaultTargets = new Set(setAsArray);
		
	}
	deregisterDefaultTarget(target: Interactable) {
		this.defaultTargets.delete(target);
	}

	/**
	 * Triggers a reset of interactions
	 * */
	triggerReset() {
		this.stateMachine.transition(InteractionTransitions.default);
	}

	/**
	 * Listens for all clicks
	 * */
	setupClickListener() {
		window.addEventListener('click', this.clickListener.bind(this));
	}
	removeClickListener() {
		window.removeEventListener('click', this.clickListener.bind(this));
	}

	/**
	 * Default behaviour when clicking
	 * */
	defaultClickCallback(target: RaycasterIntersection) {
		if (this.main.debugMode) {
			console.log( {x: target.point.point.x, y: target.point.point.y, z: target.point.point.z }, target.object);
		}

		const clickedTarget = target.object;
		if ('defaultClick' in clickedTarget) {
			clickedTarget.defaultClick();
		}
	}

	/**
	 * Click Listener
	 * */
	clickListener(event: MouseEvent | TouchEvent) {
		const targets = this.defaultTargetMode && this.defaultTargets || this.contextClickTargets;
		const cancelTargets = this.defaultTargetMode && [] || this.contextCancelTargets;
		const callback = this.defaultTargetMode && this.defaultClickCallback.bind(this) || this.contextClickCallback;
		if (!callback || !targets.size) return;

		const sRaycaster: RaycasterService = this.main.s('Raycaster');
		const matchedTarget = sRaycaster.fireRayToTargets(event, Array.from(targets), Array.from(cancelTargets));
		if (matchedTarget) {
			callback(matchedTarget, this.main);
		}
	}

	/**
	 * Registers/deregisters when an interaction has been registered
	 * Cancellation targets let us define ojects which, if hit, will cancel the interaction
	 * */
	registerContextInteraction(callback: Function, targets: Set<Interactable>, cancellatonTargets?: Set<Interactable>) {
		this.contextClickTargets = targets;
		this.contextCancelTargets = cancellatonTargets || new Set();
		this.contextClickCallback = callback;
		this.stateMachine.transition(InteractionTransitions.context_selection);
	}
	deregisterContextInteraction() {
		this.contextClickTargets = new Set();
		this.contextCancelTargets = new Set();
		this.contextClickCallback = null;
		this.stateMachine.transition(InteractionTransitions.default);
	}

	/**
	 * Marks something as selected and deselected
	 * */
	setSelectionState(target: (ModelAsset | Terrain | LevelPath), markSelected: boolean = true) {
		const currentSelectedObject = this.selectedObject;

		if (!markSelected) {
			if (currentSelectedObject && 'deselect' in currentSelectedObject) {
				currentSelectedObject.deselect();
			}
		}

		if (markSelected) {
			if (currentSelectedObject && 'deselect' in currentSelectedObject) {
				currentSelectedObject.deselect();
			}

			if ('select' in target) {
				target.select();
				this.selectedObject = target;
			}
		}
	}

	/**
	 * We have entered Default State
	 * */
	enterStateDefault() {
		console.log("Enter Interaction state: Default");
		this.defaultTargetMode = true;
	}

	/**
	 * We entered Board Interaction State
	 * */
	enterContextInteraction() {
		console.log("Entered Interaction state: Context Mode");
		this.defaultTargetMode = false;
	}

	/**
	 * We entered a Menu State
	 * */
	enterStateMenu() {
		console.log("Entere Interaction state: Menu")
	}
}

enum InteractionStates {
	default = "default",
	context_selection = "context_selection",
	menu_open = "menu_open"
}

export enum InteractionTransitions {
	default = "default",
	context_selection = "context_selection"
}

export class Interactable {
	order: InteractableOrders;
	object: (ModelAsset | Terrain | LevelPath);

	constructor(order: InteractableOrders, object: ModelAsset | Terrain | LevelPath) {
		this.order = order;
		this.object = object;
	}
}

export enum InteractableOrders {
	"terrain" = 0,
	"props" = 1,
	"towers" = 2,
	"heroes" = 3,
}