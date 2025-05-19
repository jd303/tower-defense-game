import * as THREE from 'three';
import * as lil from 'lil-gui';
import { Light } from './LightingService';
import { TickCallback, TickService } from './TickService';
import { Main } from './Main';
import { SplineBuilder } from './SplineBuilder';
import { Service } from './Service';
import { InteractionService2, InteractionEvent } from '../game/InteractionService2';

export class DebugService extends Service {
	/**
	 * Properties
	 * */
	main: Main;
	lilGUI: lil.GUI;

	/**
	 * Debug Callback properties
	 */
	splineObject = {
		bezierEnabledOnLoad: true,
		makeSpline: this.makeSpline.bind(this),
		makeLineFromWindowJSON: this.makeLineFromWindowJSON.bind(this),
		addSplinePointToStart: this.addSplinePointToStart.bind(this),
		addSplinePointToEnd: this.addSplinePointToEnd.bind(this),
		exportPoints: this.exportPoints.bind(this),
		destroySpline: this.destroySpline.bind(this),
	}
	zoneCreatorObject = {
		startZoneCreator: this.startZoneCreator.bind(this),
		endZoneCreator: this.endZoneCreator.bind(this),
		zoneCreation: []
	}

	/**
	 * References
	 */
	debugDivRef: HTMLElement | null;
	splineBuilder?: SplineBuilder;

	/**
	 * Constructor
	 * */
	constructor(main: Main, debugMode: boolean, tickService: TickService) {
		super();

		this.main = main;

		if (debugMode) {
			this.lilGUI = new lil.GUI();

			this.lilGUI.add(tickService, 'pauseTick').name('Pause Tick');
			this.lilGUI.add(tickService, 'unpauseTick').name('Unpause Tick');
			this.lilGUI.add(tickService, 'speedTick').name('Speed Tick');

			this.watchDrawCalls();
			this.addSplineLilGUI();
			this.addZoneCreatoreLilGUI();
			this.addTerrainPositionWatcher();
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
	 * Adds spline tools
	 */
	addSplineLilGUI() {
		const folder = this.lilGUI.addFolder('Spline Tools');
		folder.open(false);
		folder.add(this.splineObject, 'bezierEnabledOnLoad', [false, true]);
		folder.add(this.splineObject, 'makeSpline');
		folder.add(this.splineObject, 'makeLineFromWindowJSON');
		folder.add(this.splineObject, 'addSplinePointToStart');
		folder.add(this.splineObject, 'addSplinePointToEnd');
		folder.add(this.splineObject, 'exportPoints');
		folder.add(this.splineObject, 'destroySpline');
	}

	/**
	 * Adds a Spline to the scene
	 */
	makeSpline() {
		if (this.splineBuilder) this.splineBuilder.destroy();
		this.splineBuilder = new SplineBuilder(this.main, false, this.splineObject.bezierEnabledOnLoad);
	}

	/**
	 * Adds a Spline to the scene, from JSON
	 */
	makeLineFromWindowJSON() {
		if (this.splineBuilder) this.splineBuilder.destroy();
		this.splineBuilder = new SplineBuilder(this.main, true, this.splineObject.bezierEnabledOnLoad);
	}

	/**
	 * Add points to the spline
	 */
	addSplinePointToStart() {
		this.splineBuilder?.addPointToStart();
	}
	addSplinePointToEnd() {
		this.splineBuilder?.addPointToEnd();
	}

	/**
	 * Exports a Spline to the console
	 */
	exportPoints() {
		console.log("Export spline");
		this.splineBuilder?.exportPathPoints();
		this.splineBuilder?.exportVectorPoints();
	}

	/**
	 * Destroys the spline
	 */
	destroySpline() {
		this.splineBuilder?.destroy();
	}

	/**
	 * Listens for clicks on the terrain
	 */
	addTerrainPositionWatcher() {
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		sInteraction.registerInteractableListener('terrain', 'getPosition', this.debugTerrainPoint);
	}

	/**
	 * Prints the click point when the user clicks on the terrain
	 */
	debugTerrainPoint(event: InteractionEvent) {
		console.group('Debug: Click Terrain');
		console.log(`${event.raycasterInteraction.point.point.x.toFixed(5)},0,${event.raycasterInteraction.point.point.z.toFixed(5)}`);
		console.log(event.raycasterInteraction.object);
		console.groupEnd();
		return { handled: true, cancelListeners: false };
	}

	/**
	 * Adds spline tools
	 */
	addZoneCreatoreLilGUI() {
		const folder = this.lilGUI.addFolder('Zone Creator');
		folder.open(false);
		folder.add(this.zoneCreatorObject, 'startZoneCreator');
		folder.add(this.zoneCreatorObject, 'endZoneCreator');
	}

	/**
	 * Enables zone creator mode
	 */
	startZoneCreator() {
		this.zoneCreatorObject.zoneCreation = [];

		setTimeout(() => {
			const sInteraction: InteractionService2 = this.main.s('Interaction2');
			sInteraction.registerInteractableListener('terrain', 'zoneCreator', this.registerZoneCreatorPoint.bind(this));
		}, 500);
	}

	endZoneCreator() {
		const sInteraction: InteractionService2 = this.main.s('Interaction2');
		sInteraction.deregisterInteractableListener('terrain', 'zoneCreator');

		this.zoneCreatorObject.zoneCreation.push(this.zoneCreatorObject.zoneCreation[0]);
		console.log("Zone:", this.zoneCreatorObject.zoneCreation.map((point: THREE.Vector3) => `{ point: new Vector3(${point.x}, ${point.y}, ${point.z}) },`).join('\n'));
		console.log("END ZONE",);
	}

	registerZoneCreatorPoint(event: InteractionEvent) {
		const newPoint = new THREE.Vector3(event.raycasterInteraction.point.point.x.toFixed(3), 0, event.raycasterInteraction.point.point.z.toFixed(3));
		(this.zoneCreatorObject.zoneCreation as THREE.Vector3[]).push(newPoint);

		return { handled: true, cancelListeners: true }
	}
}
