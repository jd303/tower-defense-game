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
	cameraMain: THREE.PerspectiveCamera | THREE.OrthographicCamera;
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

		this.setupMainTick();

		// DEBUG THINGS
		const mat = new THREE.MeshStandardMaterial();
		mat.roughness = 0.7;
		mat.color.set('#888888');
		const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere.position.y = 5;
		sphere.position.z = 2;
		sphere.castShadow = true;
		this.scene.add(sphere);

		const sphere2 = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere2.scale.set(2, 2, 2);
		sphere2.position.y = 2;
		sphere2.position.x = 4;
		sphere2.castShadow = true;
		sphere2.receiveShadow = true;
		this.scene.add(sphere2);

		const sphere3 = new THREE.Mesh(new THREE.SphereBufferGeometry(1), mat);
		sphere3.scale.set(4, 4, 4);
		sphere3.position.y = 5;
		sphere3.position.x = 15;
		sphere3.castShadow = true;
		sphere3.receiveShadow = true;
		this.scene.add(sphere3);

		const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(50, 50), mat);
		plane.rotation.x = Math.PI * -0.5;
		plane.position.y = 0.1;
		plane.receiveShadow = true;
		this.scene.add(plane);
		// END DEBUG THINGS

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
