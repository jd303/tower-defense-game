import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from '../core/Main';
import { Creep } from '../environment/creeps/Creep';
import { Prop } from '../environment/Prop';
import { Terrain } from '../environment/Terrain';
import { LevelPath } from '../levels/LevelPath';
import { Tower } from '../environment/towers/Tower';
import { Hero } from '../environment/heroes/Hero';
import { CameraService } from './CameraService';

export class RaycasterService {
	/**
	 * Event Listeners
	 * */
	raycaster?: THREE.Raycaster | null;
	clickWatcher: any;
	raycasterSubjects: RaycasterSubject[] = [];
	clickHandlers: ClickHandler[] = [];

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
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
	 * Adds a click handler.
	 * The click handler will resolve if the returned target is appropriate and act.
	 * */
	addClickHandler(clickTarget: Hero | Prop | Creep | Tower | Terrain | LevelPath, onClick: Function, onComplete: Function) {
		const clickHandler: ClickHandler = { target: clickTarget, onClick: onClick, onComplete: onComplete };

		if (!this.clickHandlers.find((ch) => ch.onClick == onClick)) {
			this.clickHandlers.push(clickHandler);
		}
	}

	/**
	 * Removes a click handler
	 * */
	removeClickHandler(removedOnClick: Function) {
		this.clickHandlers = this.clickHandlers.filter((ch) => ch.onClick != removedOnClick);
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

	getEventIntersections(event: MouseEvent | TouchEvent) {
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
		for (let i=0; i <this.raycasterSubjects.length; i++) {
			let subject = this.raycasterSubjects[i];

			let intersects = this.raycaster?.intersectObjects( [subject.object['groupMain']] );
			if (intersects?.length) {
				intersected = {
					point: intersects[0],
					object: subject.object
				}
				break;
			}
		}

		// If we have intersected
		if (intersected !== null) {

			this.clickHandlers.forEach((handler) => {
				if (handler.target == intersected?.object) {
					handler.onClick(intersected, this.main);
				}

				if (handler.onComplete) handler.onComplete();
			});
		}
	}
}

interface ClickHandler {
	target: Hero | Prop | Creep | Tower | Terrain | LevelPath;
	onClick: Function;
	onComplete: Function;
}

interface RaycasterSubject {
	order: RaycasterOrders;
	object: Hero | Prop | Creep | Tower | Terrain | LevelPath;
}

export interface RaycasterIntersection {
	point: any,
	object: Hero | Prop | Creep | Tower | Terrain | LevelPath;
}

export enum RaycasterOrders {
	"terrain" = 0,
	"props" = 1,
	"towers" = 2,
	"heroes" = 3,
}