import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Interactable2, InteractableOrders, InteractionService2 } from '../../game/InteractionService2';
import { EnvironmentTile } from '../EnvironmentTile';
import { PathPoint } from '../../data/PathInterfaces';
import { PathService } from '../../game/PathService';

export class TowerPlacementZone {
	/**
	 * Definitions
	 * */
	main: Main;
	pathPoints: PathPoint[];
	environmentTile: EnvironmentTile;
	placementTile: EnvironmentTile | null;
	castShadows: boolean = false;
	receiveShaodws: boolean = true;
	curvePath: THREE.CurvePath<any>;

	/**
	 * Three Objects
	 * */
	groupMain: THREE.Group;

	/**
	 * Constructor
	 * */
	constructor(points: PathPoint[], main: Main) {
		this.main = main;
		this.pathPoints = points;
		const sPath: PathService = main.s('Path');
		const curvePath = sPath.createCurveFromPathPoints(points, 0, 0, true);
		const smoothCurve = sPath.smoothCurve(curvePath);
		this.curvePath = sPath.convertFromCatmullRomCurve3(smoothCurve, 100);
		this.environmentTile = new EnvironmentTile(this.curvePath, main, 0xC4B271);
		this.main.scene.add(this.environmentTile.groupMain);
		this.groupMain = new THREE.Group();

		if (this.main.debugMode) {
			sPath.debugCreateOutlines(this.curvePath);
		}

		return this;
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive(interactive: boolean) {
		if (this.placementTile) {
			const sInteraction2: InteractionService2 = this.main.s('Interaction2');
			if (interactive) {
				sInteraction2.registerInteractable(new Interactable2('towerPlacementZone', InteractableOrders.pathsAndTiles, this.placementTile));
			} else {
				sInteraction2.deregisterInteractableByObject(this.placementTile);
			}
		}
	}

	/**
	 * Shows the placement tile
	 */
	showPlacementTile(visible: boolean) {
		const sPath: PathService = this.main.s('Path');
		if (visible) {
			const placementTilePath = sPath.offsetPathFromPointsXZ(this.pathPoints, -1);
			this.placementTile = new EnvironmentTile(placementTilePath, this.main, 0x000000);
			this.placementTile.groupMain.position.y = 0.25;
			this.main.scene.add(this.placementTile.groupMain);
			this.setInteractive(true);
		} else if (this.placementTile) {
			this.setInteractive(false);
			this.main.scene.remove(this.placementTile.groupMain);
			this.placementTile = null;
		}
	}
}

export interface TowerPlacementZoneDefinition {
	points: PathPoint[];
}