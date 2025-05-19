import * as THREE from 'three';
import { Main } from '../../core/Main';
import { UIRegions } from '../../game/UIProperties';
import { UIButton } from '../../game/UIService';
import { Tower } from './Tower';
import { TowerPlacementZone } from './TowerPlacementZone';
import { TickTimeProperties } from '../../core/TickService';
import { LevelDefinition } from '../../data/LevelInterfaces';
import { InteractionService2 } from '../../game/InteractionService2';

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
	 * Instantiates objects
	 * */
	setup(levelDetails: LevelDefinition) {
		levelDetails.towerPlacementZones.forEach((placement) => {
			const towerPlacementZone = new TowerPlacementZone(placement.points, this.main);
			this.towerPlacementZones.push(towerPlacementZone);
		});
	}

	/**
	 * Add a tower to the game
	 */
	addTower(tower: Tower, point: THREE.Vector3) {
		// if (!this.towers.find((tower) => tower)) this.towers.push(tower);
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

export class TowerFactory {
	UIRegion: UIRegions;
	buttonIcon: string;
	cost: number;
	costType: string;
	factory: any;

	placeCallback: Function | undefined;
	UIButton: UIButton;

	/**
	 * Constructor
	 * */
	constructor(UIRegion: UIRegions, buttonIcon: string, cost: number, costType: string, factory: any, placeCallback: Function) {
		this.UIRegion = UIRegion;
		this.buttonIcon = buttonIcon;
		this.cost = cost;
		this.costType = costType;
		this.factory = factory;
		this.placeCallback = placeCallback;
		return this;
	}

	/*registerUIButton(button: UIButton) {
		this.UIButton = button;
	}*/
}
