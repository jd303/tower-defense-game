import { Main } from '../core/Main';
import { RaycasterIntersection, RaycasterService } from '../core/RaycasterService';
import { Service } from '../core/Service';
import { Terrain } from '../environment/Terrain';
import { EnvironmentTile } from '../environment/EnvironmentTile';
import { CreepPath } from '../environment/creeps/CreepPath';
import { Asset } from '../environment/assets/Asset';

/**
 * Allows us to manage interaction based on clicks and taps.
 * To use:
 * - Register interactive items using registerInteractable
 * - Register interactive listeners using registerInteractableListener
 *   - Interactive Listeners should be ready to accept a RaycasterIntersection, and determine if they need to act on it
 *   - Interactive Listeners should return an EventHandlingResult, which tells the Interaction Service whether to continue or not
 * - Any time there is a click, a Raycaster will find all interactive items in the ray.
 * - The service will ask all interactive listeners if they want to handle the event.
 * 
 * - To then have multiple items interact, or have follow-up interactions (such as a primary click on a hero, then a secondary one
 * - on the terrain to move), when the first interaction fires, register a new one, then remove it once done.
 */
export class InteractionService2 extends Service {
	/**
	 * System Properties
	 * */
	main: Main;
	sRaycaster: RaycasterService;

	/**
	 * Interactables and Handlers
	 * */
	interactables: Interactable2[] = [];
	modalInteractableListener: InteractableListener | null;
	interactableListeners: InteractableListener[] = [];
	currentInteractive?: InteractableObject | null = null;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
		this.sRaycaster = this.main.s('Raycaster');

		// Setup Click Listener
		this.setupClickListener();
	}

	/**
	 * Registers a new interactable
	 */
	registerInteractable(target: Interactable2) {
		this.interactables.push(target);
	}
	deregisterInteractableByObject(object: InteractableObject) {
		this.interactables = this.interactables.filter(interactable => interactable.object !== object);
	}

	/**
	 * Registers and deregisters a new interactable
	 */
	registerInteractableListener(targetName: string, eventName: string, callback: (event: InteractionEvent) => EventHandlingResult, exclusiveInteraction: boolean = false) {
		const existingListener = this.interactableListeners.find(listener => listener.targetName == targetName && listener.eventName == eventName);
		if (!existingListener) {
			if (this.modalInteractableListener) return console.error("Cannot add listeners during modal mode");

			if (exclusiveInteraction) {
				this.modalInteractableListener = { targetName: targetName, eventName: eventName, callback: callback, exclusiveInteraction: exclusiveInteraction };
			} else {
				this.interactableListeners.push({ targetName: targetName, eventName: eventName, callback: callback, exclusiveInteraction: exclusiveInteraction });
			}
		}
	}
	deregisterInteractableListener(targetName: string, eventName: string) {
		if (this.modalInteractableListener) {
			if (this.modalInteractableListener?.targetName != targetName) return console.error("Cannot remove listeners during modal mode");
			else this.modalInteractableListener = null;
		} else {
			this.interactableListeners = this.interactableListeners.filter(listener => listener.targetName != targetName && listener.eventName != eventName);
		}
	}

	/**
	 * Registers and deregisters current interacteds
	 */
	registerCurrentInteractive(interactive: InteractableObject) {
		if (this.currentInteractive && this.currentInteractive == interactive) {
			this.deregisterCurrentInteractive();
			return;
		}
		else if (this.currentInteractive) this.deregisterCurrentInteractive();
		if (interactive instanceof Terrain === false) this.currentInteractive = interactive;
	}
	deregisterCurrentInteractive(targetedInteractive?: InteractableObject) {
		if (this.currentInteractive && 'deselect' in this.currentInteractive) (this.currentInteractive as any).deselect();
		this.currentInteractive = null;
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
	 * Click Listener
	 * */
	clickListener(event: MouseEvent | TouchEvent) {
		const targets = this.interactables;
		const cancelTargets: any[] = [];
		let target;

		if (this.interactables?.length) {
			const sRaycaster: RaycasterService = this.main.s('Raycaster');
			const matchedTargets = sRaycaster.fireRayToTargets(event, Array.from(targets), false, Array.from(cancelTargets));
			if (matchedTargets) {
				let handled = false;

				for (let i = 0; i < (matchedTargets as RaycasterIntersection[]).length; i++) {
					if (handled) break;
					target = (matchedTargets as RaycasterIntersection[])[i];
					handled = this.offerTargetToListeners(target);
				}
			}
		}

		if (target) this.registerCurrentInteractive(target.object)
	}

	/**
	 * Offers each matched target to a listener to handle
	 */
	offerTargetToListeners(target: RaycasterIntersection) {
		if (this.modalInteractableListener) {
			if (this.modalInteractableListener.targetName == target.name) {
				const { handled, cancelListeners } = this.modalInteractableListener.callback.bind(target.object)({ raycasterInteraction: target, main: this.main });
				if (handled && cancelListeners) return true;
			}
		} else {
			for (let i = 0; i < this.interactableListeners.length; i++) {
				const listener = this.interactableListeners[i];
				if (listener.targetName == target.name) {
					const { handled, cancelListeners } = listener.callback.bind(target.object)({ raycasterInteraction: target, main: this.main });
					if (handled && cancelListeners) return true;
				}
			}
		}

		return false;
	}
}

export type InteractableObject = Asset | Terrain | CreepPath | EnvironmentTile;
export type InteractableTypes = 'creep' | 'creepPath' | 'hero' | 'tower' | 'environmentTile' | 'towerPlacementZone' | 'levelpath' | 'terrain';

export class Interactable2 {
	name: InteractableTypes;
	order: InteractableOrders;
	object: InteractableObject;

	constructor(name: InteractableTypes, order: InteractableOrders, object: InteractableObject) {
		this.name = name;
		this.order = order;
		this.object = object;
	}
}

export interface InteractableListener {
	targetName: string;
	eventName: string;
	callback: (event: InteractionEvent) => EventHandlingResult;
	exclusiveInteraction: boolean;
}

export interface EventHandlingResult {
	handled: boolean;
	cancelListeners: boolean;
}

export interface InteractionEvent {
	raycasterInteraction: RaycasterIntersection,
	main: Main
}

export enum InteractableOrders {
	"terrain" = 0,
	"pathsAndTiles" = 1,
	"props" = 2,
	"creeps" = 3,
	"towers" = 4,
	"heroes" = 5,
}