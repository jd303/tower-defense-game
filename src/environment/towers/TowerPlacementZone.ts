import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Interactable2, InteractableOrders } from '../../game/InteractionService2';
import { EnvironmentTile } from '../EnvironmentTile';
import { PathPoint } from '../../data/PathInterfaces';
import { PathService } from '../../game/PathService';

export class TowerPlacementZone {
	/**
	 * Definitions
	 * */
	main: Main;
	environmentTile: EnvironmentTile;
	castShadows: boolean = false;
	receiveShaodws: boolean = true;

	/**
	 * Three Objects
	 * */
	groupMain: THREE.Group;

	/**
	 * Constructor
	 * */
	constructor(points: PathPoint[], main: Main) {
		const sPath: PathService = main.s('Path');
		const curvePath = sPath.createCurveFromPathPoints(points, 0, 0, true);
		//const smoothCurve = sPath.smoothCurve(curvePath);
		this.environmentTile = new EnvironmentTile(curvePath, main, 0xC4B271);
		this.main = main;
		this.groupMain = new THREE.Group();

		this.setInteractive();

		return this;
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive() {
		const sInteraction2 = this.main.s('Interaction2');
		sInteraction2.registerInteractable(new Interactable2('towerPlacementZone', InteractableOrders.pathsAndTiles, this.environmentTile));
	}
}

export interface TowerPlacementZoneDefinition {
	points: PathPoint[];
}