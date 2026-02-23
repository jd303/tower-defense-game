import THREE, { CatmullRomCurve3, CurvePath, Vector3 } from "three";
import { Main } from "../core/Main";
import { MovePathDefinition, PathMirrorPoint, PathPoint } from "../dataTypes/PathInterfaces";
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
	createMovePath(id: string, pathPoints: PathPoint[], adjustX: number = 0, adjustY: number = 0): MovePathDefinition {
		const path = this.createCurveFromPathPoints(pathPoints, adjustX, adjustY);
		const pathLength = path.getLength();
		const pathDefinition: MovePathDefinition = {
			id: id,
			active: false,
			pathPoints: pathPoints,
			pathLength: pathLength,
			path: path,
			pathProgress: 0,
			pathTravelPercentagePerSec: 0,
			mirrorFacingPercentages: this.calculateMirrorFacingPointsInPath(path)
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

		if (closePath) {
			const lastPoint = points[points.length - 1].point;
			const firstPoint = points[0].point;
			if (lastPoint.distanceTo(firstPoint) > 0) {
				console.error(`Closing path with different end position ${firstPoint.x}, ${firstPoint.y}, ${firstPoint.z}`);
			}
			curvePath.closePath();
		}

		return curvePath;
	}

	/**
	 * Smooths a path by converting it to a curve and returning the points
	 * @param curvePath 
	 * @returns 
	 */
	smoothPathByConversion(curvePath: THREE.CurvePath<any>) {
		const sampledPoints = curvePath.getPoints(100); // or more, depending on desired resolution

		// Smooth it with CatmullRom
		const smoothCurve = new THREE.CatmullRomCurve3(sampledPoints);
		smoothCurve.curveType = 'centripetal'; // centripetal | chordal | catmullrom
		smoothCurve.closed = true; // set true if your curve loops

		return smoothCurve;
	}

	/**
	 * Takes a curve and smooths it by modifying points.  Creates a path
	 * @param curvePath 
	 * @param radius Lower numbers produce tighter curves
	 * @returns THREE.CatmullRomCurve3
	 */
	smoothPathByPoints(curvePath: THREE.CurvePath<any>, radius: number = 1, segments: number = 6) {
		radius = Math.max(0.1, radius);
		segments = Math.max(1, segments);

		const points = curvePath.getPoints(20);

		const newPath = [];
		newPath.push(points[0]);

		for (let i = 1; i < points.length - 1; i++) {
			const p1 = points[i - 1];
			const p2 = points[i]; // The "Harsh Corner"
			const p3 = points[i + 1];

			// 1. Calculate directions
			const dir1 = new THREE.Vector3().subVectors(p1, p2).normalize();
			const dir2 = new THREE.Vector3().subVectors(p3, p2).normalize();

			// 2. Determine actual offset (cannot be longer than half the segment length)
			const len1 = p1.distanceTo(p2);
			const len2 = p3.distanceTo(p2);
			const actualRadius = Math.min(radius, len1 / 2, len2 / 2);

			// 3. Find the start and end of the curve
			const startPoint = new THREE.Vector3().addVectors(p2, dir1.multiplyScalar(actualRadius));
			const endPoint = new THREE.Vector3().addVectors(p2, dir2.multiplyScalar(actualRadius));

			// 4. Generate points along a Quadratic Bezier curve
			// The corner (p2) acts as the control point
			for (let j = 0; j <= segments; j++) {
				const t = j / segments;
				const pt = new THREE.Vector3();

				// Quadratic Bezier Formula: (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
				pt.x = Math.pow(1 - t, 2) * startPoint.x + 2 * (1 - t) * t * p2.x + Math.pow(t, 2) * endPoint.x;
				pt.y = Math.pow(1 - t, 2) * startPoint.y + 2 * (1 - t) * t * p2.y + Math.pow(t, 2) * endPoint.y;
				pt.z = Math.pow(1 - t, 2) * startPoint.z + 2 * (1 - t) * t * p2.z + Math.pow(t, 2) * endPoint.z;

				newPath.push(pt);
			}
		}

		newPath.push(points[points.length - 1]); // End at the last point
		return new THREE.CatmullRomCurve3(newPath);
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
	 * Finds the closest point on a path from a given position
	 * @param curve 
	 * @param testPoint 
	 * @param divisions 
	 * @returns 
	 */
	getClosestPointOnPath(curvePath: CurvePath<any>, comparisonPoint: Vector3, divisions = 200) {
		const points = curvePath.getPoints(divisions);

		let closestPoint = null;
		let minDistance = Infinity;

		for (const p of points) {
			const distance = p.distanceTo(comparisonPoint);
			if (distance < minDistance) {
				minDistance = distance;
				closestPoint = p;
			}
		}

		return { point: closestPoint, distance: minDistance };
	}

	/**
	 * Gets the center point of a curve
	 */
	getBoundingBoxOfCurvePath(curvePath: CurvePath<any>): BoundingBoxPlane {
		const vertices: Vector3[] = curvePath.getPoints();
		let smallestX = 1000, largestX = -1000, smallestZ = 1000, largestZ = -1000;
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
			area: area,
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

	/**
	 * Expands a curve, based on knowing the curve
	 */
	offsetCurveXZ(curve: THREE.Curve<any>, offsetDistance: number, segments = 100) {
		const points = curve.getSpacedPoints(segments);
		const expanded = [];

		for (let i = 0; i < points.length; i++) {
			const p = points[i];

			// Get tangent direction (forward)
			const t = curve.getTangent(i / segments);

			// Only using XZ, ignore Y
			const tangent2D = new THREE.Vector2(t.x, t.z).normalize();

			// Perpendicular in XZ plane
			const normal2D = new THREE.Vector2(-tangent2D.y, tangent2D.x);

			// Offset position
			const offsetPos2D = new THREE.Vector2(p.x, p.z).addScaledVector(normal2D, offsetDistance);
			const offsetPoint = new THREE.Vector3(offsetPos2D.x, p.y, offsetPos2D.y);

			expanded.push(offsetPoint);
		}

		return this.createCurveFromPathPoints(expanded.map(point => { return { point: point } }));
	}

	/**
	 * Expands a curve, based on knowing the control points.
	 * Better for straight line curves
	 * NOTE: Sometimes the path extends the wrong way.  In this case, please redraw the curve with points running the other way around (clockwise, usually)
	 */
	offsetPathFromPointsXZ(points: PathPoint[], offset: number, closed = true) {
		const offsetFixed = (points[1].point.x <= points[0].point.x || points[1].point.z >= points[0].point.z) && offset || -offset;
		const offsetPoints = [];

		for (let i = 0; i < points.length; i++) {
			const prev = points[(i - 1 + points.length) % points.length];
			const curr = points[i];
			const next = points[(i + 1) % points.length];

			const dirA = new THREE.Vector2(curr.point.x - prev.point.x, curr.point.z - prev.point.z).normalize();
			const dirB = new THREE.Vector2(next.point.x - curr.point.x, next.point.z - curr.point.z).normalize();

			const normalA = new THREE.Vector2(-dirA.y, dirA.x);
			const normalB = new THREE.Vector2(-dirB.y, dirB.x);
			const avgNormal = normalA.add(normalB).normalize().multiplyScalar(offsetFixed);

			offsetPoints.push(new THREE.Vector3(curr.point.x + avgNormal.x, curr.point.y, curr.point.z + avgNormal.y));
		}

		// Add the final point again if closing
		if (closed) {
			offsetPoints.push(new THREE.Vector3(offsetPoints[0].x, offsetPoints[0].y, offsetPoints[0].z))
		}

		return this.createCurveFromPathPoints(offsetPoints.map(point => { return { point: point } }), 0, 0, true);
	}

	/**
	 * Converts a CatmullRomCurve3 back to THREE.CurvePath
	 */
	convertFromCatmullRomCurve3(catmullRomCurve3: CatmullRomCurve3, samplePoints = 50) {
		const curvePath = new THREE.CurvePath();
		const points = catmullRomCurve3.getPoints(samplePoints); // Sample 50 points along the curve

		// Create a series of line segments between the sampled points
		for (let i = 0; i < points.length - 1; i++) {
			const lineCurve = new THREE.LineCurve3(points[i], points[i + 1]);
			curvePath.add(lineCurve);
		}

		// If the original curve was closed, connect the last point to the first
		if (catmullRomCurve3.closed) {
			const lineCurve = new THREE.LineCurve3(points[points.length - 1], points[0]);
			curvePath.add(lineCurve);
			curvePath.closePath();
		}

		return curvePath;
	}

	/**
	 * Fills a curve with shapes
	 */
	getShapePlacementsInCurve(curvePath: THREE.CurvePath<THREE.Vector3>, shapeSize: number = 3, shapeGap: number = 2): ShapePlacement[] {
		const boundingBox = this.getBoundingBoxOfCurvePath(curvePath);
		const shapePlacements: ShapePlacement[] = [];

		let zIndex = 0;
		for (let z = boundingBox.smallestZ; z <= boundingBox.largestZ; z += shapeSize + shapeGap) {
			const isEvenRow = Math.floor((z - boundingBox.smallestZ) / (shapeSize + shapeGap)) % 2 === 0;

			let xIndex = 0;
			for (let x = boundingBox.smallestX; x <= boundingBox.largestX; x += shapeSize + shapeGap) {
				const potentialPoint = isEvenRow ? new Vector3(x, 0, z) : new Vector3(x + shapeSize / 2, 0, z);
				if (this.pointIsInCurvePath(potentialPoint, curvePath as THREE.CurvePath<any>)) {
					shapePlacements.push({
						xIndex: xIndex + (isEvenRow && -1 || 0),
						zIndex: zIndex,
						point: potentialPoint
					});
				}

				xIndex++;
			}
			zIndex++;
		}

		return shapePlacements;
	}

	/**
	 * Finds where the path flips x direction significantly
	 */
	calculateMirrorFacingPointsInPath(path: THREE.CurvePath<THREE.Vector>) {
		const checkPoints = 50;
		const checkPointDistance = 1 / checkPoints;

		const mirrorPoints: PathMirrorPoint[] = [];
		let mirrored = false;
		let currentMeasure = 0;
		while (currentMeasure < 1) {
			const currentPoint = path.getPointAt(currentMeasure) as THREE.Vector3;
			const upcomingPoint = path.getPointAt(Math.min(1, currentMeasure + checkPointDistance)) as THREE.Vector3;

			if (currentPoint.x < upcomingPoint.x) {
				mirrored = false;
			} else {
				mirrored = true;
			}

			if (!mirrorPoints.length || mirrorPoints.at(-1)!.mirror != mirrored) {
				mirrorPoints.push({
					perc: currentMeasure,
					mirror: mirrored
				});
			}

			currentMeasure += checkPointDistance;
		}

		return mirrorPoints;
	}

	/**
	 * Returns a point, which is x% between 2 points
	 * @param point1 
	 * @param point2 
	 * @param percentage 
	 */
	static getPercentagePositionBetweenPoints(point1: THREE.Vector3, point2: THREE.Vector3, percentage: number) {
		const xLerp = point1.x + (point2.x - point1.x) * percentage;
		const yLerp = point1.y + (point2.y - point1.y) * percentage;
		const zLerp = point1.z + (point2.z - point1.z) * percentage;
		return new THREE.Vector3(xLerp, yLerp, zLerp);
	}

	/**
	 * DEBUG: Creates outlines of tiles and internal paths
	 */
	debugCreateOutlines(curvePath: THREE.CurvePath<THREE.Vector3> | THREE.CurvePath<THREE.Vector> | THREE.CatmullRomCurve3, color: number = 0x000000): THREE.Line {
		const points = curvePath.getPoints(100);
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(points as THREE.Vector3[]);

		const lineDistances = new Float32Array(points.length);
		let distance = 0;

		for (let i = 1; i < points.length; i++) {
			const distanceAddition = points[i].distanceTo!(points[i - 1]);
			distance += distanceAddition;
			lineDistances[i] = distance;
		}

		lineGeometry.setAttribute('lineDistance', new THREE.BufferAttribute(lineDistances, 1));

		const material = new THREE.LineDashedMaterial({
			color: color,
			dashSize: 1,
			gapSize: 0.5,
			linewidth: 1 // ignored in most browsers due to WebGL restrictions
		});

		const line = new THREE.Line(lineGeometry, material);
		line.position.y = 0.25;
		line.computeLineDistances(); // call this if you haven’t manually set lineDistance

		return line;
	}
}

export interface ShapePlacement {
	xIndex: number;
	zIndex: number;
	point: Vector3;
}

export interface BoundingBoxPlane {
	area: number,
	smallestX: number,
	largestX: number,
	smallestZ: number,
	largestZ: number,
	center: Vector3,
}
