import { EventService } from "../core/EventService";
import { Main } from "../core/Main";
import { LevelService } from "../levels/LevelService";
import { Popup } from "../popups/Popup";

export class MapLaunchPopup extends Popup {

	levelCode: string;
	levelLoadCallback: Function;

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
				<h1>Begin Travel?</h1>
				<p>Your crew is ready to depart, as your scouts return with a report.</div>
			</div>
			<div class="popup-flex-col">
				<div><strong id="field-levelname"></strong></div>
				<div class="popup-flex-row">
					<div>
						<div><strong>Difficulty</strong></div>
						<div id="field-difficulty"></div>
					</div>
					<div>
						<div><strong>Creeps</strong></div>
						<div id="field-creeps"></div>
					</div>
				</div>
			</div>
			<div class="popup-flex-col">
				<div><strong>Do you want to travel here?</strong></div>
				<button id="btConfirm">Let's roll</button>
				<button id="btCancel">Cancel</button>
			</div>
		`;

		this.addChild(popupContents);
		this.addEventListeners();
	}

	/**
	 * Adds click events
	 */
	addEventListeners() {
		this.addEventListenerById("btConfirm", this.loadLevel.bind(this));
		this.addEventListenerById("btCancel", this.close);
	}

	/**
	 * Registers the level code and callback
	 */
	async registerLevelLoadFeatures(levelCode: string, callback: Function) {
		this.levelCode = levelCode;
		this.levelLoadCallback = callback;

		const sLevel: LevelService = this.main.s('Level');
		const levelDetails = await sLevel.loadLevelData(levelCode);

		this.populateByID("field-levelname", `${levelDetails.levelName} - ${levelDetails.levelId}`);
		this.populateByID("field-difficulty", levelDetails.difficulty.toString());
		this.populateByID("field-creeps", levelDetails.creepOptions.map(creep => creep.name).join(', '));
	}

	/**
	 * User confirms load level
	 */
	loadLevel() {
		this.close();
		this.levelLoadCallback(this.levelCode)
	}

	/**
	 * Abstract
	 */
	onOpen() {
		//const levelDetails = 
	}

	/**
	 * Abstract
	 */
	onClose() { }

	/**
	 * Disposes of events
	 */
	disposeChild() {
		const sEvent: EventService = this.main.s('Event');
		sEvent.removeListener("chronos_changed", "UpgradeListener");
		sEvent.removeListener("user_loadout_changed", "UpgradeListener");
	}
}