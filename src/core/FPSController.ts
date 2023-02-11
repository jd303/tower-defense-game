import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { Main } from './Main';
import { TickTimeProperties } from './TickService';
import { AdvancedFirstPersonControls } from './AdvancedFPSController';

export class FPSController {
	/**
	 * Properties
	 * */
	main: Main;
	controls: AdvancedFirstPersonControls | FirstPersonControls | FlyControls;

	/**
	 * Constructor
	 * */
	constructor(main: Main, controlType: FPSControlsType = FPSControlsType.flyControls, camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
		this.main = main;

		switch (controlType) {
			case FPSControlsType.flyControls:
				this.setupFlyControls(camera);
				break;
			case FPSControlsType.fpsSimpleControls:
				this.setupFPSSimpleControls(camera);
				break;
			case FPSControlsType.fpsAdvancedControls:
				this.setupFPSAdvancedControls(camera);
				break;
		}
	}

	/**
	 * Uses the fly controls from THREE.js
	 * */
	setupFlyControls(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
		var camControls = new FlyControls(camera);
		camControls.movementSpeed = 20;
		camControls.rollSpeed = 0.4;

		this.controls = camControls;

		// Update controls
		this.main.s('Tick').registerCallback((tickTimeProperties: TickTimeProperties) => {
			this.controls.update(tickTimeProperties.deltaTime);
		}, false);

		return this;
	}

	/**
	 * Uses the FirstPersonControls from THREE.js
	 * */
	setupFPSSimpleControls(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
		var camControls = new FirstPersonControls(camera);
		camControls.lookSpeed = 0.1;
		camControls.movementSpeed = 20;
		camControls.lookVertical = true;
		camControls.constrainVertical = true;
		camControls.verticalMin = 1.0;
		camControls.verticalMax = 2.0;
		camControls.mouseDragOn = true;

		this.controls = camControls;

		// Update controls
		this.main.s('Tick').registerCallback((tickTimeProperties: TickTimeProperties) => {
			this.controls.update(tickTimeProperties.deltaTime);
		}, false);

		return this;
	}

	/**
	 * Uses a custom controller scheme for FPS-style keyboard navigation and look
	 * */
	setupFPSAdvancedControls(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
		this.controls = new AdvancedFirstPersonControls(camera);

		this.main.s('Tick').registerCallback(() => {
			this.controls.update(0);
		}, false);
	}
}

export enum FPSControlsType {
	flyControls = 'flyControls',
	fpsSimpleControls = 'fpsSimpleControls',
	fpsAdvancedControls = 'fpsAdvancedControls',
}
