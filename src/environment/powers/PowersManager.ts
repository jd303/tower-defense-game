import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Power } from './Power';
import { Level } from '../../levels/Level';
import { UIButton, UIService } from '../../game/UIService';
import { UIRegions } from '../../game/UIProperties';
import { EconomyService } from '../../game/EconomyService';
import { InteractionEvent, InteractionService2 } from '../../game/InteractionService2';
import { AssetGenerator } from '../assets/AssetGenerator';
import { StatBlockPowerModification } from '../Stats';

export class PowersManager {
	/**
	 * System Properties
	 * */
	main: Main;
	level: Level;
	powerUpgrades: Record<string, StatBlockPowerModification[]> = {};

	/**
	 * Construtor
	 * */
	constructor(main: Main, level: Level) {
		this.main = main;
		this.level = level;
	}

	/**
	 * Sets up powers for the level
	 */
	setup(levelPowers: typeof Power[]) {
		const sUI: UIService = this.main.s('UI');

		levelPowers.forEach(power => {
			const powerUpgrades = this.powerUpgrades[power.powerProperties.assetName] || [];
			powerUpgrades.forEach(upgrade => power.stats.addUpgrade(upgrade));
		});

		levelPowers.forEach((power: typeof Power) => {
			const button = sUI.createIconButton(power.powerProperties.icon, UIRegions.BottomLeft);
			button.addClickBehaviour((event: MouseEvent | TouchEvent) => this.powerCreationUIButton.bind(this, event, power, button)());
			sUI.addButtonToUI(button);
		});
	}

	/**
	 * Goes into tower creation mode
	 */
	powerCreationUIButton(event: MouseEvent | TouchEvent, power: typeof Power, button: UIButton) {
		event.stopPropagation();

		// Can we afford it?
		const sEconomy: EconomyService = this.main.s('Economy');
		const currentPower = sEconomy.getEconomicValue('power');
		const affordable = currentPower && currentPower >= power.stats.activeStats.cost;

		if (affordable) {
			button.select();

			// Notify the Interaction Service that we want to create a tower
			const sInteraction2: InteractionService2 = this.main.s('Interaction2');
			sInteraction2.registerInteractableListener('terrain', 'createPower', (event) => this.requestAddPower.bind(this)(power, event, button), true);
		}
	}

	/**
	 * Double checks that a Tower can be afforded, then creates the tower
	 */
	requestAddPower(power: typeof Power, event: InteractionEvent, button: UIButton) {
		// Pay the cost
		const sEconomy: EconomyService = this.main.s('Economy');
		sEconomy.adjustEconomyValue('power', -1 * power.stats.activeStats.cost);

		// Create the power
		this.createPower(power, event.raycasterInteraction.point.point);

		// Remove listener
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.deregisterInteractableListener('terrain', 'createPower');

		button.deselect();

		return { handled: true, stopPropagation: true };
	}

	/**
	 * Creates a power
	 */
	async createPower(power: typeof Power, position: THREE.Vector3) {
		return await AssetGenerator.createPowerAsset(power.powerProperties.assetName, this.main, this.level, position);
	}
}