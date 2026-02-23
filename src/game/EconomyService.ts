import { EventService } from '../core/EventService';
import { Main } from '../core/Main';

export class EconomyService {
	/**
	 * Player's economy data
	 * */
	economy: EconomyData = {
		money: {
			current: 0
		},
		hearts: {
			current: 0
		},
		power: {
			current: 0
		}
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
				return this.economy.money.current;
			case "power":
				return this.economy.power.current;
			case "hearts":
				return this.economy.hearts.current;
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
				newValue = this.adjustValue(this.economy.money, value);
				sEvent.fire('commerce_money_changed', newValue);
				return newValue;
			case "hearts":
				newValue = this.adjustValue(this.economy.hearts, value);
				sEvent.fire('commerce_hearts_changed', newValue);
				return newValue;
			case "power":
				newValue = this.adjustValue(this.economy.power, value);
				sEvent.fire('commerce_power_changed', newValue);
				return newValue;
		}
	}

	/**
	 * Sets a value for a resource
	 * */
	private setValue(property: EconomyProperty, value: number) {
		this.economy[property].current = value;
		return value;
	}

	/**
	 * Sets a value for a resource
	 * */
	private adjustValue(property: any, value: number) {
		if (value < 0 && property.current <= 0) return 0;
		else {
			property.current += value;
			return property.current;
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
	money: {
		current: number
	}
	hearts: {
		current: number
	}
	power: {
		current: number
	}
}

export interface ChronosData {
	chronoblips: number;
	chronobloops: number;
	chronoblobs: number;
}