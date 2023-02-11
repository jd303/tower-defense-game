import * as THREE from 'three';

/**
 * CLASS: Advanced First Person Controls
 * Contains Keyboard controls
 * Contains mouse look
 * */
export class AdvancedFirstPersonControls {
	camera: THREE.Camera;
	cameraDirection = new THREE.Vector3();

	toggleLeft: boolean = false;
	toggleRight: boolean = false;
	toggleUp: boolean = false;
	toggleDown: boolean = false;
	toggleRotYPos: boolean = false;
	toggleRotYNeg: boolean = false;

	keyboardMoveSpeed: number = 0.2;
	keyboardRotateSpeed: number = 0.008;

	/**
	 * Constructor
	 * */
	constructor(camera: THREE.Camera) {
		this.camera = camera;

		this.setupKeyboardControls();
	}

	/**
	 * Updates the camera
	 * */
	updateCamera() {
		// Get the camera direction
		this.camera.getWorldDirection(this.cameraDirection);

		// Setup strafe directions
		const strafeDirection = this.cameraDirection.clone();
		strafeDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

		// Position
		if (this.toggleUp) this.camera.position.addScaledVector(this.cameraDirection, this.keyboardMoveSpeed);
		if (this.toggleDown) this.camera.position.addScaledVector(this.cameraDirection, -this.keyboardMoveSpeed);
		if (this.toggleLeft) this.camera.position.addScaledVector(strafeDirection, this.keyboardMoveSpeed);
		if (this.toggleRight) this.camera.position.addScaledVector(strafeDirection, -this.keyboardMoveSpeed);

		// Rotation
		if (this.toggleRotYNeg) this.camera.rotation.y += this.keyboardRotateSpeed;
		if (this.toggleRotYPos) this.camera.rotation.y -= this.keyboardRotateSpeed;

		this.camera.getWorldDirection(this.cameraDirection);
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
