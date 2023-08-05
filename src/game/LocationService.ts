import { Vector3 } from "three";
import { Main } from "../core/Main"
import { ModelAsset } from "../environment/ModelAsset";

export class LocationService {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Finds all targets in range
	 * @param {Function} omissionCallback A function to call which, if true, omits this from the selection criteria
	 * */
	findTargetsInRange(potentialTargets: (ModelAsset)[], fromPoint: Vector3, range: number, omissionCallback?: Function) {
		const targets = potentialTargets.filter((target: ModelAsset) => {
			if (omissionCallback) {
				if (omissionCallback(target)) return false;
			}

			const targetPosition = target.groupMain.position;
			const distance = fromPoint.distanceTo(targetPosition);

			// If something is in range
			if (distance < range) {
				return true;
			} else return false;
		});

		return targets;
	}
}