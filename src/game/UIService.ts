import { EventService } from '../core/EventService';
import { Main } from '../core/Main';
import { Tower } from '../environment/towers/Tower';
import { UIRegions } from './UIProperties';

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
			case UIRegions.Tower:
				this.towersUIElement.appendChild(button.element);
				this.UIButtons.push(button);
				break;
		}
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