import { Main } from '../core/Main';
import { CameraService } from '../core/CameraService';
import { perspectiveCameraDefaults } from '../config/cameraSettingsDefault';
import { orthographicCameraLevel } from '../config/cameraSettingsLevel';

export class LevelCameraManager {
	/**
	 * Core Properties
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Sets up waves
	 */
	setup() {
		const sCamera: CameraService = this.main.s('Camera');
		sCamera.createPerspectiveCamera(false, perspectiveCameraDefaults);
		sCamera.createOrthographicCamera(true, orthographicCameraLevel);

		// Setup OrbitControls
		this.main.s('Camera').setupOrbitControls();

		if (this.main.debugMode) this.setupDebugs();
	}

	setupDebugs() {
		const cameraDebug = {
			changeMainCam: () => {
				const sCamera: CameraService = this.main.s('Camera');
				sCamera.switchCameras();
				sCamera.resetOrbitControls();
			}
		};
		this.main.s('Debug').addGUIDebugProperty(cameraDebug, 'changeMainCam');
	}
}
