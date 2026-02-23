import * as THREE from 'three';
import { Main } from './Main';
import { PathPoint } from '../dataTypes/PathInterfaces';
import { PathService } from '../game/PathService';

export class SplineBuilder {
	/**
	 * Constants
	 */
	yVal: number = 4;
	bezierEnabled: boolean;

	/**
	 * Properties
	 * */
	main: Main;
	sPath: PathService;
	raycaster: THREE.Raycaster = new THREE.Raycaster();
	points: PathPoint[] = [
		{ incomingControlPoint: new THREE.Vector3(-15, this.yVal, -15), point: new THREE.Vector3(0, this.yVal, 0), outgoingControlPoint: new THREE.Vector3(14, this.yVal, 15) },
		{ incomingControlPoint: new THREE.Vector3(35, this.yVal, -15), point: new THREE.Vector3(50, this.yVal, 0), outgoingControlPoint: new THREE.Vector3(65, this.yVal, 15) },
	];
	pointHandles: any[] = [];
	pointIncomingControlHandles: any[] = [];
	pointOutgoingControlHandles: any[] = [];
	path: THREE.CurvePath<THREE.Vector> | THREE.CatmullRomCurve3;

	/**
	 * THREE Objects
	 */
	lineMaterial?: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 10 });
	lineGeometry?: THREE.BufferGeometry
	line?: THREE.Line;
	controlColourPoint = 0x0000ff;
	handleMaterial = new THREE.MeshBasicMaterial({ color: this.controlColourPoint });
	handleGeometry = new THREE.BoxGeometry(1, 0.25, 1);
	controlColourIncoming = 0xff0000;
	controlColourOutgoing = 0x00ff00;
	controlHandleIncomingMaterial = new THREE.MeshBasicMaterial({ color: this.controlColourIncoming });
	controlHandleOutgoingMaterial = new THREE.MeshBasicMaterial({ color: this.controlColourOutgoing });
	controlHandleGeometry = new THREE.BoxGeometry(1, 0.25, 1);
	group: THREE.Group;

	/**
	 * Events
	 */
	mouseMoveReference: any;
	mouseDownReference: any;
	mouseUpReference: any;
	mouseDownStartPosition: THREE.Vector2;
	mouseDownTimer: ReturnType<typeof setTimeout>;
	mouseDownLongPressTime: number = 750;
	mousePointNormal = new THREE.Vector2(0, 0);
	mousePoint = new THREE.Vector2(0, 0);
	mouseDownPoint = new THREE.Vector2(0, 0);
	intersectedControlHandleClickPosition = new THREE.Vector3(0, 0, 0);
	intersectedControlHandle: any;
	onUpdate?: (points: PathPoint[]) => void;

	/**
	 * Constructor
	 * */
	constructor(main: Main, options: { bezierEnabled: boolean, makeFromWindowJSON?: boolean, makeFromPoints?: PathPoint[], onUpdate?: (points: PathPoint[]) => void } = { makeFromWindowJSON: false, bezierEnabled: true }) {
		this.main = main;
		this.sPath = this.main.s('Path');
		this.bezierEnabled = options.bezierEnabled;
		this.onUpdate = options.onUpdate;

		if (options.makeFromWindowJSON) {
			if ((window as any).jsonPoints) this.points = (window as any).jsonPoints;
			else console.error('!! Unable to load from window.jsonPoints - no points configured');
		} else if (options.makeFromPoints) {
			this.points = options.makeFromPoints;
		}

		this.path = this.createPath();
		this.group = new THREE.Group();

		this.makeLine();
		this.makeControls();
		this.listenforMouseMovement();
	}

	/**
	 * Makes and draws a path
	 */
	makeLine() {
		this.destroyLine();

		const points: any = this.path.getPoints(50);
		this.lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
		this.main.scene.add(this.line);
	}

	/**
	 * Makes control handles for points
	 */
	makeControls() {
		this.destroyHandles();

		this.points.forEach((point: PathPoint, index: number) => {
			const handleMesh = new THREE.Mesh(this.handleGeometry, this.handleMaterial);
			handleMesh.position.set(point.point.x, 3, point.point.z);
			(handleMesh as any).pointIndex = index;
			(handleMesh as any).pointType = 'point';
			this.pointHandles.push(handleMesh);

			this.main.scene.add(handleMesh);

			if (!this.bezierEnabled) return;

			const controlIncomingHandleMesh = new THREE.Mesh(this.controlHandleGeometry, this.controlHandleIncomingMaterial);
			controlIncomingHandleMesh.position.set(point.incomingControlPoint!.x, point.incomingControlPoint!.y, point.incomingControlPoint!.z);
			(controlIncomingHandleMesh as any).pointIndex = index;
			(controlIncomingHandleMesh as any).pointType = 'incomingControlPoint';
			this.pointIncomingControlHandles.push(controlIncomingHandleMesh);

			const controlOutgoingHandleMesh = new THREE.Mesh(this.controlHandleGeometry, this.controlHandleOutgoingMaterial);
			controlOutgoingHandleMesh.position.set(point.outgoingControlPoint!.x, point.outgoingControlPoint!.y, point.outgoingControlPoint!.z);
			(controlOutgoingHandleMesh as any).pointIndex = index;
			(controlOutgoingHandleMesh as any).pointType = 'outgoingControlPoint';
			this.pointOutgoingControlHandles.push(controlOutgoingHandleMesh);

			this.main.scene.add(controlIncomingHandleMesh, controlOutgoingHandleMesh);
		});
	}

	/**
	 * Add Point
	 */
	addPointToEnd() {
		const lastPoint = this.points[this.points.length - 1];
		const newPoint = new THREE.Vector3(lastPoint.point.x + 10, lastPoint.point.y, lastPoint.point.z);
		const newPointInc = new THREE.Vector3(lastPoint.point.x + 10, lastPoint.point.y, lastPoint.point.z - 5);
		const newPointOut = new THREE.Vector3(lastPoint.point.x + 10, lastPoint.point.y, lastPoint.point.z + 5);
		this.points.push({
			incomingControlPoint: newPointInc,
			point: newPoint,
			outgoingControlPoint: newPointOut,
		});
		this.path = this.createPath();
		this.makeLine();
		this.makeControls();
		if (this.onUpdate) this.onUpdate(this.points);
	}
	addPointToStart() {
		const firstPoint = this.points[0];
		const newPoint = new THREE.Vector3(firstPoint.point.x - 10, firstPoint.point.y, firstPoint.point.z);
		const newPointInc = new THREE.Vector3(firstPoint.point.x - 10, firstPoint.point.y, firstPoint.point.z - 5);
		const newPointOut = new THREE.Vector3(firstPoint.point.x - 10, firstPoint.point.y, firstPoint.point.z + 5);
		this.points.unshift({
			incomingControlPoint: newPointInc,
			point: newPoint,
			outgoingControlPoint: newPointOut,
		});
		this.path = this.createPath();
		this.makeLine();
		this.makeControls();
		if (this.onUpdate) this.onUpdate(this.points);
	}

	/**
	 * Creates a path, based on points
	 */
	createPath() {
		if (this.bezierEnabled) return this.sPath.createCurveFromPathPoints(this.points);
		else return this.sPath.createCurveFromPathPoints(this.points.map((point: PathPoint) => { return { point: point.point } }));
	}

	/**
	 * Listens for mouse movement
	 */
	listenforMouseMovement() {
		this.mouseMoveReference = this.mouseMove.bind(this);
		this.mouseDownReference = this.mouseDown.bind(this);
		this.mouseUpReference = this.mouseUp.bind(this);
		const doubleClickReference = this.doubleClick.bind(this);
		window.addEventListener('mousemove', this.mouseMoveReference, true);
		window.addEventListener('mousedown', this.mouseDownReference, true);
		window.addEventListener('mouseup', this.mouseUpReference, true);
		window.addEventListener('dblclick', doubleClickReference, true);
	}
	unlistenForMouseMovement() {
		window.removeEventListener('mousemove', this.mouseMoveReference, true);
		window.removeEventListener('mousedown', this.mouseDownReference, true);
		window.removeEventListener('mouseup', this.mouseUpReference, true);
	}

	/**
	 * Handle mouse events
	 */
	mouseMove(event: MouseEvent) {
		if (this.mouseDownStartPosition && new THREE.Vector2(event.clientX, event.clientY).distanceTo(this.mouseDownStartPosition) > 5) {
			clearTimeout(this.mouseDownTimer);
		}

		this.mousePointNormal.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mousePointNormal.y = - (event.clientY / window.innerHeight) * 2 + 1;
		this.mousePoint.x = event.clientX;
		this.mousePoint.y = event.clientY;

		if (this.intersectedControlHandle) {
			this.intersectedControlHandle.position.x = this.intersectedControlHandleClickPosition.x + ((this.mousePoint.x - this.mouseDownPoint.x) / 14);
			this.intersectedControlHandle.position.z = this.intersectedControlHandleClickPosition.z + ((this.mousePoint.y - this.mouseDownPoint.y) / 14);

			const pointReference = (this.points as any[])[this.intersectedControlHandle.pointIndex][this.intersectedControlHandle.pointType];
			pointReference.x = Math.round(this.intersectedControlHandle.position.x * 10000) / 10000;
			pointReference.z = Math.round(this.intersectedControlHandle.position.z * 10000) / 10000;

			this.path = this.createPath();
		}

		this.makeLine();
	}
	mouseDown(event: MouseEvent) {
		clearTimeout(this.mouseDownTimer);
		this.mouseDownStartPosition = new THREE.Vector2(event.clientX, event.clientY);

		this.raycaster.setFromCamera(this.mousePointNormal, this.main.s('Camera').mainCamera.threeCamera);
		const intersects = this.raycaster.intersectObjects([...this.pointHandles, ...this.pointIncomingControlHandles, ...this.pointOutgoingControlHandles]);

		if (intersects.length) {
			this.intersectedControlHandle = intersects[0].object;
			(this.intersectedControlHandle as any).material.color.set(0xffffff);

			this.mouseDownPoint.x = event.clientX;
			this.mouseDownPoint.y = event.clientY;

			this.intersectedControlHandleClickPosition.x = this.intersectedControlHandle.position.x;
			this.intersectedControlHandleClickPosition.z = this.intersectedControlHandle.position.z;

			this.main.s('Camera').orbitController.disable();

			this.mouseDownTimer = setTimeout(this.mouseDownLongPress.bind(this), this.mouseDownLongPressTime);
		}
	}
	mouseDownLongPress() {
		if (this.intersectedControlHandle) {
			this.longPressAddPoints();
		}
	}
	mouseUp() {
		clearTimeout(this.mouseDownTimer);

		if (this.intersectedControlHandle) {
			// Then all default behaviours
			const pointType = this.intersectedControlHandle.pointType;
			const colour = pointType == "point" && this.controlColourPoint || pointType == "incomingControlPoint" && this.controlColourIncoming || this.controlColourOutgoing;
			(this.intersectedControlHandle as any).material.color.set(colour);
			this.intersectedControlHandle = undefined;
		}

		this.main.s('Camera').orbitController.enable();

		if (this.onUpdate) this.onUpdate(this.points);
	}
	longPressAddPoints() {
		const pointReference = (this.points as any[])[this.intersectedControlHandle.pointIndex][this.intersectedControlHandle.pointType];
		const pointIndex = this.points.findIndex(point => point.point == pointReference);
		this.points.splice(pointIndex + 1, 0, { point: new THREE.Vector3(pointReference.x - 2, pointReference.y, pointReference.z) });
		this.points.splice(pointIndex, 0, { point: new THREE.Vector3(pointReference.x + 2, pointReference.y, pointReference.z) });
		this.path = this.createPath();
		this.makeControls();
		this.makeLine();
	}
	doubleClick() {
		this.raycaster.setFromCamera(this.mousePointNormal, this.main.s('Camera').mainCamera.threeCamera);
		const intersects = this.raycaster.intersectObjects([...this.pointHandles, ...this.pointIncomingControlHandles, ...this.pointOutgoingControlHandles]);

		if (intersects.length) {
			this.intersectedControlHandle = intersects[0].object;
			const pointReference = (this.points as any[])[this.intersectedControlHandle.pointIndex][this.intersectedControlHandle.pointType];
			this.points = this.points.filter(point => point.point !== pointReference);
			this.path = this.createPath();
			this.makeControls();
			this.makeLine();
			this.intersectedControlHandle = undefined;
		}
	}

	/**
	 * Exports points to the console
	 */
	exportObject() {
		console.log("%c >>>>>> Exporting as an object:", 'color:pink');
		const exportablePoints = this.bezierEnabled && this.points || this.points.map((point) => { return { point: point.point } });
		console.log(exportablePoints);
	}
	exportPathPoints() {
		console.log("%c >>>>>> Exporting as a point array:", 'color:pink');
		const points = this.bezierEnabled && this.points || this.points.map((point) => { return { point: point.point } });
		console.log(JSON.stringify(points, null, 2));
	}
	exportVectorPoints() {
		console.log("%c >>>>>> Exporting as a Vector3 array:", 'color:pink');
		const exportableVectorPoints = this.points.map((pointGroup: any) => {
			return this.bezierEnabled &&
				`{
				"incomingControlPoint": new Vector3(${pointGroup.incomingControlPoint.x}, ${pointGroup.incomingControlPoint.y}, ${pointGroup.incomingControlPoint.z}),
				"point": new Vector3(${pointGroup.point.x}, ${pointGroup.point.y}, ${pointGroup.point.z}),
				"outgoingControlPoint": new Vector3(${pointGroup.outgoingControlPoint.x}, ${pointGroup.outgoingControlPoint.y}, ${pointGroup.outgoingControlPoint.z})
			}` ||
				`{
				"point": new Vector3(${pointGroup.point.x}, ${pointGroup.point.y}, ${pointGroup.point.z})
		 	}`;
		});
		console.log(exportableVectorPoints.join(',\n'));
	}

	/**
	 * Destroys all
	 */
	destroy() {
		this.destroyLine();
		this.destroyHandles();
		this.unlistenForMouseMovement();
	}

	/**
	 * Destroys the line on redraw
	 */
	destroyHandles() {
		this.pointHandles.forEach((pointHandle: THREE.Mesh) => this.main.scene.remove(pointHandle));
		this.pointIncomingControlHandles.forEach((pointHandle: THREE.Mesh) => this.main.scene.remove(pointHandle));
		this.pointOutgoingControlHandles.forEach((pointHandle: THREE.Mesh) => this.main.scene.remove(pointHandle));

		this.pointHandles = [];
		this.pointIncomingControlHandles = [];
		this.pointOutgoingControlHandles = [];
	}

	/**
	 * Destroys the line on redraw
	 */
	destroyLine() {
		if (this.lineGeometry) {
			this.lineGeometry.dispose();
			this.lineGeometry = undefined;
		}
		if (this.lineMaterial) {
			this.lineMaterial.dispose();
		}
		if (this.line) {
			this.main.scene.remove(this.line);
			this.line = undefined;
		}
	}
}