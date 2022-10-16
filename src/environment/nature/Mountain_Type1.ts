import { Main } from '../../core/Main';
import { Prop } from '../Prop';

export class Mountain_Type1 extends Prop {
	/**
	 * Prop Properties
	 * */
	assetPath: string = 'assets/models/nature/Mountain1.glb';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);
		this.loadModel();
	}
}
