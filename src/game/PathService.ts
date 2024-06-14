import THREE, { Vector3 } from "three";
import { Main } from "../core/Main";
import { MovePathDefinition, PathSegment, PathTypes } from "../data/PathInterfaces";

export class PathService {
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Creates a Move Path
	 * */
	createMovePath(id: string, pathSegments: PathSegment[], adjustX: number = 0, adjustY: number = 0) {
		const path = this.createPathFromSegments(pathSegments, adjustX, adjustY);
		const pathLength = path.getLength();
		const pathDefinition: MovePathDefinition = {
			id: id,
			active: false,
			segments: pathSegments,
			pathLength: pathLength,
			path: path,
			pathProgress: 0,
			pathTravelPercentagePerSec: 0
		};

		return pathDefinition;
	}

	/**
	 * Creates a Three CurvePath
	 * */
	createPathFromSegments(pathSegments: PathSegment[], adjustX: number = 0, adjustZ: number = 0) {
		const curvePath = new THREE.CurvePath();
		let pathSegmentsClone = this.cloneSegmentsArray(pathSegments);

		// Adjust the path if an adjustment given
		if (adjustX || adjustZ) {
			pathSegmentsClone.forEach((segment: PathSegment) =>
				segment.points.forEach((segment) => {
					segment.x += adjustX;
					segment.z += adjustZ;
				})
			);
		}

		// Create paths from a combination of path segments
		pathSegmentsClone.forEach((segment: PathSegment) => {
			let curvePart;
			switch (segment.type) {
				case PathTypes.bezier:
					curvePart = this.addBezierPath(segment.points, segment.controlPoints!);
					break;
				default:
					curvePart = this.addLinePath(segment.points);
					break;
			}

			curvePath.add(curvePart);
		});

		return curvePath;
	}

	/**
	 * Creates a straight path segment
	 */
	createStraightPathSegments(startPos: Vector3, endPos: Vector3) {
		const pathSegments: PathSegment[] = [{
			type: PathTypes.straight,
			points: [startPos, endPos]
		}];

		return pathSegments;
	}

	/**
	 * Creates an array of segments from a list of points
	 */
	/*createSegmentArrayFromPoints(points: Vector3[] | { x: number, y: number, z: number }[], controlPoints: Vector3[] | { x: number, y: number, z: number }[] = [], type: PathTypes = PathTypes.bezier): PathSegment[] {
		const vectorPoints = points.map(point => {
			const vectorPoint = point instanceof Vector3 && point || new Vector3(point.x, point.y, point.z);
			return {
				type: type,
				points: Vector3[],
				controlPoints?: Vector3[];
			}
		});
		const segmentsArray = 
		return [];
	}*/

	/**
	 * Convenience function: calls createSegmentArrayFromPoints and createPathFromSegments
	 */
	/*createPathFromPoints(points: Vector3[] | { x: number, y: number, z: number }[], type: PathTypes = PathTypes.bezier) {
		const segmentsArray = this.createSegmentArrayFromPoints(points, type);
		const path = this.createPathFromSegments(segmentsArray);
		return path;
	}*/

	/**
	 * Makes a copy of an array and a clone of object items
	 * */
	cloneSegmentsArray(pathSegments: PathSegment[]) {
		const newPathSegments: PathSegment[] = [];
		pathSegments.forEach((pathSegment: PathSegment) => {
			const newPathSegment = {
				type: pathSegment.type,
				points: pathSegment.points.map((point) => new Vector3(point.x, point.y, point.z)),
				controlPoints: pathSegment.controlPoints?.map((point) => new Vector3(point.x, point.y, point.z)),
			};
			newPathSegments.push(newPathSegment);
		});

		return newPathSegments;
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
}