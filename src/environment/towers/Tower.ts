import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { ModelAsset } from '../ModelAsset';
import { UIRegions } from '../../game/UIProperties';
import { TowerStats, TowerStatesLegacy } from './TowerStats';
import { StateMachine } from '../../core/StateMachine';
import { TowerStates, TowerTransitions } from './TowerStates';
import { Projectile, ProjectileHitTypes } from '../attacks/Projectile';
import { PositionService } from '../PositionService';
import { Creep } from '../creeps/Creep';
import { UIButton, UIService } from '../../game/UIService';
import { RaycasterIntersection } from '../../core/RaycasterService';
import { InteractionEvent, InteractionService2, InteractableOrders, Interactable2 } from '../../game/InteractionService2';

export class Tower extends ModelAsset {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Status
	 */
	typeName: string = "tower";
	states: TowerStatesLegacy = new TowerStatesLegacy();
	attackStateLength: number = 750;
	baseStats: TowerStats;
	stats: TowerStats;

	/**
	 * Objects
	 * */
	projectiles: Projectile[] = [];

	/**
	 * States
	 * */
	stateMachine: StateMachine;

	/**
	 * Static Stats
	 * */
	static Factory: TowerFactory;
	static UIButton: UIButton;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);
		this.main = main;
		this.groupMain = new THREE.Group();
		this.groupTransforms = new THREE.Group();
		this.groupModel = new THREE.Group();
		this.groupTransforms.add(this.groupModel);
		this.groupMain.add(this.groupTransforms);

		this.stateMachine = this.setDefaultStates();
		this.stateMachine.transition(TowerStates.attacking);

		this.setInteractive();
	}

	/**
	 * Sets default States for creeps
	 * */
	setDefaultStates() {
		const stateMachine = new StateMachine(this.main);

		stateMachine.addStates([
			{
				name: TowerStates.idle,
			},
			{
				name: TowerStates.scanning,
				//onEnter: this.lookForCreeps.bind(this),
			},
			{
				name: TowerStates.attacking,
				autoTransition: TowerTransitions.scanning,
				autoTransitionTimeMS: 1750,
				//onEnter: this.activateStandingPower.bind(this),
			},
			{
				name: TowerStates.activatingPower1,
			},
			{
				name: TowerStates.activatingPower2,
			},
		]);

		stateMachine.addTransitions([
			{
				name: TowerTransitions.pause,
				activatedStates: [TowerStates.idle],
				deactivatedStates: [TowerStates.attacking, TowerStates.activatingPower1, TowerStates.activatingPower2],
			},
			{
				name: TowerTransitions.attacking,
				activatedStates: [TowerStates.attacking],
				deactivatedStates: [TowerStates.idle, TowerStates.scanning, TowerStates.activatingPower1, TowerStates.activatingPower2],
			},
			{
				name: TowerTransitions.scanning,
				activatedStates: [TowerStates.scanning],
				deactivatedStates: [TowerStates.attacking, TowerStates.activatingPower1, TowerStates.activatingPower2],
			},
		]);

		return stateMachine;
	}

	/**
	 * Animate
	 * */
	animateCore(timeProperties: TickTimeProperties) {
		this.animate(timeProperties);
	}

	/**
	 * Animate: Overwritten by Towers
	 * */
	animate(timeProperties: TickTimeProperties) { }

	/**
	 * Resolve a hit
	 * */
	resolveHit(projectile: Projectile) {
		console.log("The Projectile Hit", projectile);
		const sPositioning: PositionService = this.main.s('Position');
		let targets: Creep[] = [];

		switch (projectile.hitType) {
			case ProjectileHitTypes.direct:
				projectile.target.resolveAttack(this.stats.attack);
				break;
			case ProjectileHitTypes.splash:
				targets = sPositioning.getCreepsInRadiusFromPosition(projectile.target.groupMain.position, this.stats.attack.radius);
				targets.forEach(creep => creep.resolveAttack(this.stats.attack));
				break;
		}
	}

	/**
	 * Removes a Projectile
	 * */
	removeProjectile(removedProjectile: Projectile) {
		this.projectiles = this.projectiles.filter(projectile => projectile != removedProjectile);
	}

	/**
	 ******************************************************* UI INTERACTIONS
	 * */

	/**
	 * Sets up the Tower, such as the UI
	 * */
	static setupUI(main: Main) {
		const sUI: UIService = main.s('UI');

		const button = sUI.createIconButton(this.Factory.buttonIcon, UIRegions.Tower);
		button.addClickBehaviour((event: MouseEvent | TouchEvent) => this.clickUIButton(event, main));
		this.UIButton = button;
		sUI.addButtonToUI(button);
	}

	/**
	 * Initiates create mode
	 * */
	static clickUIButton(event: any, main: Main) {
		event.stopPropagation();
		/*const sInteraction = main.s('Interaction');

		if (this.UIButton.selected) {
			this.endCreateTowerOnTerrain({}, main);
		} else {
			this.UIButton.select();

			// Notify the Interaction Service that we want to create a tower
			const targetSet = new Set();
			targetSet.add(new Interactable(InteractableOrders.terrain, main.s('Level').currentLevel.terrain));
			const cancellationSet = new Set();
			main.s('Level').currentLevel.levelPaths.forEach((path: any) => {
				cancellationSet.add(new Interactable(InteractableOrders.props, path));
			});
			console.log("TODO: Orders are not quite right, not when LevelPaths have to be 'props'");
			console.log("CANCC", cancellationSet);
			sInteraction.registerContextInteraction((intersect: RaycasterIntersection) => this.requestCreateTower(intersect, main), targetSet, cancellationSet);
			sInteraction.stateMachine.transition(InteractionTransitions.context_selection);
		}*/

		const sInteraction2: InteractionService2 = main.s('Interaction2');
		if (this.UIButton.selected) {
			this.endCreateTowerOnTerrain({}, main);
		} else {
			this.UIButton.select();

			// Notify the Interaction Service that we want to create a tower
			const targetSet = new Set();
			targetSet.add(new Interactable2('terrain', InteractableOrders.terrain, main.s('Level').currentLevel.terrain));
			console.log("TODO: Orders are not quite right, not when LevelPaths have to be 'props'");
			sInteraction2.registerInteractableListener('terrain', 'createTower', this.requestCreateTower.bind(this));
		}

	}

	/**
	 * Request to create a Tower
	 * */
	static requestCreateTower(event: InteractionEvent) {
		let handled = false;
		const sEconomy = event.main.s('Economy');
		let remainingMoney: any;

		switch (this.Factory.costType) {
			case "money":
				remainingMoney = sEconomy.getEconomicProperty('money');
				if (remainingMoney.current >= this.Factory.cost) {
					remainingMoney = sEconomy.adjustEconomyValue(this.Factory.costType, -1 * this.Factory.cost);
					event.main.s('Event').fire('commerce_money_changed', remainingMoney);
					this.createTower(event.raycasterInteraction, event.main);
					handled = true;
				}
				break;
		}

		this.endCreateTowerOnTerrain({}, event.main);

		return { handled: handled, cancelListeners: true };
	}

	/**
	 * Complete creation
	 * */
	static createTower(intersect: RaycasterIntersection, main: Main) {
		main.s('Level').currentLevel.addTower(new this.Factory.factory(main), intersect.point.point);
	}


	/**
	 * Cancels Create Mode
	 * */
	static endCreateTowerOnTerrain(event: any, main: Main) {
		const sInteraction2: InteractionService2 = main.s('Interaction2');
		sInteraction2.deregisterInteractableListener('terrain', 'createTower');

		this.UIButton.deselect();
	}

	/**
	 ******************************************************* UI INTERACTIONS
	 * */
	defaultClick() {
		console.log("Default Click: Tower");
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

	registerUIButton(button: UIButton) {
		this.UIButton = button;
	}
}
