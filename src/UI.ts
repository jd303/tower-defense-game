import { Main } from './core/Main';
import { Tower } from './towers/Tower';
import { UIProperties, UITypes } from './UIProperties';

export class UI {
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

		this.rootUIElement.appendChild(this.menuUIElement);
		this.rootUIElement.appendChild(this.towersUIElement);
		this.rootUIElement.appendChild(this.heroesUIElement);
	}

	/**
	 * Adds towers to the UI
	 * */
	addTowerUI(elements: UIProperties[]) {
		elements.forEach((element) => {
			const button = document.createElement('button');
			const icon = document.createElement('img');
			icon.src = element.icon;
			button.appendChild(icon);

			// Switch depending on the type
			switch (element.type) {
				// Towers
				case UITypes.Tower:
					this.towersUIElement.appendChild(button);
					button.addEventListener('click', this.toggleAssetCreation.bind(this, button, element));
					break;

				// Heroes
				case UITypes.HeroAbility:
					this.heroesUIElement.appendChild(button);
					button.addEventListener('click', this.toggleHeroAbility.bind(this, button, element));
					break;
			}
		});
	}

	/**
	 * A UI Element wants to create an asset
	 * */
	toggleAssetCreation(button: HTMLElement, element: UIProperties, event: MouseEvent) {
		event.stopImmediatePropagation();
		event.stopPropagation();

		const markDeselected = () => button.setAttribute(this.buttonSelectedAttribute, 'false');
		const markSelected = () => button.setAttribute(this.buttonSelectedAttribute, 'true');

		if (button.getAttribute(this.buttonSelectedAttribute) == 'true') {
			markDeselected();
			this.cancelCreateRequest(element);
		} else {
			markSelected();
			this.requestCreateAsset(element, markDeselected);
		}
	}

	/**
	 * The UI has triggered an asset creation
	 * */
	requestCreateAsset(element: UIProperties, uiOnComplete: Function) {
		// Start listening to raycasters
		this.main.interactionManager.addRaycasterSubjects([this.main.level.terrain]);
		this.main.interactionManager.addRaycasterSubjects(this.main.level.levelPaths);

		if (element.placeCallback) {
			// Create an oncomplete function
			const onComplete = () => {
				this.cancelCreateRequest(element);
				uiOnComplete();
			};

			// Add a click handler
			this.main.interactionManager.addClickHandler(element.placeCallback, onComplete);
		}
	}

	/**
	 * Cancels the create request
	 * */
	cancelCreateRequest(element: UIProperties) {
		this.main.interactionManager.removeRaycasterSubjects([this.main.level.terrain]);
		this.main.interactionManager.removeRaycasterSubjects(this.main.level.levelPaths);
		if (element.placeCallback) this.main.interactionManager.removeClickHandler(element.placeCallback);
	}

	/**
	 * Toggles that we are going to use a hero ability
	 * */
	toggleHeroAbility(button: HTMLElement, element: UIProperties, event: MouseEvent) {}

	/**
	 * Attach the UI to the document
	 * */
	attach() {
		document.querySelector('body')?.appendChild(this.rootUIElement);
	}
}
