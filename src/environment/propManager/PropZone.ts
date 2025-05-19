import THREE, { Vector3 } from "three";
import { PathPoint } from "../../data/PathInterfaces";
import { BoundingBoxPlane, PathService } from "../../game/PathService";
import { Main } from "../../core/Main";
import { Maths } from "../../core/Maths";
import { EnvironmentTile } from "../EnvironmentTile";

export class PropZone {
	/**
	 * Core Properties
	 * */
	main: Main;
	arguments: PropZoneArguments;
	curvePath: THREE.CurvePath<THREE.Vector>;
	zoneOutlinePath: THREE.CurvePath<THREE.Vector> | THREE.CatmullRomCurve3;
	boundingBox: BoundingBoxPlane;

	/**
	 * Constructor
	 * */
	constructor(args: PropZoneArguments, main: Main) {
		const sPath: PathService = main.s('Path');
		this.main = main;
		this.arguments = args;
		this.curvePath = sPath.createCurveFromPathPoints(args.zonePathPoints, 0, 0, true);
		this.boundingBox = sPath.getBoundingBoxOfCurvePath(this.curvePath);

		if (args.environmentTile.show) {
			this.zoneOutlinePath = sPath.offsetPathFromPointsXZ(args.zonePathPoints, args.environmentTile!.distance!, true);
			this.zoneOutlinePath = sPath.smoothCurve(this.zoneOutlinePath);
		}

		return this;
	}

	/**
	 * Creates a number of positions within a PropZone
	 */
	createPositions() {
		const sPath: PathService = this.main.s('Path');

		let positions: any[] = []; // TODO: Type this
		for (let x = this.boundingBox.smallestX; x < this.boundingBox.largestX; x += this.arguments.propDensityFactor) {
			for (let z = this.boundingBox.smallestZ; z < this.boundingBox.largestZ; z += this.arguments.propDensityFactor) {
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
				point.scale = { x: attenuatedValue, y: attenuatedValue, z: attenuatedValue };
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
		console.log("TODO: I feel that environment tiles should be centralised, otherwise anything could create them. Consider moving them.");
		const environmentTile = new EnvironmentTile(this.zoneOutlinePath, this.main, this.arguments.environmentTile.colour);
		return environmentTile;
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

	// Creates a debug outline
	debugCreateOutlines() {
		createOutline.bind(this)(this.curvePath, 0x000000);
		if (this.arguments.environmentTile.show) createOutline.bind(this)(this.zoneOutlinePath, 0xFF5555);

		function createOutline(path: THREE.CurvePath<THREE.Vector> | THREE.CatmullRomCurve3, color: number) {
			const points = path.getPoints(100);
			const lineGeometry = new THREE.BufferGeometry().setFromPoints(points as Vector3[]);

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

			this.main.scene.add(line);
		}
	}
}

export interface PropZoneArguments {
	propNames: string[],
	zonePathPoints: PathPoint[],
	propDensityFactor: number,
	propScale: number;
	dynamicScaling?: PropZoneScaling,
	positionRandom: number,
	scaleRandom: { all?: number, x?: number, y?: number, z?: number },
	rotateRandom: number,
	environmentTile: {
		show: boolean,
		distance?: number,
		colour?: number
	}
}

export interface PropZoneScaling {
	scalePoints: PathPoint[],
	attentuationDistance: number,
	attenuatedScale: number
}