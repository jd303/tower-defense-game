import { Service } from "./Service";

export class EventService extends Service {
	eventListeners: EventListenerDefinition[] = [];

	/**
	 * Constructor
	 * */
	constructor() {
		super();
	}

	/**
	 * Adds an event to the window, bound with a callback to affect the correct item
	 * */
	addListener(eventName: EventName, listenerName: string, callback: any) {
		window.addEventListener(eventName, callback);
		this.eventListeners.push({ listenerName: listenerName, eventName: eventName, callback: callback });
	}

	/**
	 * Adds an event to the window, bound with a callback to affect the correct item
	 * */
	removeListener(eventName: EventName, listenerName: string) {
		this.eventListeners.forEach(listener => {
			if (listener.eventName == eventName && listener.listenerName == listenerName) {
				window.removeEventListener(listener.eventName, listener.callback);
			}
		});

		this.eventListeners = this.eventListeners.filter(listener => {
			if (listener.eventName == eventName && listener.listenerName == listenerName) return false;
			return true;
		});
	}

	/**
	 * Fires an event into the event system
	 * */
	fire(name: EventName, value: any) {
		console.log("Fire!", name, value);

		let event = new CustomEvent(name, { detail: value });
		window.dispatchEvent(event);
	}
}

interface EventListenerDefinition {
	listenerName: string;
	eventName: EventName;
	callback: any;
}

export const EventNames = [
	"commerce_money_changed",
	"commerce_hearts_changed",
	"commerce_power_changed",
	"chronos_changed",
	"user_loadout_changed",
	"user_progress_changed"
] as const;
export type EventName = typeof EventNames[number];