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
							console.log('TRIGGER CHANGE TO', state.autoTransition);
							this.transition(state.autoTransition as string);
						};
				}

				if (state.timer) state.timer.dispose();
				state.timer = new Timer(stateChangeCallback, state.autoTransitionTimeMS);
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
			// onExit Lifecycle
			if ('onExit' in state) {
				if (state.onExit) state.onExit();
			}

			state.active = false;
			this.activeStates.delete(stateName);
		}
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
