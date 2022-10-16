import * as THREE from 'three';
import { WindowSizer } from './WindowSizer';
import { DebugFeatures } from './DebugFeatures';
import { LevelManager } from '../LevelManager';
import { Tick, TickTimeProperties } from './Tick';

import { CameraInterface, SizesInterface } from '../data/Interfaces';
import { GLTFLoadController } from '../Loaders';
import { InteractionManager } from '../InteractionManager';
import { Level } from '../levels/Level';

export class Main {
	/**
	 * Properties
	 * */
	sizes: SizesInterface;
	windowSizer: WindowSizer;
	canvas: HTMLCanvasElement;
	scene: THREE.Scene;
	renderer: THREE.Renderer;
	glTFLoader: GLTFLoadController;
	cameraMain: THREE.PerspectiveCamera | THREE.OrthographicCamera;
	tick: Tick;
	interactionManager: InteractionManager;

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
		this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
		this.glTFLoader = new GLTFLoadController();
		this.levelManager = new LevelManager(this);
		this.debugFeatures = new DebugFeatures(debugMode, this.tick);
		this.interactionManager = new InteractionManager(this);

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
		this.renderer.render(this.scene, this.cameraMain);
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

	/**
	 * Setup a main camera
	 * */
	createPerspectiveMainCamera(settings: CameraInterface) {
		this.cameraMain = new THREE.PerspectiveCamera(settings.fov, settings.sizes.width / settings.sizes.height, settings.near, settings.far);
	}

	/**
	 * Setup a main camera
	 * */
	createOrthographicMainCamera(settings: CameraInterface) {
		this.cameraMain = new THREE.OrthographicCamera(
			(0.04 * settings.sizes.width) / -2,
			(0.04 * settings.sizes.width) / 2,
			(0.04 * settings.sizes.height) / 2,
			(0.04 * settings.sizes.height) / -2,
			settings.near,
			settings.far
		);
	}
}
