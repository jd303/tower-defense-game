import { Main } from '../core/Main';
import { CreepMVPMonster } from './Creep_MVPMonster';
import { CreepMVPSquare } from './Creep_MVPSquare';

export class CreepGenerator {
	/**
	 * Construtor
	 * */
	static createCreep(creepDefinition: any, main: Main) {
		switch (creepDefinition.type) {
			case 'CreepMVPSquare':
				return new CreepMVPSquare(main);
			case 'CreepMVPMonster':
				return new CreepMVPMonster(main);
			default:
				return new CreepMVPSquare(main);
		}
	}
}
