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
	findTargetsInRange(config: TargetFinderInterface) {
		let targets = config.potentialTargets.filter((target: ModelAsset) => {
			if (config.omissionCallback) {
				if (config.omissionCallback(target)) return false;
			}

			const targetPosition = target.groupMain.position;
			const distance = config.fromPoint.distanceTo(targetPosition);

			// If something is in range
			if (distance < config.range) {
				return true;
			} else return false;
		});

		// Cull to maximumResults
		if (config.maximumResults !== undefined && targets.length > config.maximumResults) {
			targets = targets.splice(0, targets.length - config.maximumResults);
		}

		return targets;
	}
}

interface TargetFinderInterface {
	potentialTargets: (ModelAsset)[],
	fromPoint: Vector3,
	range: number,
	omissionCallback?: Function
	maximumResults?: number
}