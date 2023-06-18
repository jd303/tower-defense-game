import { Main } from '../../core/Main';
import { Tree } from './Tree';

export class TreeCone1 extends Tree {
	/**
	 * Prop Properties
	 * */
	assetPath: string = 'assets/models/nature/Tree_Cone_1.glb';
	shadowsEnabled = true;

	constructor(main: Main) {
		super(main);
		this.loadModel();
	}
}
