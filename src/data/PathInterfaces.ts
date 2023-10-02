import * as THREE from 'three';
import { Vector, Vector3 } from 'three';

export interface PathDefinition {
	id: string;
	segments: PathSegment[];
	pathGeometry: PathGeometryTypes;
}

export interface MovePathDefinition {
	id: string;
	active: boolean;
	segments: any[];
	pathLength: number;
	path: THREE.CurvePath<Vector>;
	pathTravelPercentagePerSec: number;
	pathProgress: number;
	switchToOnComplete?: string;
}

export interface PathSegment {
	type: PathTypes;
	points: Vector3[];
	controlPoints?: Vector3[];
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
