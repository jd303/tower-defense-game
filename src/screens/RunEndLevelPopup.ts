import { Main } from "../core/Main";
import { Level } from "../levels/Level";
import { Popup } from "../popups/Popup";

/**
 * Level Lost
 */
export class RunEndLevelPopup extends Popup {

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
				<h1>The Caravan has been defeated</h1>
			</div>
			<div class="popup-flex-col">
				<p>But the Noodle Of Time, wetly perched atop the Prime Caravan, begins to thrum - emitting a dizzying vision splitting aura.</p>
				<p>Your eyes swim and your head aches, and with a thwump sound, the world and everything inside it is sucked into the Noodle carby body.</p>
			</div>
			<div>
				<div><strong>The end?</strong></div>
				<button id="btConfirm">No, the Noodle has my back.</button>
			</div>
		`;

		this.addChild(popupContents);
		this.addEventListeners();
	}

	/**
	 * Adds click events
	 */
	addEventListeners() {
		const parent = this.getParent();
		const confirm = parent.querySelector("#btConfirm");

		if (confirm) {
			confirm.addEventListener('click', this.confirmRestart.bind(this));
		}
	}

	/**
	 * Confirms that we're quitting
	 */
	confirmRestart() {
		this.close();
		window.location.hash = 'endRun';
	}

	// Let's just delete on close, for simplicity
	closeChild() {
		this.popupManager.disposePopupByName(this.name);
	}

	openChild() { }
	disposeChild() { }
}