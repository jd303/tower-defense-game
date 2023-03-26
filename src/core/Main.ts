import * as THREE from 'three';
import { WindowService } from './WindowService';
import { DebugService } from './DebugService';
import { TickService } from './TickService';
import { SizesInterface } from './WindowService';
import { GLTFLoadController } from './LoaderService';
import { LightingService } from './LightingService';
import { CameraService } from '../core/CameraService';
import { AudioService } from './AudioService';

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
	 * Constructor
	 * */
	constructor(canvas: HTMLCanvasElement, sizes: SizesInterface, debugMode: boolean) {
		this.canvas = canvas;
		this.sizes = sizes;
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

		// Register core services
		this.registerService('GLTF', new GLTFLoadController());
		this.registerService('Lighting', new LightingService(this));
		this.registerService('Camera', new CameraService(this));
		this.registerService('Audio', new AudioService(this));
		this.registerService('Tick', new TickService(this));
		this.registerService('Debug', new DebugService(this, debugMode, this.s('Tick')));

		// Watch the screen
		this.windowSizer = new WindowService(this);
		this.windowSizer.resize();
		this.windowSizer.watchResize();

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
