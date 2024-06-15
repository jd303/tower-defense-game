import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class OrbitController {
	/**
	 * Properties
	 * */
	controls: OrbitControls;

	/**
	 * Constructor
	 * */
	constructor(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, canvas: HTMLCanvasElement) {
		this.controls = new OrbitControls(camera, canvas);
		this.controls.enableDamping = false;
		this.controls.enablePan = true;
		this.controls.enableRotate = true;
		this.controls.enableZoom = true;

		return this;
	}

	/**
	 * Enables availability of orbit controls
	 */
	enable() {
		this.controls.enabled = true;
	}

	/**
	 * Disables availability of orbit controls
	 */
	disable() {
		this.controls.enabled = false;
	}
}
