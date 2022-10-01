import * as THREE from "three";
import { Vector3 } from "three";
import {
  LevelPathDefinition,
  PathDefinition,
  PathSegment,
  PathTypes,
} from "./data/PathInterfaces";

export class LevelPath {
  /**
   * Setup Properties
   * */
  variantDistance: number = 5;

  /**
   * Wave Properties
   * */
  id: string;
  corePath: LevelPathDefinition = {
    id: "core",
    segments: [],
    pathLength: 0,
    path: new THREE.CurvePath(),
  };
  variantPaths: LevelPathDefinition[] = [];

  /**
   * Constructor
   * */
  constructor(pathDefinition: PathDefinition) {
    this.id = pathDefinition.id;
    this.setCorePath(pathDefinition.segments);

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
  createPathFromSegments(
    pathSegments: PathSegment[],
    adjustX: number = 0,
    adjustZ: number = 0
  ) {
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
          curvePart = this.addBezierPath(segment.points);
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
  addBezierPath(points: Vector3[]): THREE.CubicBezierCurve3 {
    return new THREE.CubicBezierCurve3(
      points[0],
      points[1],
      points[2],
      points[3]
    );
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
      path: this.createPathFromSegments(
        this.corePath.segments,
        this.getRandomAdjustX(),
        this.getRandomAdjustZ()
      ),
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
        points: pathSegment.points.map(
          (point) => new Vector3(point.x, point.y, point.z)
        ),
      };
      newPathSegments.push(newPathSegment);
    });

    return newPathSegments;
  }

  getRandomAdjustX() {
    return Math.random() * this.variantDistance - this.variantDistance / 2;
  }

  getRandomAdjustZ() {
    return Math.random() * this.variantDistance - this.variantDistance / 2;
  }
}
