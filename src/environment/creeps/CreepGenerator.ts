import { Main } from '../../core/Main';
import { Lupine } from './Lupine';
import { Troll } from './Troll';
import { TrollDink } from './TrollDink';
import { Wisp } from './Wisp';

export class CreepGenerator {
	/**
	 * Construtor
	 * */
	static createCreep(creepDefinition: any, main: Main) {
		switch (creepDefinition.type) {
			// Fantasy
			case 'Troll':
				return new Troll(main);
			case 'TrollDink':
				return new TrollDink(main);
			case 'Wisp':
				return new Wisp(main);
			case 'Lupine':
				return new Lupine(main);
			default:
				return new TrollDink(main);
		}
	}
}
