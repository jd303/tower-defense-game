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
	getEconomicProperty(property: string) {
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
	 * Gets the value of an economic metric
	 * */
	getEconomyValue(property: string) {
		const propertyObject = this.getEconomicProperty(property);
		return propertyObject?.current;
	}

	/**
	 * Sets money
	 * */
	setEconomyValue(property: string, value: number) {
		const propertyObject = this.getEconomicProperty(property);
		return this.setValue(propertyObject, value);
	}

	/**
	 * Sets money
	 * */
	adjustEconomyValue(property: string, value: number) {
		let newValue = 0;
		switch (property) {
			case "money":
				newValue = this.adjustValue(this.economy.money, value);
				this.main.s('Event').fire('commerce_money_changed', newValue);
				return newValue;
			case "hearts":
				newValue = this.adjustValue(this.economy.hearts, value);
				this.main.s('Event').fire('hearts_changed', newValue);
				return newValue;
			case "power":
				newValue = this.adjustValue(this.economy.power, value);
				this.main.s('Event').fire('power_changed', newValue);
				return newValue;
		}
	}

	/**
	 * Sets a value for a resource
	 * */
	setValue(property: any, value: number) {
		property.current = value;
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