import * as THREE from 'three';
import { Vector3 } from 'three';
import { LevelPathDefinition, PathDefinition, PathSegment, PathTypes, PathGeometryTypes } from '../data/PathInterfaces';

export class LevelPath {
	/**
	 * Setup Properties
	 * */
	variantDistance: number = 5;

	/**
	 * Wave Properties
	 * */
	id: number;
	corePath: LevelPathDefinition = {
		id: 'core',
		segments: [],
		pathLength: 0,
		path: new THREE.CurvePath(),
	};
	variantPaths: LevelPathDefinition[] = [];
	groupMain: THREE.Group; // Contains a pathMesh's groupmain, if created

	/**
	 * Constructor
	 * */
	constructor(pathDefinition: PathDefinition) {
		this.id = pathDefinition.id;
		this.setCorePath(pathDefinition.segments);
		this.createPathGeometry(pathDefinition);

		return this;
	}

	/**
	 * Sets the core path
	 * */
	setCorePath(pathSegments: PathSegment[]) {
		this.corePath.segments = pathSegments;
		this.corePath.path = this.createPathFromSegments(pathSegments);
		this.corePath.pathLength = this.corePath.path.getLength();
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
	 * Creates a variant path for uniqueness
	 * */
	createVariantPath(creepID: string) {
		const variantPath: LevelPathDefinition = {
			id: `${this.corePath.id}_${creepID}`,
			segments: [],
			pathLength: 0,
			path: this.createPathFromSegments(this.corePath.segments, this.getRandomAdjustX(), this.getRandomAdjustZ()),
		};
		variantPath.pathLength = variantPath.path.getLength();
		this.variantPaths.push(variantPath);
		return variantPath;
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
	 * Creates a extruded path shape on the map
	 * */
	createPathGeometry(pathDefinition: PathDefinition) {
		if (pathDefinition.pathGeometry == PathGeometryTypes.none) return;

		const lineWidth = 10;
		const lineHeight = -0.1;

		// Create the path shape
		const shape = new THREE.Shape();
		shape.moveTo(0, -lineWidth / 2);
		shape.lineTo(0, lineWidth / 2);
		shape.lineTo(lineHeight, lineWidth / 2);
		shape.lineTo(lineHeight, -lineWidth / 2);
		shape.lineTo(0, -lineWidth / 2);

		// Extrude Settings
		const extrudeSettings = {
			steps: 50,
			depth: 1,
			bevelEnabled: false,
			extrudePath: this.corePath.path,
		};

		// Create the material
		let pathMaterial;
		switch (pathDefinition.pathGeometry) {
			case PathGeometryTypes.dirt:
				pathMaterial = new THREE.MeshStandardMaterial({ color: 0xbfa340 });
				break;
			case PathGeometryTypes.rock:
				pathMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
				break;
		}

		// Create the geometry and mesh and attach
		const pathGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings as any);
		const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
		pathMesh.name = 'LevelPath';

		// Create group
		this.groupMain = new THREE.Group();
		this.groupMain.name = 'LevelPath';
		this.groupMain.add(pathMesh);

		// Add shadows
		this.groupMain.children.forEach((child: any) => {
			if (child.isMesh) {
				child.castShadow = false;
				child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}

	getRandomAdjustX() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}

	getRandomAdjustZ() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}
}
