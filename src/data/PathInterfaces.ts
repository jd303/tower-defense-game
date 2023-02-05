import * as THREE from 'three';
import { Vector, Vector3 } from 'three';

export interface PathDefinition {
	id: number;
	segments: PathSegment[];
	pathGeometry: PathGeometryTypes;
}

export interface PathSegment {
	type: PathTypes;
	points: Vector3[];
	controlPoints?: Vector3[];
}

export interface LevelPathDefinition {
	id: string;
	segments: any[];
	pathLength: number;
	path: THREE.CurvePath<Vector>;
}

export enum PathGeometryTypes {
	none = 'none',
	dirt = 'dirt',
	rock = 'rock',
}

export enum PathTypes {
	bezier = 'bezier',
	straight = 'straight',
}
