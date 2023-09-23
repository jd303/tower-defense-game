import { Main } from './Main';
import { TickService } from './TickService';
import { Timer } from './Timer';

/**
 * STATE MACHINE
 * 
 * States are defined using an array of states that are valid, in the format:
 * 	[
 *			{
 *				name: 'Simple State Name',
 *			},
 *			{
 *				name: 'Complex State Name',
 *				autoTransition: StateMachineEvents.Stop, // Deactivates this State thread.  Also accepts a state name to transition to
 *				autoTransitionTimeMS: 1000, // The time to automatically transition to, in MS, after the state started
 *				onEnter: callback, // A callback to call when this state is entered
 *				onExit: callback // A callback to call when this state is exited
 *		]
 *
 * Transitions are then seperately defined, to determine what happens when a transition is triggered.  Transitions are defined in the format:
 * 	[
 * 		{
 *				name: CreepTransitions.pause,
 *				activatedStates: [CreepStates.idle],
 *				deactivatedStates: [CreepStates.pathmoving, CreepStates.activatingStandingPower],
 *				deactivatedStates: StateMachineTransitions.All, // Alternative, which will automatically disable all other active states
 *			}
 *		]
 * 
 * The State Machine can handle multiple states running at once.  As examples:
 * - Idle: this state can transition to 'moving' and back
 * - visible: this state can exist at the same time as idle, and it can transition to 'invisible' and bakc
 * - flashing: this state can exist at the same time as idle, and it can be completely removed once complete
 * 
 * It is also possible to give an entity multiple state machines, as long as each machine's states do not interact with each other.
 * */
export class StateMachine {
	main: Main;
	states: State[];
	transitions: StateTransition[];
	activeStates: Set<string> = new Set();
	unactiveStates: Set<string> = new Set();

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Sets the states for this state machine
	 * */
	addStates(states: State[]) {
		this.states = states;
	}

	/**
	 * Updates a state
	 * */
	modifyState(stateName: string, newDefinition: State) {
		let index;

		for (let x = 0; x < this.states.length; x++) {
			if (this.states[x].name == stateName) {
				index = x;
				break;
			}
		}

		if (index !== undefined) this.states[index] = newDefinition;
	}

	/**
	 * Sets the states for this state machine
	 * */
	addTransitions(transitions: StateTransition[]) {
		this.transitions = transitions;
	}

	/**
	 * An event is given to the state machine
	 * */
	transition(transitionName: string) {
		const transition = this.transitions.find((trans) => trans.name == transitionName);

		// Deactivate states
		if (transition?.deactivatedStates == StateMachineTransitions.All) this.activeStates.forEach(activeState => this.deactivateStateByName(activeState));
		else transition?.deactivatedStates?.forEach((deactivatedState) => this.deactivateStateByName(deactivatedState));

		// Activate States
		if (transition?.activatedStates == StateMachineTransitions.All) this.states.forEach(state => this.activateStateByName(state.name));
		else transition?.activatedStates?.forEach((activatedState) => this.activateStateByName(activatedState));
	}

	/**
	 * Activates a state
	 * */
	activateStateByName(stateName: string) {
		//console.log('%c Activating ' + stateName, 'color:green');
		const state = this.states.find((state) => state.name == stateName);
		if (state) {
			state.active = true;
			this.activeStates.add(state.name);

			// onEnter Lifecycle
			if ('onEnter' in state) {
				if (state.onEnter) state.onEnter();
			}

			// If this should stopAfterTime
			if (state.autoTransition && state.autoTransitionTimeMS) {
				let stateChangeCallback: Function;

				switch (state.autoTransition) {
					case StateMachineEvents.Stop:
						stateChangeCallback = () => this.deactivateStateByName(stateName);
						break;
					default:
						stateChangeCallback = () => {
							this.transition(state.autoTransition as string);
						};
				}

				state.timer = new Timer(stateChangeCallback, state.autoTransitionTimeMS, this.main);
			}
		}
	}

	/**
	 * Deactivates a state
	 * */
	deactivateStateByName(stateName: string) {
		//console.log('%c Deactivating ' + stateName, 'color:red');
		const state = this.states.find((state) => state.name == stateName);

		if (state) {
			// onExit Lifecycle
			if ('onExit' in state) {
				if (state.onExit) state.onExit();
			}

			state.active = false;
			this.activeStates.delete(stateName);
		}
	}

	/**
	 * Determines if this state machine is in a state
	 * */
	isInState(statename: string) {
		return this.activeStates.has(statename);
	}

	/**
	 * Remove this state machine
	 * */
	remove() {
		const sTick: TickService = this.main.s('Tick');
		this.states.forEach(state => {
			if (state.timer) sTick.deregisterTimer(state.timer);
			state.timer = undefined;
		});
		this.states = [];
	}
}

interface State {
	name: string;
	active?: boolean;
	autoTransition?: StateMachineEvents | string; // If the state naturally has a timeout
	autoTransitionTimeMS?: number;
	timer?: Timer;
	onEnter?: Function;
	onExit?: Function;
}

interface StateTransition {
	name: string;
	activatedStates?: string[] | StateMachineTransitions;
	deactivatedStates?: string[] | StateMachineTransitions;
}

export enum StateTransitionTypes {
	func = 'function',
	time = 'time',
}

export enum StateMachineEvents {
	Stop = 'stop',
	PauseAll = 'pauseAll',
	SetTimer = 'setTimer',
}

export enum StateMachineTransitions {
	All
}