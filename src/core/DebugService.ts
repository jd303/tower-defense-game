import * as THREE from 'three';
import * as lil from 'lil-gui';
import { Light } from './LightingService';
import { TickCallback } from './TickService';
import { Main } from './Main';
import { SplineBuilder } from './SplineBuilder';
import { Service } from './Service';
import { InteractionService2, InteractionEvent } from '../game/InteractionService2';
import { LevelEditor } from '../levels/LevelEditor';
import { Level } from '../levels/Level';

export class DebugService extends Service {
	/**
	 * Properties
	 * */
	main: Main;
	debugMode: boolean;
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
	levelEditor: LevelEditor;

	/**
	 * References
	 */
	debugDivRef: HTMLElement | null;
	splineBuilder?: SplineBuilder;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
		this.debugMode = main.debugMode;

		this.createLilGUI();

		return this;
	}

	/**
	 * Creates the default LilGUI
	 */
	createLilGUI() {
		if (this.lilGUI) {
			this.lilGUI.destroy();
		}

		this.lilGUI = new lil.GUI();
		this.lilGUI.domElement.addEventListener('click', (event: MouseEvent) => event.stopPropagation());
	}

	/**
	 * Creates a level editor
	 */
	createLevelEditor(level: Level) {
		const levelCreator = new LevelEditor(this.main, level);
		const levelCreatorFolder = this.lilGUI.addFolder('Level Editor');
		levelCreatorFolder.open(false);
		this.levelEditor = levelCreator;
		this.levelEditor.getLevelEditorFeatures().forEach((feature: Record<string, string>) => {
			levelCreatorFolder.add(this.levelEditor, feature.functionName).name(feature.name);
		});

		const splineFolder = levelCreatorFolder.addFolder('Spline Tools');
		splineFolder.open(false);
		splineFolder.add(this.splineObject, 'bezierEnabledOnLoad', [false, true]);
		splineFolder.add(this.splineObject, 'makeSpline');
		splineFolder.add(this.splineObject, 'makeLineFromWindowJSON');
		splineFolder.add(this.splineObject, 'addSplinePointToStart');
		splineFolder.add(this.splineObject, 'addSplinePointToEnd');
		splineFolder.add(this.splineObject, 'exportPoints');
		splineFolder.add(this.splineObject, 'destroySpline');
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
	addDebugSphere(initialProperties: { position?: THREE.Vector3, scale?: THREE.Vector3 }) {
		const geometry = new THREE.SphereGeometry(1, 10, 10);
		const material = new THREE.MeshStandardMaterial({ color: '#ffffff' });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 1.25, 0);
		mesh.scale.set(1, 1, 1);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		if (initialProperties.position) mesh.position.set(initialProperties.position.x, initialProperties.position.y, initialProperties.position.z);
		if (initialProperties.scale) mesh.scale.set(initialProperties.scale.x, initialProperties.scale.y, initialProperties.scale.z);

		this.main.scene.add(mesh);
	}

	/**
	 * Add a Plane to the scene at 0,0,0
	 * */
	addDebugPlane(initialProperties: { position?: THREE.Vector3, scale?: THREE.Vector3 }) {
		const geometry = new THREE.PlaneGeometry(100, 100);
		const material = new THREE.MeshStandardMaterial({ color: '#aaaaaa' });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, 0);
		mesh.rotation.x = Math.PI * -0.5;
		mesh.receiveShadow = true;
		material.needsUpdate = true;

		if (initialProperties.position) mesh.position.set(initialProperties.position.x, initialProperties.position.y, initialProperties.position.z);
		if (initialProperties.scale) mesh.scale.set(initialProperties.scale.x, initialProperties.scale.y, initialProperties.scale.z);

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
	 * Adds a Spline to the scene
	 */
	makeSpline() {
		if (this.splineBuilder) this.splineBuilder.destroy();
		this.splineBuilder = new SplineBuilder(this.main, { makeFromWindowJSON: false, bezierEnabled: this.splineObject.bezierEnabledOnLoad, onUpdate: (points) => console.log("POINTS", points) });
	}

	/**
	 * Adds a Spline to the scene, from JSON
	 */
	makeLineFromWindowJSON() {
		if (this.splineBuilder) this.splineBuilder.destroy();
		this.splineBuilder = new SplineBuilder(this.main, { makeFromWindowJSON: true, bezierEnabled: this.splineObject.bezierEnabledOnLoad });
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
		console.group("%c >>>>>>>>>>>>>>>>>>>>> Spline Export", 'color: pink');
		this.splineBuilder?.exportObject();
		this.splineBuilder?.exportPathPoints();
		this.splineBuilder?.exportVectorPoints();
		console.groupEnd();
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
		console.groupCollapsed('Debug: Click Terrain');
		console.log(`${event.raycasterInteraction.point.point.x.toFixed(5)},0,${event.raycasterInteraction.point.point.z.toFixed(5)}`);
		console.log(event.raycasterInteraction.object);
		console.groupEnd();
		return { handled: true, stopPropagation: false };
	}
}