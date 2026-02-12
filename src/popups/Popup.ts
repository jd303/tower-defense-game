export class Popup {

	/**
	 * Core
	 */
	private parentElement: HTMLElement;

	/**
	 * Constructor
	 */
	constructor() {
		this.parentElement = document.createElement('div');
		this.parentElement.classList.add('popup');
		this.parentElement.setAttribute('data-open', 'false');

		const closeButton = document.createElement('button');
		closeButton.classList.add('popup-close');
		this.parentElement.appendChild(closeButton);
		closeButton.addEventListener('click', this.close);

		document.body.appendChild(this.parentElement);
	}

	/**
	 * Opens the popup
	 */
	readonly open = () => {
		this.parentElement.setAttribute('data-open', 'true');
	}

	/**
	 * Closes the popup
	 */
	readonly close = () => {
		this.parentElement.setAttribute('data-open', 'false');
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
}