import { EventService } from './core/EventService';
import { Main } from './core/Main';
import { Tower } from './environment/towers/Tower';
import { EconomyService } from './game/EconomyService';
import { UIProperties, UITypes } from './UIProperties';

export class UIService {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * DOM Elements
	 * */
	rootUIElement: HTMLElement;
	menuUIElement: HTMLElement;
	towersUIElement: HTMLElement;
	heroesUIElement: HTMLElement;
	economyUIElement: HTMLElement;

	/**
	 * Game Assets
	 * */
	towers: Tower[];

	/**
	 * States
	 * */
	buttonSelectedAttribute: string = 'data-selected';

	/**
	 * Event Properties
	 * */
	lastEvent: Function;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;

		this.rootUIElement = document.createElement('div');
		this.rootUIElement.classList.add('ui');
		this.menuUIElement = document.createElement('div');
		this.menuUIElement.classList.add('menu');
		this.towersUIElement = document.createElement('div');
		this.towersUIElement.classList.add('towers');
		this.heroesUIElement = document.createElement('div');
		this.heroesUIElement.classList.add('heroes');
		this.economyUIElement = document.createElement('div');
		this.economyUIElement.classList.add('economy');

		this.rootUIElement.appendChild(this.menuUIElement);
		this.rootUIElement.appendChild(this.towersUIElement);
		this.rootUIElement.appendChild(this.heroesUIElement);
		this.rootUIElement.appendChild(this.economyUIElement);
	}

	/**
	 * Adds a UI button when provided with a Tower or similar UI-able object
	 * */
	addUIButtons(objects: any[]) {
		objects.forEach((object) => {
			const button = document.createElement('button');
			const icon = document.createElement('img');
			icon.src = object.UI.icon;
			button.appendChild(icon);

			let callback: any;

			// Switch depending on the type
			switch (object.UI.type) {
				// Towers
				case UITypes.Tower:
					this.towersUIElement.appendChild(button);

					callback = this.toggleAssetCreation.bind(this, button, object);
					button.addEventListener('click', callback);
					break;
			}
		});
	}

	/**
	 * A UI Element wants to create an asset
	 * */
	toggleAssetCreation(button: HTMLElement, object: Tower, event: MouseEvent) {
		event.stopImmediatePropagation();
		event.stopPropagation();

		const markDeselected = () => button.setAttribute(this.buttonSelectedAttribute, 'false');
		const markSelected = () => button.setAttribute(this.buttonSelectedAttribute, 'true');

		// Check that the item is affordable
		const sEconomy: EconomyService = this.main.s('Economy');
		const objectCost = object.baseStats.cost;
		const objectCostType = object.baseStats.costType;
		const currentResources = sEconomy.getEconomyValue(objectCostType);

		if (currentResources !== undefined && currentResources < objectCost) {
			console.log("Too poor - should we animate this?");
			return false;
		}

		// Good to go
		if (button.getAttribute(this.buttonSelectedAttribute) == 'true') {
			markDeselected();
			this.cancelCreateRequest(object);
		} else {
			markSelected();
			this.requestCreateAsset(object, markDeselected);
		}
	}

	/**
	 * The UI has triggered an asset creation
	 * */
	requestCreateAsset(element: Tower, uiOnComplete: Function) {
		// Start listening to raycasters
		this.main.s('Interaction').addRaycasterSubjects([this.main.s('Level').currentLevel.terrain]);
		this.main.s('Interaction').addRaycasterSubjects(this.main.s('Level').currentLevel.levelPaths);

		if (element.UI.placeCallback) {
			// Create an oncomplete function
			const onComplete = () => {
				const remainingMoney = this.main.s('Economy').adjustEconomyValue(element.baseStats.costType, -1*element.baseStats.cost);
				this.main.s('Event').fire('commerce_money_changed', remainingMoney);
				this.cancelCreateRequest(element);
				uiOnComplete();
			};

			// Add a click handler
			this.main.s('Interaction').addClickHandler(element.UI.placeCallback, onComplete);
		}
	}

	/**
	 * Cancels the create request
	 * */
	cancelCreateRequest(element: Tower) {
		this.main.s('Interaction').removeRaycasterSubjects([this.main.s('Level').currentLevel.terrain]);
		this.main.s('Interaction').removeRaycasterSubjects(this.main.s('Level').currentLevel.levelPaths);
		if (element.UI.placeCallback) this.main.s('Interaction').removeClickHandler(element.UI.placeCallback);
	}

	/**
	 * Adds a label to the economy section
	 * @param { name } string Name of the label; also it's class in CSS
	 * @param { string | null } event Name of an event that this will listen to to update contents
	 * */
	addEconomyLabel(name: string, event: string) {
		const label = this.createLabel(name, event);
		this.economyUIElement.appendChild(label);
	}

	/**
	 * Creates a label
	 * @param { name } string Name of the label; also it's class in CSS
	 * @param { string | null } eventName Name of an event that this will listen to to update contents
	 * */
	createLabel(name: string, eventName: string) {
		const div = document.createElement('div');
		div.className = name;

		const callback: any = this.updateLabelWithText.bind({ scope: this, target: div });

		const sEvent: EventService = this.main.s('Event');
		sEvent.addEvent(eventName, callback);		
		
		return div;
	}

	/**
	 * Removes a label and disconnects it's listener
	 * */
	removeLabel(name: string, eventName: string) {
		const label = document.querySelector(`.${name}`);
		label?.parentElement?.removeChild(label);

		const sEvent: EventService = this.main.s('Event');
		sEvent.removeEvent(eventName);
	}

	/**
	 * Called by event callbacks to update labels
	 * */
	updateLabelWithText(event: any) {
		const eventScope: any = this;
		eventScope.target.innerText = event.detail;
	}

	/**
	 * Attach the UI to the document
	 * */
	attach() {
		document.querySelector('body')?.appendChild(this.rootUIElement);
	}
}
