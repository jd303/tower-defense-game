import { Main } from '../core/Main';
import { Service } from '../core/Service';

export class MapService extends Service {
	/**
	 * System Properties
	 * */
	main: Main;
	mapNodes: MapNode[];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
		this.mapNodes = initialMapNodes; // To be replaced with saved data
	}
}

/**
 * A map node
 */
export type MapNode = {
	mapNodeId: number;
	levelID: string;
	ancestorConnections: string[];
	descendantConnections: string[];
	x: number;
	z: number;
}

/**
 * Map Nodes for the game
 */
const initialMapNodes: MapNode[] = [
	{
		mapNodeId: 0,
		levelID: 'Sandbox',
		ancestorConnections: [],
		descendantConnections: [],
		x: -0.05,
		z: 0
	},
	{
		mapNodeId: 0,
		levelID: '0_0',
		ancestorConnections: [],
		descendantConnections: ['1_1', '1_2'],
		x: 0,
		z: 0.5
	},
	{
		mapNodeId: 0,
		levelID: '1_1',
		ancestorConnections: ['0_0'],
		descendantConnections: [],
		x: 0.05,
		z: 0.25
	},
	{
		mapNodeId: 0,
		levelID: '1_2',
		ancestorConnections: ['0_0'],
		descendantConnections: [],
		x: 0.05,
		z: 0.75
	},
	{
		mapNodeId: 0,
		levelID: '2_1',
		ancestorConnections: ['1_1'],
		descendantConnections: [],
		x: 0.1,
		z: 0.05
	}
]