import * as THREE from "three";
import { Vector, Vector3 } from "three";

export interface PathDefinition {
  id: string;
  segments: PathSegment[];
}

export interface PathSegment {
  type: PathTypes;
  points: Vector3[];
}

export interface LevelPathDefinition {
  id: string;
  segments: any[];
  pathLength: number;
  path: THREE.CurvePath<Vector>;
}

export enum PathTypes {
  bezier = "bezier",
  straight = "straight",
}
