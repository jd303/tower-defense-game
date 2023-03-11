import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { Main } from './Main';
import { TickTimeProperties } from './TickService';
import { AdvancedFirstPersonControls } from './AdvancedFPSController';
import { Camera } from './CameraService';
import { PerspectiveCamera } from 'three';

export class FPSController {
	/**
	 * Properties
	 * */
	main: Main;
	controls: AdvancedFirstPersonControls | FirstPersonControls | FlyControls;

	/**
	 * Constructor
	 * */
	constructor(main: Main, controlType: FPSControlsType = FPSControlsType.flyControls, camera: Camera) {
		this.main = main;

		switch (controlType) {
			case FPSControlsType.flyControls:
				this.setupFlyControls(camera.threeCamera);
				break;
			case FPSControlsType.fpsSimpleControls:
				this.setupFPSSimpleControls(camera.threeCamera);
				break;
			case FPSControlsType.fpsAdvancedControls:
				this.setupFPSAdvancedControls(camera);
				break;
		}
	}

	/**
	 * Uses the fly controls from THREE.js
	 * */
	setupFlyControls(camera: THREE.Camera) {
		console.log(camera);
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
	setupFPSSimpleControls(camera: THREE.Camera) {
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
	setupFPSAdvancedControls(camera: Camera) {
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
