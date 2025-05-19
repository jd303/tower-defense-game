import { Vector3 } from 'three';
import { PropZoneArguments } from '../environment/propManager/PropZone';
import { TowerPlacementZoneDefinition } from '../environment/towers/TowerPlacementZone';

export interface LevelDefinition {
	terrain: TerrainTypes;
	paths: any[];
	towerPlacementZones: TowerPlacementZoneDefinition[];
	waves: any[];
	props?: LevelPropDefinition[];
	propZones?: PropZoneArguments[];
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