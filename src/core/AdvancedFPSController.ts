import * as THREE from 'three';
import { Camera } from './CameraService';

/**
 * CLASS: Advanced First Person Controls
 * Contains Keyboard controls
 * Contains mouse look
 * */
export class AdvancedFirstPersonControls {
	camera: Camera;
	cameraDirection = new THREE.Vector3();

	toggleLeft: boolean = false;
	toggleRight: boolean = false;
	toggleUp: boolean = false;
	toggleDown: boolean = false;
	toggleRotYPos: boolean = false;
	toggleRotYNeg: boolean = false;

	keyboardMoveSpeed: number = 0.2;
	keyboardRotateSpeed: number = 0.008;

	lastMouseAnimationFramePosition: THREE.Vector2 = new THREE.Vector2(0, 0);
	lastMouseEventPosition: THREE.Vector2 = new THREE.Vector2(0, 0);

	/**
	 * Constructor
	 * */
	constructor(camera: Camera) {
		this.camera = camera;

		this.setupKeyboardControls();
		this.setupMouseControls();
	}

	/**
	 * Updates the camera
	 * */
	updateCamera() {
		// Get the camera direction
		this.camera.threeCamera.getWorldDirection(this.cameraDirection);

		// Setup strafe directions
		const strafeDirection = this.cameraDirection.clone();
		strafeDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

		// Position
		if (this.toggleUp) this.camera.threeCamera.position.addScaledVector(this.cameraDirection, this.keyboardMoveSpeed);
		if (this.toggleDown) this.camera.threeCamera.position.addScaledVector(this.cameraDirection, -this.keyboardMoveSpeed);
		if (this.toggleLeft) this.camera.threeCamera.position.addScaledVector(strafeDirection, this.keyboardMoveSpeed);
		if (this.toggleRight) this.camera.threeCamera.position.addScaledVector(strafeDirection, -this.keyboardMoveSpeed);

		// Rotation
		if (this.toggleRotYNeg) this.camera.threeCamera.rotation.y += this.keyboardRotateSpeed;
		if (this.toggleRotYPos) this.camera.threeCamera.rotation.y -= this.keyboardRotateSpeed;

		this.camera.threeCamera.getWorldDirection(this.cameraDirection);

		// And now mouse
		// THIS CURRENTLY DON'T WOIK
		console.log("Start here, and fix it");
		const differenceX = this.lastMouseEventPosition.x - this.lastMouseAnimationFramePosition.x;
		const differenceY = this.lastMouseEventPosition.y - this.lastMouseAnimationFramePosition.y;

		if (differenceX < 20 && differenceY < 20) {
			this.camera.threeCameraTiltGroup.rotation.y += differenceX * 0.001;
			this.camera.threeCameraTiltGroup.rotation.x += differenceY * 0.001;
		}
		console.log(differenceX, differenceY);
		this.lastMouseAnimationFramePosition.x = this.lastMouseEventPosition.x;
		this.lastMouseAnimationFramePosition.y = this.lastMouseEventPosition.y;
	}

	/**
	 * Listens to keyboard controls
	 * */
	setupKeyboardControls() {
		window.addEventListener('keydown', (keyboardEvent: KeyboardEvent) => {
			this.updateKeyToggle(keyboardEvent, true);
		});

		window.addEventListener('keyup', (keyboardEvent: KeyboardEvent) => {
			this.updateKeyToggle(keyboardEvent, false);
		});
	}

	/**
	 * Listens to keyboard controls
	 * */
	setupMouseControls() {
		window.addEventListener('mousemove', (mouseEvent: MouseEvent) => {
			this.lastMouseEventPosition.x = mouseEvent.pageX;
			this.lastMouseEventPosition.y = mouseEvent.pageY;
		});
	}

	/**
	 * Updates the toggle state for controls
	 * */
	updateKeyToggle(keyboardEvent: KeyboardEvent, toggleState: boolean) {
		switch (keyboardEvent.code) {
			// Position
			case 'ArrowLeft':
			case 'KeyA':
				this.toggleLeft = toggleState;
				break;
			case 'ArrowRight':
			case 'KeyD':
				this.toggleRight = toggleState;
				break;
			case 'ArrowUp':
			case 'KeyW':
				this.toggleUp = toggleState;
				break;
			case 'ArrowDown':
			case 'KeyS':
				this.toggleDown = toggleState;
				break;

			// Rotation
			case 'KeyE':
				this.toggleRotYPos = toggleState;
				break;
			case 'KeyQ':
				this.toggleRotYNeg = toggleState;
				break;
		}
	}

	/**
	 * Updates on Tick
	 * */
	update() {
		this.updateCamera();
	}

	dispose() {
		console.log('DISPOSE ME');
	}
}
