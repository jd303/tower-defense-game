import * as THREE from 'three';
import * as lil from 'lil-gui';
import { Light } from './LightingService';
import { TickCallback, TickService } from './TickService';
import { Main } from './Main';
import { RaycasterOrders, RaycasterService } from './RaycasterService';
import { Terrain } from '../environment/Terrain';
import { DebugSpline } from './DebugSplineClass';

export class DebugService {
	/**
	 * Properties
	 * */
	main: Main;
	lilGUI: lil.GUI;

	/**
	 * Debug Callback properties
	 */
	callbacks = {
		makeSpline: this.makeSpline.bind(this),
		addSplinePointToStart: this.addSplinePointToStart.bind(this),
		addSplinePointToEnd: this.addSplinePointToEnd.bind(this),
		exportSpline: this.exportSpline.bind(this),
		destroySpline: this.destroySpline.bind(this),
	}

	/**
	 * References
	 */
	debugDivRef: HTMLElement | null;
	debugSpline?: DebugSpline;

	/**
	 * Constructor
	 * */
	constructor(main: Main, debugMode: boolean, tickService: TickService) {
		this.main = main;

		if (debugMode) {
			this.lilGUI = new lil.GUI();

			this.lilGUI.add(tickService, 'pauseTick').name('Pause Tick');
			this.lilGUI.add(tickService, 'unpauseTick').name('Unpause Tick');
			this.lilGUI.add(tickService, 'speedTick').name('Speed Tick');

			this.watchDrawCalls();
			this.addSplineLilGUI();
		}

		return this;
	}

	/**
	 * Adds a debug number control to lilGUI
	 * */
	addDebugNumber(args: { folder: any; objectParent: any; property: string; min: number; max: number; step: number; name: string | null }) {
		let parent;
		if (args.folder) {
			parent = args.folder;
		} else {
			parent = this.lilGUI;
		}

		parent
			.add(args.objectParent, args.property)
			.min(args.min)
			.max(args.max)
			.step(args.step)
			.name(args.name || args.property);
	}

	/**
	 * Allows us to debug a property.  If 'property' is a function, calls the function
	 */
	addGUIDebugProperty(objectParent: any, property: string, options: any = null) {
		const debugItem = this.lilGUI.add(objectParent, property).name(options?.name || property);

		if (options !== null) {
			console.log(debugItem);
			if (options.min) debugItem.min(options.min);
			if (options.max) debugItem.min(options.max);
			if (options.step) debugItem.min(options.step);
		}
	}

	/**
	 * Adds typical debugs for lights
	 * */
	debugLight(light: Light, label: string) {
		const folder = this.lilGUI.addFolder(label);
		folder.open(false);
		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight,
			property: 'intensity',
			min: 0,
			max: 5,
			step: 0.001,
			name: `${label} Intensity`,
		});

		// Stop here if an Ambient light
		if (light.threeLight instanceof THREE.AmbientLight) return;

		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight.position,
			property: 'x',
			min: -50,
			max: 50,
			step: 0.001,
			name: `${label} x`,
		});
		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight.position,
			property: 'y',
			min: -50,
			max: 50,
			step: 0.001,
			name: `${label} y`,
		});
		this.addDebugNumber({
			folder: folder,
			objectParent: light.threeLight.position,
			property: 'z',
			min: -50,
			max: 50,
			step: 0.001,
			name: `${label} z`,
		});
	}

	/**
	 * Add a Sphere to the scene at 0,0,0
	 * */
	addDebugSphere() {
		const geometry = new THREE.SphereGeometry(1, 10, 10);
		const material = new THREE.MeshStandardMaterial({ color: '#ffffff' });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 1.25, 0);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		this.main.scene.add(mesh);
	}

	/**
	 * Add a Plane to the scene at 0,0,0
	 * */
	addDebugPlane() {
		const geometry = new THREE.PlaneGeometry(100, 100);
		const material = new THREE.MeshStandardMaterial({ color: '#aaaaaa' });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, 0);
		mesh.rotation.x = Math.PI * -0.5;
		mesh.receiveShadow = true;
		material.needsUpdate = true;

		this.main.scene.add(mesh);
	}

	/**
	 * Add a world cube of a particular colour
	 * */
	addWorldCube(size: number = 100, colour: number = 0xffffff) {
		const cubeGeometry = new THREE.BoxGeometry(size, size, size, 1, 1, 1);
		const cubeMaterial = new THREE.MeshBasicMaterial({ color: colour });
		cubeMaterial.side = THREE.BackSide;
		const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
		this.main.scene.add(cubeMesh);
	}

	/**
	 * Writes draw calls to the page
	 * */
	listenToTerrainLocationClicks(terrain: Terrain) {
		const sRaycaster: RaycasterService = this.main.s('Raycaster');
		sRaycaster.enableRaycaster();
		sRaycaster.addRaycasterSubjects([{ order: RaycasterOrders.terrain, object: terrain }]); // Listen to clicks on terrain
		//sRaycaster.addRaycasterSubjects(this.levelPaths.map(path => { return { order: RaycasterOrders.props, object: path } })); // Used to listen to clicks on props, but props don't exist anymore - if you need it again, you'll need to setup raycasting for all MeshInstances in PropManager
	}

	/**
	 * Writes draw calls to the page
	 * */
	watchDrawCalls() {
		const div = document.createElement('div');
		div.classList.add('debug_drawcalls');
		document.body.appendChild(div);
		this.debugDivRef = div;
		this.main.s('Tick').registerCallback(new TickCallback("DEBUG_DrawCalls", this.measureDebugDrawCalls.bind(this)));
	}

	/**
	 * Writes draw calls to the page
	 * */
	measureDebugDrawCalls() {
		if (this.debugDivRef) this.debugDivRef.textContent = "DC: " + this.main.renderer.info.render.calls;
	}

	/**
	 * Adds 
	 */
	addSplineLilGUI() {
		const folder = this.lilGUI.addFolder('Spline Tools');
		folder.open(false);
		folder.add(this.callbacks, 'makeSpline');
		folder.add(this.callbacks, 'addSplinePointToStart');
		folder.add(this.callbacks, 'addSplinePointToEnd');
		folder.add(this.callbacks, 'exportSpline');
		folder.add(this.callbacks, 'destroySpline');
	}

	/**
	 * Adds a Spline to the scene
	 */
	makeSpline() {
		if (this.debugSpline) this.debugSpline.destroy();
		this.debugSpline = new DebugSpline(this.main);
		console.log("Make Spline");
	}

	/**
	 * Add points to the spline
	 */
	addSplinePointToStart() {
		this.debugSpline?.addPointToStart();
	}
	addSplinePointToEnd() {
		this.debugSpline?.addPointToEnd();
	}

	/**
	 * Exports a Spline to the console
	 */
	exportSpline() {
		console.log("Export spline");
		this.debugSpline?.exportPoints();
	}

	/**
	 * Destroys the spline
	 */
	destroySpline() {
		this.debugSpline?.destroy();
	}
}
