import { Timer } from './Timer';

export class StateMachine {
	states: State[];
	transitions: StateTransition[];
	activeStates: Set<string> = new Set();
	unactiveStates: Set<string> = new Set();

	/**
	 * Constructor
	 * */
	constructor() {}

	/**
	 * Sets the states for this state machine
	 * */
	addStates(states: State[]) {
		this.states = states;
	}

	modifyState(stateName: string, newDefinition: State) {
		let index;

		for (let x = 0; x < this.states.length; x++) {
			if (this.states[x].name == stateName) {
				index = x;
				break;
			}
		}

		if (index !== undefined) this.states[index] = newDefinition;
		console.log('STATES', this.states);
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
	trigger(transitionName: string) {
		const transition = this.transitions.find((trans) => trans.name == transitionName);

		transition?.activatedStates?.forEach((activatedState) => this.activateStateByName(activatedState));
		transition?.deactivatedStates?.forEach((deactivatedState) => this.deactivateStateByName(deactivatedState));
	}

	/**
	 * Activates a state
	 * */
	activateStateByName(stateName: string) {
		console.log('%c Activating ' + stateName, 'color:green');
		const state = this.states.find((state) => state.name == stateName);
		if (state) {
			state.active = true;
			this.activeStates.add(state.name);

			// onEnter Lifecycle
			console.log('SHTAPTE', state);
			if ('onEnter' in state) {
				if (state.onEnter) state.onEnter();
			}

			// If this should stopAfterTime
			if (state.autoStateChange && state.autoStateChangeTimeMS) {
				let stateChangeCallback: Function;

				switch (state.autoStateChange) {
					case StateMachineEvents.Stop:
						stateChangeCallback = () => this.deactivateStateByName(stateName);
						break;
					default:
						stateChangeCallback = () => {
							console.log('TRIGGER CHANGE TO', state.autoStateChange);
							this.trigger(state.autoStateChange as string);
						};
				}

				if (state.timer) state.timer.dispose();
				state.timer = new Timer(stateChangeCallback, state.autoStateChangeTimeMS);
			}
		}
	}

	/**
	 * Deactivates a state
	 * */
	deactivateStateByName(stateName: string) {
		console.log('%c Dectivating ' + stateName, 'color:red');
		const state = this.states.find((state) => state.name == stateName);
		if (state) {
			state.active = false;
			this.activeStates.delete(stateName);
		}
	}
}

interface State {
	name: string;
	active?: boolean;
	autoStateChange?: StateMachineEvents | string; // If the state naturally has a timeout
	autoStateChangeTimeMS?: number;
	timer?: Timer;
	onEnter?: Function;
	onExit?: Function;
}

interface StateTransition {
	name: string;
	activatedStates?: string[];
	deactivatedStates?: string[];
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
