import * as THREE from 'three';
import { Vector, Vector3 } from 'three';

export interface PathDefinition {
	id: string;
	pathPoints: PathPoint[];
	pathGeometry: PathGeometryTypes;
}

export interface MovePathDefinition {
	id: string;
	active: boolean;
	pathPoints: PathPoint[];
	pathLength: number;
	path: THREE.CurvePath<Vector>;
	pathTravelPercentagePerSec: number;
	pathProgress: number;
	switchToOnComplete?: string;
}

// A point that can have an optional control point
export interface PathPoint {
	incomingControlPoint?: Vector3; // An optional control point when this is joined to from another point
	point: Vector3;
	outgoingControlPoint?: Vector3; // An optional control point when this joins to another point
}

export enum PathGeometryTypes {
	none = 'none',
	dirt = 'dirt',
	rock = 'rock',
}