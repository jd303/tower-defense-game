import * as THREE from 'three';
import { Main } from '../core/Main';
import { Creep } from '../environment/creeps/Creep';
import { Terrain } from '../environment/Terrain';
import { LevelPath } from '../levels/LevelPath';
import { Tower } from '../environment/towers/Tower';
import { Hero } from '../environment/heroes/Hero';
import { ModelAsset } from '../environment/ModelAsset';
import { Interactable } from '../game/InteractionService';
import { Service } from './Service';

export class RaycasterService extends Service {
	/**
	 * Event Listeners
	 * */
	raycaster?: THREE.Raycaster | null;
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
	 * Watches for a click on a known subject, and returns the type and position
	 * */
	enableRaycaster() {
		this.raycaster = new THREE.Raycaster();
		this.clickWatcher = window.addEventListener('click', this.handleClickEvent.bind(this));
	}

	/**
	 * Removes a click event
	 * */
	disableRaycaster() {
		window.removeEventListener('click', this.handleClickEvent.bind(this));
		delete this.raycaster;
		this.clickWatcher = null;
	}

	/**
	 * When a click occurs, handle it
	 * Will accept targets, and cancel if it first hits a cancelTarget
	 * */
	fireRayToTargets(event: MouseEvent | TouchEvent, targets: Interactable[], cancelTargets: Interactable[] = []): RaycasterIntersection | null {
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

		// Find the first intersection, using our own top-down ordering system
		let intersected: RaycasterIntersection | null = null;
		for (let i = 0; i < targets.length; i++) {
			let subject = targets[i];

			let intersectsTarget = this.raycaster?.intersectObjects([subject.object['groupMain']]);
			if (intersectsTarget?.length) {

				// Check that we don't also intersect with a cancelTarget
				let intersectsCancel = this.raycaster?.intersectObjects(cancelTargets.map(target => target.object['groupMain']));

				if (!intersectsCancel?.length) {
					intersected = {
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
	 * When a click occurs, handle it
	 * */
	handleClickEvent(event: MouseEvent | TouchEvent) {
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

		// Find the first intersection, using our own top-down ordering system
		let intersected: RaycasterIntersection | null = null;
		for (let i = 0; i < this.raycasterSubjects.length; i++) {
			let subject = this.raycasterSubjects[i];

			let intersects = this.raycaster?.intersectObjects([subject.object['groupMain']]);
			if (intersects?.length) {
				intersected = {
					point: intersects[0],
					object: subject.object
				}
				break;
			}
		}
	}
}

interface RaycasterSubject {
	order: RaycasterOrders;
	object: Hero | Creep | Tower | Terrain | LevelPath | ModelAsset;
}

export interface RaycasterIntersection {
	point: any,
	object: Hero | Creep | Tower | Terrain | LevelPath | ModelAsset;
}

export enum RaycasterOrders {
	"terrain" = 0,
	"towers" = 1,
	"heroes" = 2,
}