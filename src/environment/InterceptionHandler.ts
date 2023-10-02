import { Vector3 } from 'three';
import { ModelAsset } from './ModelAsset';
import { Creep } from './creeps/Creep';
import { Hero } from './heroes/Hero';
import { PathService } from '../game/PathService';

export class InterceptionHandler {
	/**
	 * Core Properties
	 * */
	parent: Hero;
	positions = {
		"occupied_1":
		[
			new Vector3(3, 0, 0)
		],
		"occupied_2":
		[
			new Vector3(2.5, 0, -1.5),
			new Vector3(3, 0, 1.5)
		]
	};

	/**
	 * Position Properties
	 * */
	interceptionSlots: InterceptionSlot[] = [];

	/**
	 * Constructor
	 * */
	constructor(parent: Hero) {
		this.parent = parent;
	}

	get slotCounts(): InterceptionSlotCountInterface {
		const available = this.interceptionSlots.filter(slot => slot.occupant === undefined).length;
		const total = this.interceptionSlots.length;
		return {
			total: total,
			available: available,
			occupied: total - available
		}
	}

	setInterceptionSlotCount(count: number) {
		switch (true) {
			case this.interceptionSlots.length == count:
				return;
			case this.interceptionSlots.length < count:
				this.interceptionSlots = [
					...this.interceptionSlots,
					...Array.apply(null,
							Array(count - this.interceptionSlots.length))
							.map(() => { return { occupant: undefined, relativeX: 0, relativeZ: 0 } }
						)
				];
				break;
			case this.interceptionSlots.length > count:
				for (let x = this.interceptionSlots.length-1; x > count - 1; x--) {
					console.log("%c TODO: REMOVE SLOT IN setInterceptionSlotCount:", 'color: red');
					console.log("%c TODO: REMOVE SLOT IN setInterceptionSlotCount:", 'color: red');
					console.log("%c TODO: REMOVE SLOT IN setInterceptionSlotCount:", 'color: red');
					console.log("%c Sorry, just put three items in here to better see it", 'color: green');
				}
				break;
		}
	}

	get firstAttackableCreep() {
		return this.interceptionSlots.find(slot => slot.occupant !== undefined)?.occupant;
	}

	addInterceptees(newInterceptees: ModelAsset[]) {
		newInterceptees.forEach(interceptee => {
			const availableSlot = this.interceptionSlots.find(slot => slot.occupant === undefined);

			if (availableSlot) {
				availableSlot.occupant = interceptee;
				(interceptee as Creep).setIntercepted(this.parent);
			}
		});

		this.setIntercepteePositions();
	}

	removeInterceptee(interceptee: ModelAsset) {
		const slot = this.interceptionSlots.find(slot => slot.occupant == interceptee);
		if (slot) {
			slot.occupant = undefined;
			this.interceptionSlots.sort(slot => slot.occupant !== undefined && -1 || 1);
		}

		this.setIntercepteePositions();
	}

	setIntercepteePositions() {
		const slotCounts = this.slotCounts;
		const indexKey: keyof typeof this.positions = (`occupied_${slotCounts.occupied}` as keyof typeof this.positions);
		const positions = this.positions[indexKey];

		this.interceptionSlots.forEach((slot, index) => {
			if (slot.occupant !== undefined) {
				const sPath: PathService = this.parent.main.s('Path');
				const parentPosition = this.parent.groupMain.position.clone();
				const position = parentPosition.add(positions[index]);
				const path = sPath.createMovePath('intercept', sPath.createStraightPathSegments(slot.occupant.groupMain.position, position));
				slot.occupant.movePathManager.addPath(path);
				slot.occupant.movePathManager.setActivePath(path.id, false);
				console.log("%c TODO: MOVE ASSETS PROPERLY PLEASE", 'color: red');
				console.log("%c TODO: MOVE ASSETS PROPERLY PLEASE", 'color: red');
				console.log("%c TODO: MOVE ASSETS PROPERLY PLEASE", 'color: red');
				console.log("%c Sorry, just put three items in here to better see it", 'color: green');
			}
		});
	}

	disengageAll() {
		this.interceptionSlots.forEach((slot) => {
			if (slot.occupant !== undefined) {
				(slot.occupant as Creep).setDisintercepted(this.parent);
				slot.occupant = undefined;
			}
		});
	}
}

export interface InterceptionSlot {
	occupant?: ModelAsset;
	relativeX: number;
	relativeZ: number;
}

export interface InterceptionSlotCountInterface {
	total: number;
	available: number;
	occupied: number;
}