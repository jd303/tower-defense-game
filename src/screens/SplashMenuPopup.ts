import { Main } from "../core/Main";
import { Level } from "../levels/Level";
import { Popup } from "../popups/Popup";

/**
 * Level Lost
 */
export class SplashMenuPopup extends Popup {

	level: Level;

	/**
	 * Constructor
	 */
	constructor(main: Main, name: string) {
		super(main, name);
		this.buildHTML();
	}

	/**
	 * Builds the HTML
	 */
	buildHTML() {
		const popupContents = document.createElement('div');
		popupContents.classList.add('popup-style-header-footer');
		popupContents.innerHTML = `
			<div>
				<h1>Tower Defence</h1>
			</div>
			<div class="popup-flex-col">
				Welcome.  Game is you for fun.  Have play, win rewards.	
			</div>
			<div>
				<div><strong>To Map Screen</strong></div>
				<button id="btConfirm">Go</button>
			</div>
		`;

		this.addChild(popupContents);
		this.addEventListeners();
	}

	/**
	 * We need to know the level
	 */
	setLevel(level: Level) {
		this.level = level;
	}

	/**
	 * Adds click events
	 */
	addEventListeners() {
		const parent = this.getParent();
		const confirm = parent.querySelector("#btConfirm");

		if (confirm) {
			confirm.addEventListener('click', this.toMapScreen.bind(this));
		}
	}

	/**
	 * Confirms that we're quitting
	 */
	toMapScreen() {
		this.close();
		window.location.hash = 'map';
	}

	// Let's just delete on close, for simplicity
	closeChild() {
		this.popupManager.disposePopupByName(this.name);
	}

	openChild() { }
	disposeChild() { }
}