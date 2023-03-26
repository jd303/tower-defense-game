import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { ModelAsset } from '../ModelAsset';
import { UIProperties, UITypes } from '../../UIProperties';
import { TowerStats, TowerStatesLegacy } from './TowerStats';
import { StateMachine } from '../../core/StateMachine';
import { TowerStates, TowerTransitions } from './TowerStates';

export class Tower extends ModelAsset {
	/**
	 * Status
	 */
	states: TowerStatesLegacy = new TowerStatesLegacy();
	attackStateLength: number = 750;

	/**
	 * Stats
	 * */
	baseStats: TowerStats;
	stats: TowerStats;

	/**
	 * States
	 * */
	stateMachine: StateMachine;

	/**
	 * UI Elements
	 * */
	UI: TowerUI;

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
		const stateMachine = new StateMachine();

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
