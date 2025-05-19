import * as THREE from 'three';
import { Main } from '../../core/Main';
import { UIRegions } from '../../game/UIProperties';
import { UIButton, UIService } from '../../game/UIService';
import { Tower } from './Tower';
import { TowerPlacementZone } from './TowerPlacementZone';
import { TickTimeProperties } from '../../core/TickService';
import { LevelDefinition } from '../../data/LevelInterfaces';
import { InteractionEvent, InteractionService2 } from '../../game/InteractionService2';
import { EconomyService } from '../../game/EconomyService';

export class TowerManager {
	/**
	 * Core
	 * */
	main: Main;
	defaultTowerClickEnabled: boolean = false;

	/**
	 * Objects
	 */
	towerPlacementZones: TowerPlacementZone[] = [];
	towers: Tower[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Instantiates tower placement zones and UI buttons
	 * */
	setup(levelDetails: LevelDefinition, levelTowers: typeof Tower[]) {
		levelDetails.towerPlacementZones.forEach((placement) => {
			const towerPlacementZone = new TowerPlacementZone(placement.points, this.main);
			this.towerPlacementZones.push(towerPlacementZone);
		});

		const sUI: UIService = this.main.s('UI');
		levelTowers.forEach((tower: typeof Tower) => {
			const button = sUI.createIconButton(tower.buttonIcon, UIRegions.Tower);
			button.addClickBehaviour((event: MouseEvent | TouchEvent) => this.towerCreationUIButton.bind(this, event, tower, button)());
			sUI.addButtonToUI(button);
		});
	}

	/**
	 * Goes into tower creation mode
	 */
	towerCreationUIButton(event: MouseEvent | TouchEvent, tower: typeof Tower, button: UIButton) {
		event.stopPropagation();

		const sEconomy: EconomyService = this.main.s('Economy');

		if (button.selected) {
			return this.endTowerCreation(button);
		}

		// See if we can create a tower
		if (tower.cost > sEconomy.getEconomicProperty('money')!.current) {
			console.log("Not enough gold to create tower");
			return;
		} else {
			button.select();

			// Notify the Interaction Service that we want to create a tower
			const sInteraction2: InteractionService2 = this.main.s('Interaction2');
			sInteraction2.registerInteractableListener('towerPlacementZone', 'createTower', (event) => this.requestAddTower.bind(this, tower, event, button)());

			this.towerPlacementZones.forEach((towerPlacementZone) => {
				towerPlacementZone.showPlacementTile(true);
			});
		}
	}

	endTowerCreation(button: UIButton) {
		button.deselect();
		this.towerPlacementZones.forEach((towerPlacementZone) => {
			towerPlacementZone.showPlacementTile(false);
		});
	}

	/**
	 * Double checks that a Tower can be afforded, then creates the tower
	 */
	requestAddTower(tower: typeof Tower, event: InteractionEvent, button: UIButton) {
		const sEconomy: EconomyService = this.main.s('Economy');
		if (tower.cost < sEconomy.getEconomicProperty('money')!.current) {
			this.addTower(new tower(this.main), event.raycasterInteraction.point.point);
		}

		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.deregisterInteractableListener('towerPlacementZone', 'createTower');

		this.endTowerCreation(button);

		return { handled: true, cancelListeners: true };
	}

	/**
	 * Add a tower to the game
	 */
	addTower(tower: Tower, point: THREE.Vector3) {
		this.towers.push(tower);
		this.main.scene.add(tower.groupMain);
		tower.groupMain.position.set(point.x, point.y, point.z);

		if (!this.defaultTowerClickEnabled) this.registerDefaultTowerListener();
	}

	/**
	 * Registers a default callback for all creep.  Uses the first creep's callback, with the context of the provided creep
	 */
	registerDefaultTowerListener() {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractableListener('tower', 'towerClickedDefault', this.towers[0].towerClicked);
		this.defaultTowerClickEnabled = true;
	}

	/**
	 * Animate objects based on time
	 */
	tick(timeProperties: TickTimeProperties) {
		this.towers.forEach((tower) => tower.animateCore(timeProperties));
	}
}
