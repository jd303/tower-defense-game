export interface LevelDefinition {
	terrain: TerrainTypes;
	paths: any[];
	waves: any[];
}

export enum TerrainTypes {
	grass = 'grass',
	sand = 'sand',
}
