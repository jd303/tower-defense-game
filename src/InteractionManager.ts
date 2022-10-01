import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from './core/Main';
import { Creep } from './creeps/Creep';
import { Prop } from './environment/Prop';
import { Terrain } from './environment/Terrain';
import { Tower } from './towers/Tower';

export class InteractionManager {
	/**
	 * Event Listeners
	 * */
	lastIntersectionPoint: Vector3 | null; // Dumb, only stores the last intersection point - improve later
	mousePosition: THREE.Vector2 = new THREE.Vector2();
	raycaster: THREE.Raycaster;
	clickWatcher: any;
	raycasterSubjects: (Prop | Creep | Tower | Terrain)[] = [];
	clickHandlers: Set<Function> = new Set();

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
		this.raycaster = new THREE.Raycaster();
		this.addClickWatcher();
		console.log("Fix 'any' on Click Manager and mouseMoveWatcher");
	}

	/**
	 * Adds clickable raycaster subjects
	 * */
	addRaycasterSubjects(subjects: (Prop | Creep | Tower | Terrain)[]) {
		this.raycasterSubjects.push(...subjects);
	}

	/**
	 * Adds clickable raycaster subjects
	 * */
	removeRaycasterSubjects(subjects: (Prop | Creep | Tower | Terrain)[]) {
		const subjectsSet = new Set(subjects);
		this.raycasterSubjects = this.raycasterSubjects.filter((subject) => {
			return !subjectsSet.has(subject);
		});
	}

	/**
	 * Adds a click handler.
	 * The click handler will resolve if the returned target is appropriate and act.
	 * */
	addClickHandler(newClickHandler: Function) {
		if (!this.clickHandlers.has(newClickHandler)) {
			this.clickHandlers.add(newClickHandler);
		}
	}

	/**
	 * Removes a click handler
	 * */
	removeClickHandler(removedClickHandler: Function) {
		this.clickHandlers.delete(removedClickHandler);
	}

	/**
	 * Watches for a click on a known subject, and returns the type and position
	 * */
	addClickWatcher() {
		this.clickWatcher = window.addEventListener('click', this.handleClickEvent.bind(this));
	}

	/**
	 * When a click occurs, handle it
	 * */
	handleClickEvent(event: MouseEvent | TouchEvent) {
		const position = { x: 0, y: 0 };
		if (event instanceof MouseEvent) {
			position.x = (event.clientX / this.main.sizes.width) * 2 - 1;
			position.y = -((event.clientY / this.main.sizes.height) * 2 - 1);
		} else {
			position.x = (event.touches[0].clientX / this.main.sizes.width) * 2 - 1;
			position.y = -((event.touches[0].clientY / this.main.sizes.height) * 2 - 1);
		}

		// Set the raycaster
		this.raycaster.setFromCamera(position, this.main.cameraMain);
		const intersects = this.raycaster.intersectObjects(this.raycasterSubjects.map((subject) => subject.groupMain));

		// If we have intersected
		if (intersects.length) {
			console.log(intersects[0]);
			console.log('Intersects');

			this.clickHandlers.forEach((handler) => handler(intersects, this.main));
		}
	}

	/**
	 * Removes a click event
	 * */
	removeClickWatcher() {
		window.removeEventListener('click', this.handleClickEvent.bind(this));
		this.clickWatcher = null;
	}
}
