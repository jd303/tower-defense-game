import * as THREE from 'three';
import { WindowService } from './WindowService';
import { TickService } from './TickService';
import { SizesInterface } from './WindowService';
import { LoaderService } from './LoaderService';
import { LightingService } from './LightingService';
import { CameraService } from '../core/CameraService';
import { AudioService } from './AudioService';
import { RaycasterService } from './RaycasterService';
import { Service } from './Service';
import { SpriteService } from '../game/SpriteService';
import { InstancedMeshService } from '../game/InstancedMeshService';

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
	 * Stores the current Screen
	 */
	screen: Screen;

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
		this.registerService('Loader', new LoaderService());
		this.registerService('Lighting', new LightingService(this));
		this.registerService('Camera', new CameraService(this));
		this.registerService('Audio', new AudioService(this));
		this.registerService('Raycaster', new RaycasterService(this));
		this.registerService('Sprite', new SpriteService(this));
		this.registerService('InstancedMesh', new InstancedMeshService(this));
		this.registerService('Tick', new TickService(this));

		// Watch the screen
		this.windowSizer = new WindowService(this);
		this.windowSizer.resize();
		this.windowSizer.watchResize();

		// Next up messages
		console.log("%c OK, next up:", 'color: red');
		console.log("%c Pathfind for the hero, so that they avoid mountains", 'color: red');
		console.log("%c Improve BombShot geometry, and add an animation, to see if that works.", 'color: red');
		console.log("%c Interaction Service; migrate UIService behaviours (but not button creation methods) to InteractionService.", 'color: red');
		console.log("%c position notifier, for when placing towers (and possible placement definitions in levels)", 'color: red');
		console.log("%c Projectile results: explosions, magic reactins, arrows left behind?", 'color: red');
		console.log("%c Instanced meshes, when they die, could be properly cleaned up.  Swap them with an item at the end of the array and reduce the array count.", 'color: red');
		console.log("%c Projectile.ts > createPath() - this could be shifted to PathService.", 'color: red');
		console.log("%c CharacterAsset > animationAttack() && animationHurtMe() still needed", 'color: red');
		console.log("%c InstancedMeshService > updateInstancedMeshes() is a performance consideration", 'color: red');
		console.log("%c Let's identify when a spriteasset has animations and not, so we can not set attributes and animate.  Change shader and setInstancedMeshInitialSettings.  Also disable uTime update in InstancedMeshService > SpriteSheetInstancedMesh()", 'color: red');
		console.log("%c Clean up Asset.ts.  YOu can probably move MovePathManager out to something more reasonable.", 'color: red');
		console.log("%c I need to stop animating creeps that have died.  Is that possible?  Is that going to give us much performance improvements?", 'color: red');
		console.log("%c In environment tile, we need to send uTime not using a setInterval", 'color: red');
		console.log("%c Projectile Splash effect doesn't seem to work?", 'color: red');
		console.log("%c Feedback when a Projectile misses.", 'color: red');
		console.log("%c I've preloaded the game with user upgrades.  Remove for a more realistic starting difficulty.", 'color: red');

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
	registerService(serviceName: string, instance: Service) {
		this.services.push({ name: serviceName, instance: instance });
	}
}
