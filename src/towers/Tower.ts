import * as THREE from 'three';
import { Main } from '../core/Main';
import { TickTimeProperties } from '../core/Tick';
import { ModelAsset } from '../ModelAsset';
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

	/**
	 * Places a Tower
	 * */
	placeTower() {
		console.log('PLACE TOWER');
	}
}
