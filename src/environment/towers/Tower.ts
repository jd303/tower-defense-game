import * as THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { ModelAsset } from '../ModelAsset';
import { UIProperties, UITypes } from '../../UIProperties';
import { TowerStates } from './TowerStats';

export class Tower extends ModelAsset {
	/**
	 * Status
	 */
	states: TowerStates = new TowerStates();
	attackStateLength: number = 750;

	constructor(main: Main) {
		super(main);
		this.main = main;
		this.groupMain = new THREE.Group();
		this.groupTransforms = new THREE.Group();
		this.groupModel = new THREE.Group();
		this.groupTransforms.add(this.groupModel);
		this.groupMain.add(this.groupTransforms);
	}

	/**
	 * Overwriteable animation
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
