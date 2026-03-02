import { Main } from "../core/Main";
import { Popup, PopupConstructor } from "./Popup";

export class PopupManager {

	/**
	 * Core
	 */
	main: Main;
	popups: Popup[] = [];

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Opens the popup
	 */
	readonly openPopup = (popupType: PopupConstructor, name: string) => {
		const existingPopup = this.popups.find(popup => popup.name == name)
		if (existingPopup) {
			existingPopup.open();
			return existingPopup;
		}
		else {
			const popup = this.createPopup(popupType, name);
			popup.open();
			return popup;
		}
	}

	/**
	 * Creates a popup
	 */
	private createPopup(popupType: PopupConstructor, name: string) {
		const popup = new popupType(this.main, name);
		popup.popupManager = this;
		this.popups.push(popup)
		return popup;
	}

	/**
	 * Closes all popups
	 */
	readonly disposePopupByName = (name: string) => {
		const deletedPopup = this.popups.find(popup => popup.name == name);
		if (deletedPopup) {
			this.popups = this.popups.filter(popup => popup !== deletedPopup);
		}
	}

	/**
	 * Closes all popups
	 */
	readonly disposeAll = () => {
		this.popups.forEach(popup => popup.dispose());
		this.popups = [];
	}
}