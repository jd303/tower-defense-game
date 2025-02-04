import THREE, { CurvePath, Vector3 } from "three";
import { Main } from "../core/Main";
import { MovePathDefinition, PathPoint } from "../data/PathInterfaces";
import { Service } from "../core/Service";

export class PathService extends Service {
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
	}

	/**
	 * Creates a Move Path
	 * */
	createMovePath(id: string, pathPoints: PathPoint[], adjustX: number = 0, adjustY: number = 0) {
		const path = this.createCurveFromPathPoints(pathPoints, adjustX, adjustY);
		const pathLength = path.getLength();
		const pathDefinition: MovePathDefinition = {
			id: id,
			active: false,
			pathPoints: pathPoints,
			pathLength: pathLength,
			path: path,
			pathProgress: 0,
			pathTravelPercentagePerSec: 0
		};

		return pathDefinition;
	}

	/**
	 * Creates a path from PathPoints
	 */
	createCurveFromPathPoints(points: PathPoint[], adjustX: number = 0, adjustZ: number = 0, closePath: boolean = false) {
		const curvePath = new THREE.CurvePath();

		// Create paths from a combination of path segments
		points.forEach((thisPoint: PathPoint, index: number) => {
			const nextPoint = points[index + 1];
			if (!nextPoint) return;

			let curvePart;
			const workingPoint = this.clonePathPoint(thisPoint);
			const workingNextPoint = this.clonePathPoint(nextPoint);

			// Adjust the path if an adjustment given
			if (adjustX || adjustZ) {
				this.applyAdjustmentToPathPoint(workingPoint, adjustX, adjustZ);
				this.applyAdjustmentToPathPoint(workingNextPoint, adjustX, adjustZ);
			}

			// If either of the points have defined control points, go bezier
			if (workingPoint.outgoingControlPoint || workingNextPoint.incomingControlPoint) {
				curvePart = this.addBezierPath([
					workingPoint.point,
					workingNextPoint.point
				],
					[
						workingPoint.outgoingControlPoint || workingPoint.point,
						workingNextPoint.incomingControlPoint || workingNextPoint.point
					]);

				// No controlPoints given, so it's a straight line
			} else {
				curvePart = this.addLinePath([
					workingPoint.point,
					workingNextPoint.point
				]);
			}

			curvePath.add(curvePart);
		});

		if (closePath) curvePath.closePath();
		return curvePath;
	}

	/**
	 * Clones the properties of a PathPoint
	 */
	clonePathPoint(pathPoint: PathPoint) {
		const newPathPoint: PathPoint = {
			point: new Vector3(pathPoint.point.x, pathPoint.point.y, pathPoint.point.z)
		};

		if (pathPoint.incomingControlPoint) {
			newPathPoint.incomingControlPoint = new Vector3(pathPoint.incomingControlPoint.x, pathPoint.incomingControlPoint.y, pathPoint.incomingControlPoint.z)
		}

		if (pathPoint.outgoingControlPoint) {
			newPathPoint.outgoingControlPoint = new Vector3(pathPoint.outgoingControlPoint.x, pathPoint.outgoingControlPoint.y, pathPoint.outgoingControlPoint.z)
		}

		return newPathPoint;
	}

	/**
	 * Applies an X and Z adjustment to a PathPoint
	 */
	applyAdjustmentToPathPoint(pathPoint: PathPoint, adjustX: number, adjustZ: number) {
		let adjustedX = adjustX || 0;
		let adjustedZ = adjustZ || 0;
		pathPoint.point.x += adjustedX;
		pathPoint.point.z += adjustedZ;
		if (pathPoint.incomingControlPoint) pathPoint.incomingControlPoint.x += adjustedX;
		if (pathPoint.outgoingControlPoint) pathPoint.outgoingControlPoint.x += adjustedX;
		if (pathPoint.incomingControlPoint) pathPoint.incomingControlPoint.z += adjustedZ;
		if (pathPoint.outgoingControlPoint) pathPoint.outgoingControlPoint.z += adjustedZ;
	}

	/**
	 * Creates a Bezier Curve
	 * */
	addBezierPath(points: Vector3[], controlPoints: Vector3[]): THREE.CubicBezierCurve3 {
		return new THREE.CubicBezierCurve3(points[0], controlPoints[0], controlPoints[1], points[1]);
	}

	/**
	 * Creates a Straight Line
	 * */
	addLinePath(points: Vector3[]): THREE.LineCurve3 {
		return new THREE.LineCurve3(points[0], points[1]);
	}

	/**
	 * Determines if a point is in a polygon of straight edges
	 */
	pointIsInCurvePath(point: Vector3, curvePath: CurvePath<any>) {
		const polygon: Vector3[] = curvePath.getPoints();
		const px = point.x;
		const pz = point.z;
		let isInside = false;

		for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
			const ix = polygon[i].x;
			const iz = polygon[i].z;
			const jx = polygon[j].x;
			const jz = polygon[j].z;

			// Check if the point is on an edge
			if ((iz > pz) !== (jz > pz) && px < (jx - ix) * (pz - iz) / (jz - iz) + ix) {
				isInside = !isInside;
			}
		}

		return isInside;
	}

	/**
	 * Gets the center point of a curve
	 */
	getBoundingBoxOfCurvePath(curvePath: CurvePath<any>) {
		const vertices: Vector3[] = curvePath.getPoints();
		let smallestX = 0, largestX = 0, smallestZ = 0, largestZ = 0;
		let xSum = 0, zSum = 0, areaSum = 0;

		for (let i = 0, len = vertices.length; i < len; i++) {
			const x0 = vertices[i].x;
			const z0 = vertices[i].z;
			const x1 = vertices[(i + 1) % len].x;
			const z1 = vertices[(i + 1) % len].z;

			// This may end up being problematic or causing inaccuracies; we ignore if any values are not found
			if (x0 === undefined || z0 === undefined || x1 === undefined || z1 === undefined) continue;

			smallestX = Math.min(x0, smallestX);
			largestX = Math.max(x0, largestX);
			smallestZ = Math.min(z0, smallestZ);
			largestZ = Math.max(z0, largestZ);

			const crossProduct = x0 * z1 - x1 * z0;
			xSum += (x0 + x1) * crossProduct;
			zSum += (z0 + z1) * crossProduct;
			areaSum += crossProduct;
		}

		const area = areaSum / 2;
		const centroidX = xSum / (6 * area);
		const centroidZ = zSum / (6 * area);

		return {
			smallestX: smallestX,
			largestX: largestX,
			smallestZ: smallestZ,
			largestZ: largestZ,
			center: new Vector3(centroidX, 0, centroidZ)
		}

		// Example usage:
		/*const polygon = [
			[0, 0], [4, 0], [4, 3], [0, 3]
		];
		const centroid = getPolygonCentroid(polygon);

		console.log(centroid);  // Output: [2, 1.5]*/
	}
}