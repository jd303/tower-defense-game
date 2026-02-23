import THREE, { Vector3 } from "three";
import { PathPoint } from "../../dataTypes/PathInterfaces";
import { BoundingBoxPlane, PathService } from "../../game/PathService";
import { Main } from "../../core/Main";
import { Maths } from "../../core/Maths";
import { EnvironmentTile, EnvironmentTileProperties } from "../EnvironmentTile";
import { SplineBuilder } from "../../core/SplineBuilder";
import { DebugService } from "../../core/DebugService";
import { PointsLogger } from "../../core/PointsLogger";

export class PropZone {
	/**
	 * Core Properties
	 * */
	main: Main;
	arguments: PropZoneArguments;
	curvePath: THREE.CurvePath<THREE.Vector>;
	environmentTileComponents: PropZoneEnvironmentTileDefinition;
	boundingBox: BoundingBoxPlane;
	debugOutline?: THREE.Line;
	debugSplineBuilder: SplineBuilder;

	/**
	 * Constructor
	 * */
	constructor(args: PropZoneArguments, main: Main) {
		this.main = main;
		this.arguments = args;

		this.build();

		if (this.main.debugMode) {
			const sPath: PathService = this.main.s('Path');
			this.debugOutline = sPath.debugCreateOutlines(this.curvePath);
			this.main.scene.add(this.debugOutline);
			this.registerEditor();
		}

		return this;
	}

	/**
	 * Builds the components
	 */
	build() {
		const sPath: PathService = this.main.s('Path');

		this.curvePath = sPath.createCurveFromPathPoints(this.arguments.zonePoints, 0, 0, true);
		this.boundingBox = sPath.getBoundingBoxOfCurvePath(this.curvePath);

		if (this.arguments.environmentTile) {
			this.createEnvironmentTile();
		}
	}

	/**
	 * Creates a number of positions within a PropZone
	 */
	createPositions() {
		const sPath: PathService = this.main.s('Path');

		// Create positions and initial scale
		let positions: any[] = []; // TODO: Type this
		for (let x = this.boundingBox.smallestX; x < this.boundingBox.largestX; x += Math.max(this.arguments.propSparseness, 1)) {
			for (let z = this.boundingBox.smallestZ; z < this.boundingBox.largestZ; z += Math.max(this.arguments.propSparseness, 1)) {
				const point = new Vector3(x, 0, z);
				point.x = Maths.addBipolarRandom(point.x, this.arguments.positionRandom);
				point.z = Maths.addBipolarRandom(point.z, this.arguments.positionRandom);
				if (sPath.pointIsInCurvePath(new Vector3(point.x, 0, point.z), this.curvePath)) {
					positions.push({ position: point, scale: { x: this.arguments.propScale, y: this.arguments.propScale, z: this.arguments.propScale } });
				}
			}
		}

		// Adjust dynamic scaling
		if (this.arguments.dynamicScaling) {
			const scaling = this.arguments.dynamicScaling;
			positions.forEach((point) => {
				const closestPoint = scaling.scalePoints.reduce((min, item) => item.point.distanceTo(point.position) < min.point.distanceTo(point.position) ? item : min);
				const distanceToClosestPoint = point.position.distanceTo(closestPoint.point);
				let attenuatedValue = Maths.getAttenuatedValue(distanceToClosestPoint, 0, scaling.attentuationDistance, 1, scaling.attenuatedScale, this.arguments.propScale);
				point.scale = { x: point.scale.x + attenuatedValue, y: point.scale.y + attenuatedValue, z: point.scale.z + attenuatedValue };
			});
			positions = positions.filter(position => position.scale.x > 0 && position.scale.y > 0 && position.scale.z > 0);
		}

		// Adjust random scaling
		if (this.arguments.scaleRandom) {
			positions.forEach((point) => {
				if (this.arguments.scaleRandom.all) {
					const random = Maths.addBipolarRandom(0, this.arguments.scaleRandom.all);
					const scale = Math.max(0.1, point.scale.x + random);
					point.scale = { x: scale, y: scale, z: scale }
				}
				if (this.arguments.scaleRandom.x) {
					point.scale.x = Math.max(0.1, Maths.addBipolarRandom(point.scale.x, this.arguments.scaleRandom.x));
				}
				if (this.arguments.scaleRandom.y) {
					point.scale.y = Math.max(0.1, Maths.addBipolarRandom(point.scale.y, this.arguments.scaleRandom.y));
				}
				if (this.arguments.scaleRandom.z) {
					point.scale.z = Math.max(0.1, Maths.addBipolarRandom(point.scale.z, this.arguments.scaleRandom.z));
				}
			});
		}

		return positions;
	}

	/**
	 * Creates an environment tile
	 * @returns 
	 */
	createEnvironmentTile() {
		const sPath: PathService = this.main.s('Path');

		const zoneOutlinePath: THREE.CurvePath<THREE.Vector> | THREE.CatmullRomCurve3 = sPath.offsetPathFromPointsXZ(this.arguments.zonePoints, (this.arguments.environmentTile as EnvironmentTileProperties)!.distance!, true);
		const environmentTile = new EnvironmentTile(zoneOutlinePath, this.main, this.arguments.environmentTile as EnvironmentTileProperties);
		this.main.scene.add(environmentTile.groupMain);

		this.environmentTileComponents = {
			environmentTile: environmentTile,
			tileOutlinePath: zoneOutlinePath
		}
	}

	/**
	 * Reviews the zone, finding the approximate furthest distance to a curvepoint
	 */
	/*determineFurthestDistanceToCurveInZone() {
		const sPath: PathService = this.main.s('Path');

		const width = this.boundingBox.largestX - this.boundingBox.smallestX;
		const height = this.boundingBox.largestZ - this.boundingBox.smallestZ;
		const widthSamples = width / Math.max((Math.abs(this.boundingBox.area) / 200), 4);
		const heightSamples = height / Math.max((Math.abs(this.boundingBox.area) / 200), 4);

		let furthestDistance = 0;
		for (let x = this.boundingBox.smallestX; x < (this.boundingBox.largestX - this.boundingBox.smallestX); x += widthSamples) {
			for (let z = this.boundingBox.smallestZ; z < (this.boundingBox.largestZ - this.boundingBox.smallestZ); z += heightSamples) {
				if (sPath.pointIsInCurvePath(new Vector3(x, 0, z), this.curvePath)) {
					furthestDistance = Math.max(furthestDistance, sPath.getClosestPointOnPath(this.curvePath, new Vector3(x, 0, z)).distance);
				}
			}
		}

		return furthestDistance;
	}*/

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

		PointsLogger.log(this.arguments.zonePoints, true, "PropZone Path");
	}

	/**
	 * Removes all elements of a PropZone
	 */
	dispose() {
		this.debugOutline && this.main.scene.remove(this.debugOutline);
		this.environmentTileComponents?.environmentTile.dispose();
	}
}

type PropZoneEnvironmentTileDefinition = {
	environmentTile: EnvironmentTile;
	tileOutlinePath: THREE.CurvePath<THREE.Vector> | THREE.CatmullRomCurve3;

}

export interface PropZoneArguments {
	propNames: Record<string, any>[],
	zonePoints: PathPoint[],
	propSparseness: number,
	propScale: number;
	dynamicScaling?: PropZoneScaling,
	positionRandom: number,
	scaleRandom: { all?: number, x?: number, y?: number, z?: number },
	environmentTile: EnvironmentTileProperties | false
}

export interface PropZoneScaling {
	scalePoints: PathPoint[],
	attentuationDistance: number,
	attenuatedScale: number
}