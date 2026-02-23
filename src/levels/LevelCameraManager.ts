import { Main } from '../core/Main';
import { CameraService } from '../core/CameraService';
import { perspectiveCameraDefaults } from '../config/cameraSettingsDefault';
import { orthographicCameraLevel } from '../config/cameraSettingsLevel';
import { Level } from './Level';

export class LevelCameraManager {
	/**
	 * Core Properties
	 * */
	main: Main;
	level: Level;

	/**
	 * Constructor
	 * */
	constructor(main: Main, level: Level) {
		this.main = main;
		this.level = level;
	}

	/**
	 * Sets up waves
	 */
	setup() {
		const sCamera: CameraService = this.main.s('Camera');
		sCamera.createPerspectiveCamera(false, perspectiveCameraDefaults);
		sCamera.createOrthographicCamera(true, {
			panClampBounds: {
				minX: -Level.levelWidth / 2, maxX: Level.levelWidth / 2, minZ: -Level.levelHeight / 2, maxZ: Level.levelHeight / 2
			},
			...orthographicCameraLevel
		});

		// Setup OrbitControls
		sCamera.setupOrbitControls();

		if (this.main.debugMode) this.setupDebugs();
	}

	/**
	 * Creates Level Camera Debugs
	 */
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
