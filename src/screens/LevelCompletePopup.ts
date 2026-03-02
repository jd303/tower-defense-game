import { Main } from "../core/Main";
import { LevelResults } from "../dataTypes/LevelInterfaces";
import { Level } from "../levels/Level";
import { Popup } from "../popups/Popup";

/**
 * Level Lost
 */
export class LevelCompletePopup extends Popup {

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
				<h1>Level Complete</h1>
			</div>
			<div class="popup-flex-col">
				Your Caravan continues to trundle another day
			</div>
			<div class="popup-flex-col" id="level-results">
			</div>
			<div>
				<div><strong>Back to map screen?</strong></div>
				<button id="btConfirm">Back</button>
			</div>
		`;

		this.addChild(popupContents);
		this.addEventListeners();
	}

	/**
	 * We need to know the level
	 */
	setResults(levelResults: LevelResults) {
		this.populateByID("level-results", `
			<div class="popup-flex-col">
				<div><strong>Creeps</strong></div>
				<div class="popup-flex-row">
					<div class="popup-flex-col">
						<div><strong>In Level</strong></div>
						<div>${levelResults.creepsInLevel}</div>
					</div>
					<div class="popup-flex-col">
						<div><strong>Seen</strong></div>
						<div>${levelResults.creepsSeen}</div>
					</div>
					<div class="popup-flex-col">
						<div><strong>Escaped</strong></div>
						<div>${levelResults.creepsEscaped}</div>
					</div>
				</div>
			</div>
		`);
	}

	/**
	 * Adds click events
	 */
	addEventListeners() {
		this.addEventListenerById("btConfirm", this.confirmQuit.bind(this));
	}

	/**
	 * Confirms that we're quitting
	 */
	confirmQuit() {
		this.close();
		window.location.hash = 'map';
	}

	// Abstracts
	onOpen() { }
	onClose() { }
	disposeChild() { }
}