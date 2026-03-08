import { EventService } from '../core/EventService';
import { Main } from '../core/Main';
import { UserDataService } from '../data/UserData/UserDataService';

export class EconomyService {
	/**
	 * Player's economy data
	 * */
	economy: EconomyData = {
		money: 0,
		hearts: 0,
		power: 0
	}

	chronos: {
		chronoblips: 0,
		chronobloops: 0,
		chronoblobs: 0
	}

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Gets the object of an economic metric
	 * */
	getEconomicValue(property: EconomyProperty) {
		switch (property) {
			case "money":
				return this.economy.money;
			case "power":
				return this.economy.power;
			case "hearts":
				return this.economy.hearts;
		}
	}

	/**
	 * Sets money
	 * */
	setEconomyValue(property: EconomyProperty, value: number) {
		return this.setValue(property, value);
	}

	/**
	 * Sets money
	 * */
	adjustEconomyValue(property: EconomyProperty, value: number) {
		const sEvent: EventService = this.main.s('Event');

		let newValue = 0;
		switch (property) {
			case "money":
				newValue = this.adjustValue(property, value);
				sEvent.fire('commerce_money_changed', newValue);
				break;
			case "hearts":
				newValue = this.adjustValue(property, value);
				sEvent.fire('commerce_hearts_changed', newValue);
				break;
			case "power":
				newValue = this.adjustValue(property, value);
				sEvent.fire('commerce_power_changed', newValue);
				break;
		}

		this.writeEconomy();

		return newValue;
	}

	/**
	 * Write the user's loadout / economy data
	 */
	writeEconomy() {
		const sUserData: UserDataService = this.main.s('UserData');
		sUserData.userLoadout.economyData = this.economy;
		sUserData.saveUserData();
	}

	/**
	 * Sets a value for a resource
	 * */
	private setValue(property: EconomyProperty, value: number) {
		this.economy[property] = value;
		return value;
	}

	/**
	 * Sets a value for a resource
	 * */
	private adjustValue(property: EconomyProperty, value: number) {
		if (value < 0 && this.economy[property] <= 0) return 0;
		else {
			this.economy[property] += value;
			return this.economy[property];
		}
	}
}

export const EconomyProperties = [
	"money",
	"hearts",
	"power",
] as const;
export type EconomyProperty = typeof EconomyProperties[number];

export interface EconomyData {
	money: number;
	hearts: number;
	power: number;
}

export interface ChronosData {
	chronoblips: number;
	chronobloops: number;
	chronoblobs: number;
}