import { EventName, EventService } from '../core/EventService';
import { Main } from '../core/Main';
import { Service } from '../core/Service';
import { Tower } from '../environment/towers/Tower';
import { PopupConstructor } from '../popups/Popup';
import { PopupManager } from '../popups/PopupManager';
import { UIRegions } from './UIProperties';

export class UIService extends Service {
	/**
	 * System Properties
	 * */
	main: Main;
	popupManager: PopupManager;

	/**
	 * DOM Elements
	 * */
	rootUIElement: HTMLElement;
	menuUIElement: HTMLElement;
	towersUIElement: HTMLElement;
	powersUIElement: HTMLElement;
	tlMenuUIElement: HTMLElement;
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
	 * Event Properties
	 * */
	lastEvent: Function;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
		this.popupManager = new PopupManager(main);

		this.rootUIElement = document.createElement('div');
		this.rootUIElement.classList.add('ui');
		this.menuUIElement = document.createElement('div');
		this.menuUIElement.classList.add('region_menu');
		this.towersUIElement = document.createElement('div');
		this.towersUIElement.classList.add('region_towers');
		this.powersUIElement = document.createElement('div');
		this.powersUIElement.classList.add('region_powers');
		this.tlMenuUIElement = document.createElement('div');
		this.tlMenuUIElement.classList.add('region_tlMenu');
		this.economyUIElement = document.createElement('div');
		this.economyUIElement.classList.add('region_economy');

		this.rootUIElement.appendChild(this.menuUIElement);
		this.rootUIElement.appendChild(this.towersUIElement);
		this.rootUIElement.appendChild(this.powersUIElement);
		this.rootUIElement.appendChild(this.tlMenuUIElement);
		this.rootUIElement.appendChild(this.economyUIElement);

		this.attach();
	}

	/**
	 * Creates an icon button for a Factory
	 * */
	createIconButton(iconPath: string, region: UIRegions) {
		const buttonElement = document.createElement('button');
		const icon = document.createElement('img');
		icon.src = iconPath;
		buttonElement.appendChild(icon);

		const button = new UIButton(buttonElement, region)
		return button;
	}

	/**
	 * Adds a button to the UI
	 * */
	addButtonToUI(button: UIButton) {
		// Switch depending on the type
		switch (button.region) {
			// Towers
			case UIRegions.BottomCenter:
				this.towersUIElement.appendChild(button.element);
				this.UIButtons.push(button);
				break;
			// Towers
			case UIRegions.BottomLeft:
				this.powersUIElement.appendChild(button.element);
				this.UIButtons.push(button);
				break;
			// Menu
			case UIRegions.TopLeft:
				this.menuUIElement.appendChild(button.element);
				this.UIButtons.push(button);
				break;
		}
	}

	/**
	 * Adds a label to the economy section
	 * @param { name } string Name of the label; also it's class in CSS
	 * @param { string | null } event Name of an event that this will listen to to update contents
	 * */
	addEconomyLabel(name: string, event: EventName) {
		const label = this.createLabel(name, event);
		this.economyUIElement.appendChild(label);
	}

	/**
	 * Creates a label
	 * @param { name } string Name of the label; also it's class in CSS
	 * @param { string | null } eventName Name of an event that this will listen to to update contents
	 * */
	createLabel(name: string, eventName: EventName) {
		const div = document.createElement('div');
		div.classList.add(name);
		div.classList.add('label');

		const callback: any = this.updateLabelWithText.bind({ scope: this, target: div });

		const sEvent: EventService = this.main.s('Event');
		sEvent.addListener(eventName, name, callback);

		return div;
	}

	/**
	 * Removes a label and disconnects it's listener
	 * */
	removeLabel(name: string, eventName: EventName) {
		const label = document.querySelector(`.${name}`);
		label?.parentElement?.removeChild(label);

		const sEvent: EventService = this.main.s('Event');
		sEvent.removeListener(eventName, name);
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
	openPopup(popupType: PopupConstructor, name: string) {
		return this.popupManager.openPopup(popupType, name);
		/*const div = document.createElement('div');
		div.classList.add(name);
		div.classList.add('popup');
		classList.forEach(className => div.classList.add(className));
		div.innerHTML = html;
		this.rootUIElement.appendChild(div);*/
	}

	/**
	 * Deletes a popup
	 * */
	deletePopup(name: string) {
		const popup = document.querySelector(`.popup.${name}`);
		popup?.parentElement?.removeChild(popup);
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
	removePowersUI() {
		this.powersUIElement.innerHTML = "";
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
		this.removeMenusUI();
		this.removeTowersUI();
		this.removePowersUI();
		this.removeEconomyUI();
	}
}

export class UIButton {
	selected: boolean = false;
	element: HTMLButtonElement;
	region: UIRegions;

	constructor(element: HTMLButtonElement, region: UIRegions) {
		this.element = element;
		this.region = region;
	}

	/**
	 * Adds a click behaviour to a button
	 * */
	addClickBehaviour(callback: any) {
		this.element.addEventListener('click', callback);
	}

	/**
	 * States and selections
	 * */
	select() {
		this.element.setAttribute('data-selected', 'true');
		this.selected = true;
	}
	deselect() {
		this.element.setAttribute('data-selected', 'false');
		this.selected = false;
	}
}