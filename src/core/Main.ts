import * as THREE from 'three';
import { WindowSizer } from './WindowSizer';
import { DebugFeatures } from './DebugFeatures';
import { LevelManager } from '../LevelManager';
import { Tick, TickTimeProperties } from './Tick';

import { CameraInterface, SizesInterface } from '../data/Interfaces';
import { GLTFLoadController } from '../Loaders';
import { InteractionManager } from '../InteractionManager';
import { Level } from '../levels/Level';
import { LightingManager } from '../LightingManager';
import { CameraManager } from '../CameraManager';

export class Main {
	/**
	 * Properties
	 * */
	sizes: SizesInterface;
	windowSizer: WindowSizer;
	canvas: HTMLCanvasElement;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	glTFLoader: GLTFLoadController;
	cameraManager: CameraManager;
	tick: Tick;
	interactionManager: InteractionManager;
	lightingManager: LightingManager;

	levelManager: LevelManager;
	level: Level;

	debugFeatures: DebugFeatures;

	/**
	 * Constructor
	 * */
	constructor(canvas: HTMLCanvasElement, sizes: SizesInterface, debugMode: boolean) {
		this.canvas = canvas;
		this.sizes = sizes;
		this.tick = new Tick();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
		this.glTFLoader = new GLTFLoadController();
		this.levelManager = new LevelManager(this);
		this.debugFeatures = new DebugFeatures(debugMode, this.tick);
		this.interactionManager = new InteractionManager(this);
		this.lightingManager = new LightingManager(this);
		this.cameraManager = new CameraManager(this);

		// Create a default camera during initial developemnt
		this.cameraManager.createPerspectiveCamera(true);
		this.cameraManager.createOrthographicCamera(true);
		const cameraDebug = {
			changeMain: this.cameraManager.switchCameras.bind(this.cameraManager),
		};
		this.debugFeatures.addGUIDebugProperty(cameraDebug, 'changeMain');

		this.setupMainTick();

		return this;
	}

	/**
	 * Registers callback for tick
	 * */
	setupMainTick() {
		this.tick.registerCallback(this.gameplayTickCallback.bind(this));
		this.tick.registerCallback(this.rendererTickCallback.bind(this), false);
	}

	/**
	 * Renders the scene
	 * */
	rendererTickCallback() {
		this.renderer.render(this.scene, this.cameraManager.mainCamera.threeCamera);
	}

	/**
	 * Animates creeps and towers and other game items
	 * */
	gameplayTickCallback(timeProperties: TickTimeProperties) {
		this.level.creeps.forEach((creep) => creep.animate(timeProperties));
		this.level.towers.forEach((tower) => tower.animate(timeProperties));
	}

	/**
	 * Sets the window size
	 * */
	setupWindowSize() {
		this.windowSizer = new WindowSizer(this);
		this.windowSizer.resize();
		this.windowSizer.watchResize();
	}
}
