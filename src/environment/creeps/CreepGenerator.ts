import { Main } from '../../core/Main';
import { Troll } from './Troll';
import { TrollDink } from './TrollDink';
import { Wisp } from './Wisp';

export class CreepGenerator {
	/**
	 * Construtor
	 * */
	static createCreep(creepDefinition: any, main: Main) {
		console.log('CREATE CREEP', creepDefinition.type);
		switch (creepDefinition.type) {
			// Fantasy
			case 'Troll':
				return new Troll(main);
			case 'TrollDink':
				return new TrollDink(main);
			case 'Wisp':
				return new Wisp(main);
			default:
				return new TrollDink(main);
		}
	}
}
