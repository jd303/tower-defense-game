import { Vector3 } from 'three';
import { PropZoneArguments } from '../environment/propManager/PropZone';
import { TowerPlacementZoneDefinition } from '../environment/towers/TowerPlacementZone';

export interface LevelDefinition {
	terrain: TerrainTypes;
	paths: any[];
	towerPlacementZones: TowerPlacementZoneDefinition[];
	props?: LevelPropDefinition[];
	propZones?: PropZoneArguments[];
	propColourisation?: Record<string, { r?: number, g?: number, b?: number, l?: number }>; // Retained for legacy with 
}

export enum TerrainTypes {
	grass = 'grass',
	sand = 'sand',
}

export interface LevelPropDefinition {
	assetName: string,
	position: Vector3,
	scale?: Vector3,
	rotate?: Vector3,
}