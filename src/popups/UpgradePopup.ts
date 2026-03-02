import { EventService } from "../core/EventService";
import { Main } from "../core/Main";
import { UserDataService } from "../data/UserData/UserDataService";
import { HeroUpgradeProperty, PowerUpgradeProperty, TowerUpgradeProperty } from "../data/UserData/UserLoadout";
import { Popup } from "./Popup";

export class UpgradePopup extends Popup {

	title: string;
	loadoutUpgradeProperty: string;
	upgradePurchaseProperties: TowerUpgradeProperty[] | HeroUpgradeProperty[] | PowerUpgradeProperty[];

	/**
	 * Constructor
	 */
	constructor(main: Main, name: string) {
		super(main, name);
	}

	/**
	 * Set properties to determine the popup function
	 */
	setProperties(title: string, properties: TowerUpgradeProperty[] | HeroUpgradeProperty[] | PowerUpgradeProperty[], loadoutUpgradeProperty: string) {
		this.title = title;
		this.upgradePurchaseProperties = properties;
		this.loadoutUpgradeProperty = loadoutUpgradeProperty;
	}

	/**
	 * Builds the HTML
	 */
	buildHTML() {
		const popupContents = document.createElement('div');
		popupContents.classList.add('popup-style-header-footer');
		popupContents.innerHTML = `
			<div>
				<h1>Upgrades ${this.title}</h1>
				<p>Spend your Chronoblips to purchase upgrades</div>
			</div>
			<div class="popup-flex-col">
				${this.upgradePurchaseProperties.map(property => {
			return `<div class="popup-flex-col">
						<div><strong>${property} 🎯</strong></div>
						<div class="popup-flex-row">
							<div>Purchased</div>
							<div id="purchases-${property}">o</div>
							<div><button class="bt-purchase" id="purchase_${property}">Purchase</button></div>
						</div>
					</div>`}).join("")}
			</div>
			<div>
				<div><strong>Chronoblips</strong></div>
				<div class="popup-flex-row">
					<div>Remaining</div>
					<div id="blips-value">o</div>
				</div>
			</div>
		`;

		this.addChild(popupContents);
		this.setup();
	}

	/**
	 * Adds interactivity
	 */
	async setup() {
		console.error("ANY, used multiple times in this component");

		const parentElement = this.getParent();

		this.upgradePurchaseProperties.forEach((property: TowerUpgradeProperty | HeroUpgradeProperty | PowerUpgradeProperty) => {
			parentElement.querySelector(`#purchase_${property}`)?.addEventListener('click', this.purchaseUpgrade.bind(this, property));
		});

		this.updateChronoblips();
		this.watchChronosChanges();
		this.updateUpgradePurchases();
		this.watchUpgradesChange();
	}

	/**
	 * Purchase an upgrade
	 */
	async purchaseUpgrade(upgradeType: TowerUpgradeProperty | HeroUpgradeProperty | PowerUpgradeProperty) {
		const sUserData: UserDataService = this.main.s('UserData');

		const currentUpgradeCount = (sUserData.userLoadout as any)[this.loadoutUpgradeProperty][upgradeType];
		let chronoBlipsCost = sUserData.tierStepCost(currentUpgradeCount);
		const chronosData = await sUserData.getChronosData();

		if (chronosData.chronoblips >= chronoBlipsCost) {
			let result = await sUserData.requestAdjustChronos("chronoblips", -1 * chronoBlipsCost);
			if (result) {
				(sUserData.userLoadout as any)[this.loadoutUpgradeProperty][upgradeType] += 1;
				sUserData.saveUserData();
			}
		}
	}

	/**
	 * Updates the value of the Chrono blips
	 */
	async updateChronoblips() {
		const parentElement = this.getParent();

		// Populate Chronoblips
		const sUserData: UserDataService = this.main.s('UserData');
		const chronosData = await sUserData.getChronosData();
		(parentElement.querySelector('#blips-value') as HTMLElement).innerText = chronosData.chronoblips.toString();
	}

	/**
	 * Watches for economy changes
	 */
	watchChronosChanges() {
		const sEvent: EventService = this.main.s('Event');
		sEvent.addListener("chronos_changed", "UpgradeListener", this.updateChronoblips.bind(this));
	}

	/**
	 * Updates the value of the Chrono blips
	 */
	async updateUpgradePurchases() {
		const parentElement = this.getParent();

		const sUserData: UserDataService = this.main.s('UserData');
		this.upgradePurchaseProperties.forEach(property => {
			(parentElement.querySelector(`#purchases-${property}`) as HTMLElement).innerText = (sUserData.userLoadout as any)[this.loadoutUpgradeProperty][property].toString();
		});
	}

	/**
	 * Watch for when the upgrades change
	 */
	watchUpgradesChange() {
		const sEvent: EventService = this.main.s('Event');
		sEvent.addListener("user_loadout_changed", "UpgradeListener", this.updateUpgradePurchases.bind(this));
	}

	// Abstracts
	onOpen() { }
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