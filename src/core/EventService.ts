export class EventService {
	eventListeners: EventInterface[] = [];

	/**
	 * Constructor
	 * */
	constructor() {
		console.log("EVEnt Service");
	}

	/**
	 * Adds an event to the window, bound with a callback to affect the correct item
	 * */
	addEvent(name: string, callback: any) {
		window.addEventListener(name, callback);
		this.eventListeners.push({ name: name, callback: callback });
	}

	/**
	 * Adds an event to the window, bound with a callback to affect the correct item
	 * */
	removeEvent(name: string) {
		this.eventListeners.forEach(listener => {
			if (listener.name == name) {
				window.removeEventListener(listener.name, listener.callback);
			}
		});
		
		this.eventListeners = this.eventListeners.filter(listener => listener.name !== name);
	}

	/**
	 * Fires an event into the event system
	 * */
	fire(name: string, value: any) {
		console.log("Fire!", name, value);

		let event = new CustomEvent(name, { detail: value });
		window.dispatchEvent(event);
	}
}

interface EventInterface {
	name: string;
	callback: any;
}