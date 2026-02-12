import { Popup } from "./Popup";

export class TowerUpgradePopup extends Popup {
	/**
	 * Constructor
	 */
	constructor() {
		super();

		const popupContents = document.createElement('div');
		popupContents.innerText = 'Hey, I\'m a popup';

		this.addChild(popupContents);
	}
}