import { Main } from "../core/Main";
import { PopupManager } from "./PopupManager";

export abstract class Popup {

	/**
	 * Core
	 */
	main: Main;
	name: string;
	popupManager: PopupManager;
	private parentElement: HTMLElement;
	onCloseCallback: () => void;

	/**
	 * Constructor
	 */
	constructor(main: Main, name: string) {
		this.name = name;
		this.main = main;

		this.parentElement = document.createElement('div');
		this.parentElement.classList.add('popup');
		this.parentElement.setAttribute('data-open', 'false');

		const closeButton = document.createElement('button');
		closeButton.classList.add('popup-close');
		this.parentElement.appendChild(closeButton);
		closeButton.addEventListener('click', this.close);

		this.parentElement.addEventListener('pointerdown', e => {
			e.stopPropagation();
		});

		this.parentElement.addEventListener('click', e => {
			e.stopPropagation();
		});

		document.body.appendChild(this.parentElement);
	}

	/**
	 * Opens the popup
	 */
	readonly open = () => {
		this.parentElement.setAttribute('data-open', 'true');
		this.onOpen();
	}

	/**
	 * Closes the popup
	 */
	readonly close = () => {
		this.parentElement.setAttribute('data-open', 'false');
		this.onClose();

		if (this.onCloseCallback) {
			this.onCloseCallback();
		}
	}

	/**
	 * Populate an element in the popup with html
	 */
	populateByID(id: string, content: string) {
		const element = this.parentElement.querySelector(`#${id}`);
		if (element) {
			element.innerHTML = content;
		}
	}

	/**
	 * Helper to add an event listener to an id
	 */
	addEventListenerById(id: string, eventCallback: () => void) {
		const element = this.parentElement.querySelector(`#${id}`);
		element?.addEventListener('click', eventCallback);
	}

	/**
	 * Stores a callback to call on close
	 */
	setOnCloseCallback(callback: () => void) {
		this.onCloseCallback = callback;
	}

	/**
	 * Closes the popup
	 */
	readonly addChild = (child: HTMLElement) => {
		this.parentElement.appendChild(child);
	}

	/**
	 * Removes from the document
	 */
	readonly remove = () => {
		document.body.removeChild(this.parentElement);
	}

	/**
	 * Returns a reference to the parent Element
	 */
	readonly getParent = (): HTMLElement => {
		return this.parentElement as HTMLElement;
	}

	/**
	 * Deletes the popup
	 */
	readonly dispose = () => {
		this.disposeChild();
		this.popupManager.disposePopupByName(this.name);
		document.body.removeChild(this.parentElement);
	}

	protected abstract onOpen(): void;
	protected abstract onClose(): void;
	protected abstract disposeChild(): void;
}

export type PopupConstructor<T extends Popup = Popup> = new (...args: any[]) => T;