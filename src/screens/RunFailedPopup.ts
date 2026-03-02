import { Main } from "../core/Main";
import { Level } from "../levels/Level";
import { Popup } from "../popups/Popup";

/**
 * Level Lost
 */
export class RunFailedPopup extends Popup {

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
				<p>But the Noodle of Time has saved you.</p>
			</div>
			<div class="popup-flex-col" id="run-results">
				<h2>Run Results</h2>
				<div class="popup-flex-row">
					<div>Chronoblips earned:</div>
					<div>45 (jD: Fix this)</div>
				</div>
				<div class="popup-flex-row">
					<div>Chronobloops earned:</div>
					<div>2 (jD: Fix this)</div>
				</div>
				<div class="popup-flex-row">
					<div>Chronoblobs earned:</div>
					<div>1 (jD: Fix this)</div>
				</div>
			</div>
			<div>
				<div><strong>Start a new run?</strong></div>
				<button id="btConfirm">Brind it on.</button>
				<button id="btCancel">Not yet.</button>
			</div>
		`;

		this.addChild(popupContents);
		this.addEventListeners();
	}

	/**
	 * Adds click events
	 */
	addEventListeners() {
		this.addEventListenerById("btConfirm", this.confirmRestart.bind(this));
		this.addEventListenerById("btCancel", this.quitGameForNow.bind(this));
	}

	/**
	 * User choice
	 */
	confirmRestart() {
		this.close();
		window.location.hash = 'map';
	}
	quitGameForNow() {
		this.close();
		window.location.hash = '';
	}

	// Abstracts
	onOpen() { }
	onClose() { }
	disposeChild() { }
}