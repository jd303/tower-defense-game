import { EventService } from '../core/EventService';
import { Main } from '../core/Main';
import { RaycasterOrders, RaycasterService } from '../core/RaycasterService';
import { ModelAsset } from '../environment/ModelAsset';
import { Terrain } from '../environment/Terrain';
import { Tower } from '../environment/towers/Tower';
import { EconomyService } from './EconomyService';
import { UITypes } from './UIProperties';

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
	 * All buttons, for state management
	 * */
	UIButtons: UIButton[] = [];

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

		this.attach();
	}

	/**
	 * Adds a button
	 * */
	addButton(objectUI: any, onClick: any, onCancel: Function) {
		const button = document.createElement('button');
		const icon = document.createElement('img');
		icon.src = objectUI.icon;
		button.appendChild(icon);
		button.addEventListener('click', onClick);
		(button as any).cancelBehaviour = onCancel;

		// Create a UI Button
		const newButton = new UIButton(button, onCancel);
		this.UIButtons.push(newButton);

		// Switch depending on the type
		switch (objectUI.type) {
			// Towers
			case UITypes.Tower:
				this.towersUIElement.appendChild(button);
				break;
		}
	}

	/**
	 * Marks a button as selected
	 * */
	selectButton(button: any) {
		button.setAttribute('data-selected', 'true');
	}

	/**
	 * Marks a button as deselected
	 * */
	deselectButton(button: any) {
		button.setAttribute('data-selected', 'false');
	}

	/**
	 * Runs the cancel callback on all buttons
	 * */
	cancelAllButtons() {
		this.UIButtons.forEach(button => button.cancelBehaviour({ target: button.button }));
	}

	/**
	 * Adds Level UI buttons when provided with a Tower or similar UI-able object
	 * */
	/*addLevelUIButtons(clickTarget: ModelAsset | Terrain, objects: any[]) {
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

					callback = this.toggleAssetCreation.bind(this, button, clickTarget, object);
					button.addEventListener('click', callback);
					break;
			}
		});
	}*/

	/**
	 * A UI Element wants to create an asset
	 * */
	/*toggleAssetCreation(button: HTMLElement, clickTarget: ModelAsset | Terrain, object: Tower, event: MouseEvent) {
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
			this.requestCreateAsset(clickTarget, object, markDeselected);
		}
	}*/

	/**
	 * The UI has triggered an asset creation
	 * */
	/*requestCreateAsset(clickTarget: ModelAsset | Terrain, element: Tower, uiOnComplete: Function) {
		// Start listening to raycasters
		const sRaycaster: RaycasterService = this.main.s('Raycaster');
		sRaycaster.addRaycasterSubjects([ {  order: RaycasterOrders.terrain, object: this.main.s('Level').currentLevel.terrain }]);

		if (element.UI.placeCallback) {
			// Create an oncomplete function
			const onComplete = () => {
				this.cancelCreateRequest(element);
				uiOnComplete();
			};

			// Add a click handler
			sRaycaster.addClickHandler(clickTarget, element.UI.placeCallback, onComplete);
		}
	}*/

	/**
	 * Cancels the create request
	 * */
	/*cancelCreateRequest(element: Tower) {
		const sRaycaster: RaycasterService = this.main.s('Raycaster');
		sRaycaster.removeRaycasterSubjects([this.main.s('Level').currentLevel.terrain]);
		sRaycaster.removeRaycasterSubjects(this.main.s('Level').currentLevel.levelPaths);
		if (element.UI.placeCallback) sRaycaster.removeClickHandler(element.UI.placeCallback);
	}*/

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
		div.classList.add(name);
		div.classList.add('label');

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
	 * Creates a popup
	 * */
	createPopup(name: string, html: string, classList:string[] = []) {
		const div = document.createElement('div');
		div.classList.add(name);
		div.classList.add('popup');
		classList.forEach(className => div.classList.add(className));
		div.innerHTML = html;
		this.rootUIElement.appendChild(div);
	}

	/**
	 * Attach the UI to the document
	 * */
	attach() {
		document.querySelector('body')?.appendChild(this.rootUIElement);
	}

	/**
	 * Removes Menu buttons and UI
	 * */
	removeMenusUI() {
		this.menuUIElement.innerHTML = "";
	}

	/**
	 * Removes Tower buttons and UI
	 * */
	removeTowersUI() {
		this.towersUIElement.innerHTML = "";
	}

	/**
	 * Removes Hero buttons and UI
	 * */
	removeHeroesUI() {
		this.heroesUIElement.innerHTML = "";
	}

	/**
	 * Removes Economy buttons and UI
	 * */
	removeEconomyUI() {
		this.economyUIElement.innerHTML = "";
	}

	/**
	 * Removes all elements from the UI and clears all interactions
	 * */
	clearUI() {
		this.rootUIElement.innerHTML = "";
	}
}

class UIButton {
	button: HTMLButtonElement;
	cancelBehaviour: Function;

	constructor(button: HTMLButtonElement, cancelBehaviour: Function) {
		this.button = button;
		this.cancelBehaviour = cancelBehaviour;
	}
}