import { Main } from '../core/Main';
import { Service } from '../core/Service';
import { MapNode } from './MapPoints';

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
 * Map Nodes for the game
 */
const initialMapNodes: MapNode[] = [
	{
		mapNodeID: 0,
		levelID: 'Sandbox',
		ancestorConnections: [],
		x: -0.05,
		z: 0
	},
	{
		mapNodeID: 0,
		levelID: '0_0',
		ancestorConnections: [],
		x: 0,
		z: 0.5
	},
	{
		mapNodeID: 0,
		levelID: '1_1',
		ancestorConnections: ['0_0'],
		x: 0.05,
		z: 0.75
	},
	{
		mapNodeID: 0,
		levelID: '1_2',
		ancestorConnections: ['0_0'],
		x: 0.05,
		z: 0.25
	},
	{
		mapNodeID: 0,
		levelID: '2_1',
		ancestorConnections: ['1_1'],
		x: 0.15,
		z: 0.95
	},
	{
		mapNodeID: 0,
		levelID: '2_2',
		ancestorConnections: ['1_1'],
		x: 0.15,
		z: 0.65
	},
	{
		mapNodeID: 0,
		levelID: '2_3',
		ancestorConnections: ['1_2'],
		x: 0.15,
		z: 0.4
	},
	{
		mapNodeID: 0,
		levelID: '2_4',
		ancestorConnections: ['1_2'],
		x: 0.15,
		z: 0.1
	}
]