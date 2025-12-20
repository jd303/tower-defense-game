import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Interactable2, InteractableOrders, InteractionService2 } from '../../game/InteractionService2';
import { EnvironmentTile } from '../EnvironmentTile';
import { PathPoint } from '../../data/PathInterfaces';
import { PathService } from '../../game/PathService';
import { Tower } from './Tower';

export class TowerPlacementZone {
	/**
	 * Definitions
	 * */
	main: Main;
	towerPlacementCommons: TowerPlacementCommons;
	pathPoints: PathPoint[];
	environmentTile: EnvironmentTile;
	placementTilePositions: TowerZoneShapePlacement[] = [];
	placementTiles: EnvironmentTile[] = [];
	castShadows: boolean = false;
	receiveShaodws: boolean = true;
	curvePath: THREE.CurvePath<any>;

	/**
	 * Constructor
	 * */
	constructor(points: PathPoint[], towerPlacementCommons: TowerPlacementCommons, main: Main) {
		this.main = main;
		this.towerPlacementCommons = towerPlacementCommons;
		this.pathPoints = points;
		const sPath: PathService = main.s('Path');
		const curvePath = sPath.createCurveFromPathPoints(points, 0, 0, true);
		const smoothCurve = sPath.smoothCurve(curvePath);
		this.curvePath = sPath.convertFromCatmullRomCurve3(smoothCurve, 100);
		this.environmentTile = new EnvironmentTile(this.curvePath, main, 0xC4B271);
		this.main.scene.add(this.environmentTile.groupMain);

		const shapePlacements = sPath.getShapePlacementsInCurve(this.curvePath, this.towerPlacementCommons.placementTileSize, 0.75);
		this.placementTilePositions = shapePlacements.map((placement) => { return new TowerZoneShapePlacement(placement.xIndex, placement.zIndex, placement.point); });

		if (this.main.debugMode) {
			sPath.debugCreateOutlines(this.curvePath);
		}

		return this;
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive(interactive: boolean) {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		this.placementTiles.forEach((tile) => {
			if (interactive) {
				sInteraction2.registerInteractable(new Interactable2('towerPlacementZone', InteractableOrders.pathsAndTiles, tile));
			} else {
				sInteraction2.deregisterInteractableByObject(tile);
			}
		});
	}

	/**
	 * Shows the placement tile
	 */
	showPlacementTile(visible: boolean) {
		if (visible) {
			const filledPlacementTiles = this.placementTilePositions.filter((placement) => { return placement.tower != null; });
			console.log("FILLED", filledPlacementTiles);
			const blockedTiles: { xIndex: number, zIndex: number }[] = [];
			filledPlacementTiles.forEach((placement) => {
				blockedTiles.push({ xIndex: placement.xIndex, zIndex: placement.zIndex });
				blockedTiles.push({ xIndex: placement.xIndex - 1, zIndex: placement.zIndex });
				blockedTiles.push({ xIndex: placement.xIndex + 1, zIndex: placement.zIndex });

				// When zIndex is odd, xIndex changes
				if (placement.zIndex % 2 !== 0) {
					blockedTiles.push({ xIndex: placement.xIndex - 1, zIndex: placement.zIndex - 1 });
					blockedTiles.push({ xIndex: placement.xIndex - 1, zIndex: placement.zIndex + 1 });
					blockedTiles.push({ xIndex: placement.xIndex, zIndex: placement.zIndex - 1 });
					blockedTiles.push({ xIndex: placement.xIndex, zIndex: placement.zIndex + 1 });
				}
				else {
					blockedTiles.push({ xIndex: placement.xIndex, zIndex: placement.zIndex - 1 });
					blockedTiles.push({ xIndex: placement.xIndex, zIndex: placement.zIndex + 1 });
					blockedTiles.push({ xIndex: placement.xIndex + 1, zIndex: placement.zIndex - 1 });
					blockedTiles.push({ xIndex: placement.xIndex + 1, zIndex: placement.zIndex + 1 });
				}
			});

			this.placementTilePositions.forEach((placement) => {
				if (placement.tower) return; // Don't show used ones
				if (blockedTiles.find((blockedTile) => { console.log(blockedTile, placement); return blockedTile.xIndex == placement.xIndex && blockedTile.zIndex == placement.zIndex; })) return; // Don't show blocked tiles

				const environmentTile = new EnvironmentTile(this.towerPlacementCommons.placementTileCurve, this.main, 0x000000, placement);
				environmentTile.groupMain.position.set(placement.point.x, 0.15, placement.point.z);
				this.placementTiles.push(environmentTile);
				this.main.scene.add(environmentTile.groupMain);
			});
			this.setInteractive(true);
		} else {
			this.setInteractive(false);
			this.placementTiles.forEach((tile) => {
				this.main.scene.remove(tile.groupMain);
			});
			this.placementTiles = [];
		}
	}

	/**
	 * Disposes this Tower Placement Zone
	 */
	dispose() {
		this.environmentTile.dispose();
	}
}

export class TowerPlacementCommons {
	main: Main;
	placementTileSize: number = 4;
	placementTileCurve: THREE.Curve<any>;

	constructor(main: Main) {
		this.main = main;
		this.placementTileCurve = this.createPlacementTile();
	}

	createPlacementTile = () => {
		console.log("%c TODO NEXT: Disable placement tiles when they're used, and add radius to towers, invalidating placement tiles", "color: red; font-weight: bold;");
		const sPath: PathService = this.main.s('Path');

		const baseCurve = new THREE.EllipseCurve(
			0, 0,           // center x, y
			this.placementTileSize / 2, this.placementTileSize / 2, // xRadius, yRadius
			0, 2 * Math.PI, // startAngle, endAngle
			false,          // clockwise
			0               // rotation
		);
		const points = baseCurve.getPoints(20);
		const vector3Points = points.map(p => { return { point: new THREE.Vector3(p.x, 0, p.y) } });
		const curve = sPath.createCurveFromPathPoints(vector3Points);

		return curve;
	}
}

export class TowerZoneShapePlacement {
	xIndex: number;
	zIndex: number;
	point: THREE.Vector3;
	tower: Tower | null;

	constructor(xIndex: number, zIndex: number, point: THREE.Vector3) {
		this.xIndex = xIndex;
		this.zIndex = zIndex;
		this.point = point;
		this.tower = null;
	}

	/**
	 * Registers a tower to this placement
	 */
	addTowerToTowerZoneShapePlacement(tower: Tower) {
		this.tower = tower;
	}
}

export interface TowerPlacementZoneDefinition {
	points: PathPoint[];
}
