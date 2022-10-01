import * as THREE from 'three';
import { Vector3 } from 'three';
import { Main } from './core/Main';

export class InteractionManager {
	/**
	 * Event Listeners
	 * */
	lastIntersectionPoint: Vector3 | null; // Dumb, only stores the last intersection point - improve later
	mousePosition: THREE.Vector2 = new THREE.Vector2();
	raycasterMouse: THREE.Raycaster;
	clickWatcher: any;
	raycasterSubjects: any[] = [];

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
		console.log("Fix 'any' on Click Manager and mouseMoveWatcher");
	}

	/**
	 * Watches for clicks in the scene
	 * */
	addClickWatcher() {
		this.raycasterMouse = new THREE.Raycaster();

		window.addEventListener('mousemove', (event) => {
			this.mousePosition.x = (event.clientX / this.main.sizes.width) * 2 - 1;
			this.mousePosition.y = -((event.clientY / this.main.sizes.height) * 2 - 1);
		});

		this.main.tick.registerCallback(this.mouseRaycastWatcher.bind(this));
	}

	/**
	 * Determines what objects to watch clicks on
	 * */
	addClickWatcherSubject(subject: any) {
		this.raycasterSubjects.push(subject);
	}

	/**
	 * Checks for raycasting intersections
	 * */
	mouseRaycastWatcher() {
		// Check Mouse Hovering (Mouse pos needs to be from -1 to 1 (-1 left and bottom, +1 top and right)
		this.raycasterMouse.setFromCamera(this.mousePosition, this.main.cameraMain); // Use the camera and mouse
		const intersectsMouse = this.raycasterMouse.intersectObjects(this.raycasterSubjects);

		// Create a witness / mouseover / mouseout events
		if (intersectsMouse.length) {
			this.lastIntersectionPoint = intersectsMouse[0].point;
		} else {
			this.lastIntersectionPoint = null;
		}
	}
}
