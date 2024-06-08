import * as THREE from 'three';
import { WindowService } from './WindowService';
import { DebugService } from './DebugService';
import { TickService } from './TickService';
import { SizesInterface } from './WindowService';
import { LoaderController } from './LoaderService';
import { LightingService } from './LightingService';
import { CameraService } from '../core/CameraService';
import { AudioService } from './AudioService';
import { RaycasterService } from './RaycasterService';

export class Main {
	/**
	 * Core Properties
	 * */
	sizes: SizesInterface;
	windowSizer: WindowService;
	canvas: HTMLCanvasElement;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;

	/**
	 * Services
	 * */
	services: any[] = [];

	/**
	 * Debug mode
	 * */
	debugMode: boolean;

	/**
	 * Constructor
	 * */
	constructor(canvas: HTMLCanvasElement, sizes: SizesInterface, debugMode: boolean = false) {
		this.debugMode = debugMode;
		this.canvas = canvas;
		this.sizes = sizes;
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
		this.renderer.outputColorSpace = THREE.SRGBColorSpace; // || LinearSRGBColorSpace

		// Register core services
		this.registerService('Loader', new LoaderController());
		this.registerService('Lighting', new LightingService(this));
		this.registerService('Camera', new CameraService(this));
		this.registerService('Audio', new AudioService(this));
		this.registerService('Raycaster', new RaycasterService(this));
		this.registerService('Tick', new TickService(this));
		this.registerService('Debug', new DebugService(this, debugMode, this.s('Tick')));

		// Watch the screen
		this.windowSizer = new WindowService(this);
		this.windowSizer.resize();
		this.windowSizer.watchResize();

		// Next up messages
		console.log("%c OK, next up:", 'color: red');
		console.log("%c Create a PathService, and get the hero on the path", 'color: red');
		console.log("%c Improve BombShot geometry, and add an animation, to see if that works.", 'color: red');
		console.log("%c Interaction Service; migrate UIService behaviours (but not button creation methods) to InteractionService.", 'color: red');
		console.log("%c position notifier, for when placing towers (and possible placement definitions in levels)", 'color: red');
		console.log("%c Projectile results: explosions, magic reactins, arrows left behind?", 'color: red');
		console.log("%c Refactor and research BufferGeometries, now that we can't use PlaneBufferGeom", 'color: red');

		return this;
	}

	/**
	 * Returns a Service
	 * @param {string} serviceName The name of a service
	 * */
	s(serviceName: string) {
		return this.services.find((s) => s.name == serviceName).instance;
	}

	/**
	 * Registers a manager that will be accessible to the main scope
	 * */
	registerService(serviceName: string, instance: any) {
		this.services.push({ name: serviceName, instance: instance });
	}
}
