import THREE, { Vector3 } from "three";
import { PathPoint } from "../../data/PathInterfaces";
import { BoundingBoxPlane, PathService } from "../../game/PathService";
import { Main } from "../../core/Main";
import { Maths } from "../../core/Maths";

export class PropCurve {
	/**
	 * Core Properties
	 * */
	main: Main;
	arguments: PropCurveArguments;
	curvePath: THREE.CurvePath<THREE.Vector>;
	zoneOutlinePath: THREE.CurvePath<THREE.Vector> | THREE.CatmullRomCurve3;
	boundingBox: BoundingBoxPlane;
	debugOutline?: THREE.Line;
	debugZoneOutline?: THREE.Line;

	/**
	 * Constructor
	 * */
	constructor(args: PropCurveArguments, main: Main) {
		const sPath: PathService = main.s('Path');
		this.main = main;
		this.arguments = args;
		this.curvePath = sPath.createCurveFromPathPoints(args.curvePathPoints, 0, 0, false);

		if (this.main.debugMode) {
			const sPath: PathService = this.main.s('Path');
			this.debugOutline = sPath.debugCreateOutlines(this.curvePath);
			this.main.scene.add(this.debugOutline);
		}

		return this;
	}

	/**
	 * Creates a number of positions within a PropZone
	 */
	createPositions() {
		const sPath: PathService = this.main.s('Path');

		const curve = sPath.createCurveFromPathPoints(this.arguments.curvePathPoints);
		const curvePoints = curve.getSpacedPoints(2000 / this.arguments.propSparseness);

		// Create positions and initial scale
		let positions: any[] = []; // TODO: Type this
		curvePoints.forEach((curvePoint) => {
			const curvePointVector3 = curvePoint as Vector3;
			const point = new Vector3(curvePointVector3.x, 0, curvePointVector3.z);
			point.x = Maths.addBipolarRandom(point.x, this.arguments.positionRandom);
			point.z = Maths.addBipolarRandom(point.z, this.arguments.positionRandom);
			positions.push({ position: point, scale: { x: this.arguments.propScale, y: 0, z: this.arguments.propScale } });
		});

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
	 * Removes all elements of a PropZone
	 */
	dispose() {
		this.debugOutline && this.main.scene.remove(this.debugOutline);
		this.debugZoneOutline && this.main.scene.remove(this.debugZoneOutline);
	}
}

export interface CreepPathPropCurveArguments {
	propNames: Record<string, any>[],
	propSparseness: number,
	propScale: number;
	positionRandom: number,
	scaleRandom: { all?: number, x?: number, y?: number, z?: number },
}

export interface PropCurveArguments {
	curvePathPoints: PathPoint[],
	propNames: Record<string, any>[],
	propSparseness: number,
	propScale: number;
	positionRandom: number,
	scaleRandom: { all?: number, x?: number, y?: number, z?: number },
}