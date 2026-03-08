import { Vector3 } from 'three';
import { PropZoneArguments } from '../environment/propManager/PropZone';
import { TowerPlacementZoneDefinition } from '../environment/towers/TowerPlacementZone';
import { CreepPathDefinition } from '../environment/creeps/CreepPath';
import { EnvironmentColours } from '../core/LightingService';
import { EconomyData } from '../game/EconomyService';

export interface LevelDefinition {
	levelId: string;
	levelName: string;
	difficulty: number;
	rewards: EconomyData;
	terrain: TerrainTypes;
	environmentColour: { colour: keyof typeof EnvironmentColours, intensity: number },
	paths: CreepPathDefinition[];
	creepOptions: LevelCreepOption[];
	towerPlacementZones: TowerPlacementZoneDefinition[];
	props?: LevelPropDefinition[];
	propZones?: PropZoneArguments[];
	propColourisation?: Record<string, { r?: number, g?: number, b?: number, l?: number }>; // Retained for legacy with 
}

interface LevelCreepOption {
	chance: number,
	name: string
}

export enum TerrainTypes {
	"grass" = 'grass',
	"sand" = 'sand',
}

export interface LevelPropDefinition {
	assetName: string,
	position: Vector3,
	scale?: Vector3,
	rotation?: Vector3,
}

export interface LevelResults {
	creepsInLevel: number;
	creepsSeen: number;
	creepsKilled: number;
	creepsEscaped: number;
}