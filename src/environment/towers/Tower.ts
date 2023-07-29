import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { ModelAsset } from '../ModelAsset';
import { UIProperties, UITypes } from '../../game/UIProperties';
import { TowerStats, TowerStatesLegacy } from './TowerStats';
import { StateMachine } from '../../core/StateMachine';
import { TowerStates, TowerTransitions } from './TowerStates';
import { Projectile, ProjectileHitTypes } from '../attacks/Projectile';
import { PositionService } from '../PositionService';
import { Creep } from '../creeps/Creep';
import { UIService } from '../../game/UIService';

export class Tower extends ModelAsset {
	/**
	 * Status
	 */
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
	 * UI Elements
	 * */
	static UI: TowerUI;

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
	animate(timeProperties: TickTimeProperties) {}

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
	 * Sets up the Tower, such as the UI
	 * */
	static setup(main: Main) {
		const sUI: UIService = main.s('UI');

		const onCancel = function(event: any) {
			let target: any = event.target;
			target = target instanceof HTMLButtonElement && target || target.closest('button');
			sUI.deselectButton(target);
		}

		const onClick = function(event: any, main: Main) {
			let target: any = event.target;
			target = target instanceof HTMLButtonElement && target || target.closest('button');
			
			if (target.getAttribute('data-selected') == "true") {
				sUI.cancelAllButtons();
			} else {
				sUI.cancelAllButtons();
				sUI.selectButton(target);
				
				// Notify the Interaction Service that we want to create a tower
				const sInteraction = main.s('Interaction');
				sInteraction.registerInteraction([main.s('Level').currentLevel.terrain], this.UI.placeCallback);
			}
		}.bind(this);

		sUI.addButton(this.UI, onClick, onCancel);
	}
}

export class TowerUI {
	type: UITypes;
	icon: string;
	placeCallback: Function | undefined;

	/**
	 * Constructor
	 * */
	constructor(towerDetails: UIProperties) {
		this.type = towerDetails.type;
		this.icon = towerDetails.icon;
		this.placeCallback = towerDetails.placeCallback;
		return this;
	}

	/**
	 * Return properties
	 * */
	getProperties() {
		return {
			type: this.type,
			icon: this.icon,
			placeCallback: this.placeCallback,
		};
	}
}
