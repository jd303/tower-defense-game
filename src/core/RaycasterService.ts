import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from '../core/Main';
import { Creep } from '../environment/creeps/Creep';
import { Prop } from '../environment/Prop';
import { Terrain } from '../environment/Terrain';
import { LevelPath } from '../levels/LevelPath';
import { Tower } from '../environment/towers/Tower';

export class RaycasterService {
	/**
	 * Event Listeners
	 * */
	lastIntersectionPoint: Vector3 | null; // Dumb, only stores the last intersection point - improve later
	mousePosition: THREE.Vector2 = new THREE.Vector2();
	raycaster?: THREE.Raycaster | null;
	clickWatcher: any;
	raycasterSubjects: (Prop | Creep | Tower | Terrain | LevelPath)[] = [];
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
	addRaycasterSubjects(subjects: (Prop | Creep | Tower | Terrain | LevelPath)[]) {
		console.log(subjects);
		this.raycasterSubjects.push(...subjects);
	}

	/**
	 * Adds clickable raycaster subjects
	 * */
	removeRaycasterSubjects(subjects: (Prop | Creep | Tower | Terrain | LevelPath)[]) {
		const subjectsSet = new Set(subjects);
		this.raycasterSubjects = this.raycasterSubjects.filter((subject) => {
			return !subjectsSet.has(subject);
		});
	}

	/**
	 * Adds a click handler.
	 * The click handler will resolve if the returned target is appropriate and act.
	 * */
	addClickHandler(onClick: Function, onComplete: Function) {
		const clickHandler: ClickHandler = { onClick: onClick, onComplete: onComplete };

		if (!this.clickHandlers.find((ch) => ch.onClick == onClick)) {
			this.clickHandlers.push(clickHandler);
		}
	}

	/**
	 * Removes a click handler
	 * */
	removeClickHandler(removedOnClick: Function) {
		console.log('REMOVE ONCLICK');
		console.log(this);
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
		this.raycaster?.setFromCamera(position, this.main.s('Camera').mainCamera.threeCamera);
		const intersects = this.raycaster?.intersectObjects(this.raycasterSubjects.map((subject) => subject['groupMain']));

		// If we have intersected
		if (intersects?.length) {
			console.log(intersects[0]);
			console.log('Intersects');

			this.clickHandlers.forEach((handler) => {
				handler.onClick(intersects, this.main);

				if (handler.onComplete) handler.onComplete();
			});
		}
	}
}

interface ClickHandler {
	onClick: Function;
	onComplete: Function;
}
