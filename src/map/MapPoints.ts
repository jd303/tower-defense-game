import { Main } from '../core/Main';
import { Service } from '../core/Service';

export class MapService extends Service {
	/**
	 * System Properties
	 * */
	main: Main;
	levels: MapNode[];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
	}

	/**
	 * Store 
	 */
}

export type MapNode = {
	ancestorConnections: MapNode[];
	descendantConnections: MapNode[];
	completed: boolean;
	locked: boolean;
	levelID: string;
}