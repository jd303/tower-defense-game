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
			segments: pathSegments,
			pathLength: pathLength,
			path: path
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