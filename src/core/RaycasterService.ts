import * as THREE from 'three';
import { Main } from '../core/Main';
import { Creep } from '../environment/creeps/Creep';
import { Terrain } from '../environment/Terrain';
import { Tower } from '../environment/towers/Tower';
import { Hero } from '../environment/heroes/Hero';
import { ModelAsset } from '../environment/ModelAsset';
import { Interactable2, InteractableObject } from '../game/InteractionService2';
import { Service } from './Service';
import { CreepPath } from '../environment/creeps/CreepPath';

export class RaycasterService extends Service {
	/**
	 * Event Listeners
	 * */
	raycaster?: THREE.Raycaster = new THREE.Raycaster();
	clickWatcher: any;
	raycasterSubjects: RaycasterSubject[] = [];

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
	}

	/**
	 * Adds clickable raycaster subjects
	 * */
	addRaycasterSubjects(subjects: RaycasterSubject[]) {
		this.raycasterSubjects.push(...subjects);
		this.raycasterSubjects = this.raycasterSubjects.sort((a, b) => a.order < b.order && 1 || -1);
	}

	/**
	 * Adds clickable raycaster subjects
	 * */
	removeRaycasterSubjects(subjects: RaycasterSubject[]) {
		const subjectsSet = new Set(subjects);
		this.raycasterSubjects = this.raycasterSubjects.filter((subject) => {
			return !subjectsSet.has(subject);
		});
	}

	/**
	 * When a click occurs, handle it
	 * Will accept targets, and cancel if it first hits a cancelTarget
	 * */
	fireRayToTargets(event: MouseEvent | TouchEvent, targets: Interactable2[], singleTarget = false, cancelTargets: Interactable2[] = []): RaycasterIntersection[] | RaycasterIntersection | null {
		const position: THREE.Vector2 = new THREE.Vector2(0, 0);
		if (event instanceof MouseEvent) {
			position.x = (event.clientX / this.main.sizes.width) * 2 - 1;
			position.y = -((event.clientY / this.main.sizes.height) * 2 - 1);
		} else {
			position.x = (event.touches[0].clientX / this.main.sizes.width) * 2 - 1;
			position.y = -((event.touches[0].clientY / this.main.sizes.height) * 2 - 1);
		}

		// Set the raycaster
		this.raycaster?.setFromCamera(position, this.main.s('Camera').mainCamera.threeCamera);

		if (singleTarget) {
			return this.getSingleRayTarget(targets, cancelTargets);
		} else {
			return this.getAllRayTargets(targets);
		}
	}

	/**
	 * Finds the first ray target, or null
	 */
	getSingleRayTarget(targets: Interactable2[], cancelTargets: Interactable2[]) {
		let intersected: RaycasterIntersection | null = null;
		for (let i = 0; i < targets.length; i++) {
			let subject = targets[i];

			let intersectsTarget = this.raycaster?.intersectObjects([subject.object['groupMain']]);
			if (intersectsTarget?.length) {

				// Check that we don't also intersect with a cancelTarget
				let intersectsCancel = this.raycaster?.intersectObjects(cancelTargets.map(target => target.object['groupMain']));

				if (!intersectsCancel?.length) {
					intersected = {
						name: targets[i].name || 'no name just yet', // TODO: This is for the migration to new Interaction, fix up please.
						point: intersectsTarget[0],
						object: subject.object
					}
					break;
				}
			}
		}

		return intersected;
	}

	/**
	 * Finds all ray targets, or []
	 */
	getAllRayTargets(targets: Interactable2[]) {
		let intersected: RaycasterIntersection[] = [];

		for (let i = 0; i < targets.length; i++) {
			let subject = targets[i];

			let intersectsTarget = this.raycaster?.intersectObjects([subject.object['groupMain']]);
			if (intersectsTarget?.length) {
				intersectsTarget.forEach((target) => {
					intersected.push({
						name: targets[i].name || 'no name just yet', // TODO: This is for the migration to new Interaction, fix up please.
						point: target,
						object: subject.object
					});
				});
			}
		}

		console.log("%c TODO: Brute forcing a sort, but it would be great to add a better sorting option.  This solves a problem where terrain is called before props / towers etc", "color: cyan");
		intersected.sort((intersectionA) => intersectionA.object instanceof Terrain && 1 || -1);
		return intersected;
	}
}

interface RaycasterSubject {
	order: RaycasterOrders;
	object: Hero | Creep | Tower | Terrain | CreepPath | ModelAsset;
}

export interface RaycasterIntersection {
	name: string;
	point: any,
	object: InteractableObject;
}

export enum RaycasterOrders {
	"terrain" = 0,
	"towers" = 1,
	"heroes" = 2,
}