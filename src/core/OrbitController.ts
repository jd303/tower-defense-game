import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { OrbitControls } from './OrbitControls'; // No typings

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
		this.controls.enableDamping = true;
		this.controls.enablePan = true;
		this.controls.enableRotate = true;
		this.controls.enableZoom = true;

		return this;
	}
}
