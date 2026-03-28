import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Interactable2, InteractableOrders, InteractionService2 } from '../../game/InteractionService2';
import { EnvironmentTile, EnvironmentTileProperties } from '../EnvironmentTile';
import { PathPoint } from '../../dataTypes/PathInterfaces';
import { PathService } from '../../game/PathService';
import { Tower } from './Tower';
import { DebugService } from '../../core/DebugService';
import { PointsLogger } from '../../core/PointsLogger';

export class TowerPlacementZone {
	/**
	 * Definitions
	 * */
	main: Main;
	arguments: TowerPlacementArguments;
	towerPlacementCommons: TowerPlacementCommons;
	environmentTile: EnvironmentTile;
	placementTilePositions: TowerZoneShapePlacement[] = [];
	placementTiles: EnvironmentTile[] = [];
	curvePath: THREE.CurvePath<any>;

	static environmentTileProperties: EnvironmentTileProperties = {
		type: "land",
		colour: 0xC4B271,
		bevelColour: 0x71622F,
		distance: 1,
		smooth: true
	}

	/**
	 * Constructor
	 * */
	constructor(args: TowerPlacementArguments, towerPlacementCommons: TowerPlacementCommons, main: Main) {
		this.main = main;
		this.towerPlacementCommons = towerPlacementCommons;
		this.arguments = args;

		this.build();

		if (this.main.debugMode) {
			const sPath: PathService = this.main.s('Path');
			sPath.debugCreateOutlines(this.curvePath);
			this.registerEditor();
		}

		return this;
	}

	/**
	 * Builds the objects
	 */
	build() {
		const sPath: PathService = this.main.s('Path');
		const curvePath = sPath.createCurveFromPathPoints(this.arguments.zonePoints, 0, 0, true);
		const smoothPath = sPath.smoothPathByPoints(curvePath);
		this.curvePath = sPath.convertFromCatmullRomCurve3(smoothPath, 100);
		this.environmentTile = new EnvironmentTile(this.curvePath, this.main, TowerPlacementZone.environmentTileProperties);
		//this.main.scene.add(this.environmentTile.groupMain);

		const shapePlacements = sPath.getShapePlacementsInCurve(this.curvePath, this.towerPlacementCommons.placementTileSize, 0.75);
		this.placementTilePositions = shapePlacements.map((placement) => { return new TowerZoneShapePlacement(placement.xIndex, placement.zIndex, placement.point); });
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
				if (blockedTiles.find((blockedTile) => blockedTile.xIndex == placement.xIndex && blockedTile.zIndex == placement.zIndex)) return; // Don't show blocked tiles

				const environmentTile = new EnvironmentTile(this.towerPlacementCommons.placementTileCurve, this.main, TowerPlacementZone.environmentTileProperties, placement);
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
	 * Creates controls for editing propZones
	 */
	registerEditor() {
		const sDebug: DebugService = this.main.s('Debug');
		sDebug.levelEditor?.registerExistingZone(this);
	}
	debugZoneEditorUpdated(pathPoints: PathPoint[]) {
		this.arguments.zonePoints = pathPoints;
		this.dispose();
		this.build();

		PointsLogger.log(this.arguments.zonePoints, true, "TPZ Path");
	}

	/**
	 * Disposes this Tower Placement Zone
	 */
	dispose() {
		this.environmentTile.dispose();
	}
}

export interface TowerPlacementArguments {
	zonePoints: PathPoint[]
}

export class TowerPlacementCommons {
	main: Main;
	placementTileSize: number = 4;
	placementTileCurve: THREE.CurvePath<any>;

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
	zonePoints: PathPoint[];
}
