import { Main } from '../core/Main';
import { RaycasterService } from '../core/RaycasterService';
import { StateMachine, StateMachineTransitions } from '../core/StateMachine';

/*
Interaction thinking

- Tap Board: Select an object on board
- Tap UI button
- Tap Context button (such as Tower settings, Hero settings)

States

- Object on board selected (disable Tap Board) (tapping UI button disables this)
- UI button selected (disable Tap Board, disable Tap Context Button)
- Menu open (disable Buttons, disable Tap Board, disable Tap Context Button)
*/

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

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
		this.sRaycaster = this.main.s('Raycaster');

		// Setup Statemachine
		this.stateMachine = new StateMachine(main);
		this.setupStates();

		// Enable Raycaster
		this.sRaycaster.enableRaycaster();
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
				onEnter: this.enterStateDefault
			},
			{
				// The user has tapped an interactive object on the board
				name: InteractionStates.board_object_context_selected,
				onEnter: this.enterStateBoardInteraction
			},
			{
				// The user has tapped a UI button
				name: InteractionStates.ui_button_selected,
				onEnter: this.enterStateUIButtonInteraction
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
				name: InteractionTransitions.reset,
				deactivatedStates: StateMachineTransitions.All,
				activatedStates: InteractionStates.default
			},
			{
				name: InteractionTransitions.tap_board_object,
				deactivatedStates: StateMachineTransitions.All,
				activatedStates: InteractionStates.board_object_context_selected
			},
			{
				name: InteractionTransitions.tap_ui_button,
				deactivatedStates: StateMachineTransitions.All,
				activatedStates: InteractionStates.ui_button_selected
			},
			{
				name: InteractionTransitions.cancel_ui_button,
				deactivatedStates: StateMachineTransitions.All,
				activatedStates: InteractionStates.default
			},
			{
				name: InteractionTransitions.open_menu,
				deactivatedStates: StateMachineTransitions.All,
				activatedStates: InteractionStates.menu_open
			},
			{
				name: InteractionTransitions.close_menu,
				deactivatedStates: InteractionStates.menu_open,
			}
		]);

		this.stateMachine.transition(InteractionTransitions.reset);
	}

	/**
	 * Triggers a reset of interactions
	 * */
	triggerReset() {
		this.stateMachine.transition(InteractionTransitions.reset);
	}

	/**
	 * We have entered Default State
	 * */
	enterStateDefault() {
		console.log("Enter state: Default");
	}

	/**
	 * We entered Board Interaction State
	 * */
	enterStateBoardInteraction() {
		console.log("Entered state: Board interaction");
	}

	/**
	 * We entered UI Button State
	 * */
	enterStateUIButtonInteraction() {
		console.log("Entere state: UI Button")
	}

	/**
	 * We entered a Menu State
	 * */
	enterStateMenu() {
		console.log("Entere state: Menu")
	}
}

enum InteractionStates {
	default,
	board_object_context_selected,
	ui_button_selected,
	menu_open
}

enum InteractionTransitions {
	reset = "reset",
	tap_board_object = "tap_board_object",
	tap_ui_button = "tap_ui_button",
	cancel_ui_button = "cancel_ui_button",
	open_menu = "open_menu",
	close_menu = "close_menu"
}