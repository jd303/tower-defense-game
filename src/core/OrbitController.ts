import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Main } from './Main';
import { PathService } from '../game/PathService';
import { CameraSettings } from './CameraService';

export class OrbitController {
	/**
	 * Properties
	 * */
	main: Main;
	camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
	cameraSettings: CameraSettings;
	controls: OrbitControls;
	panClampBounds: ClampBounds;
	panClampBoundsDebug: ClampBounds = { minX: -125, maxX: 125, minZ: -125, maxZ: 125 };

	/**
	 * Constructor
	 * */
	constructor(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, cameraSettings: CameraSettings, canvas: HTMLCanvasElement, main: Main) {
		this.camera = camera;
		this.cameraSettings = cameraSettings;
		this.controls = new OrbitControls(camera, canvas);
		this.controls.enablePan = true;
		this.controls.enableRotate = true;
		this.controls.enableZoom = true;
		this.controls.maxZoom = 0;
		this.controls.minZoom = 0;
		this.controls.panSpeed = 1;
		this.controls.touches = {
			ONE: THREE.TOUCH.PAN,
			TWO: THREE.TOUCH.DOLLY_PAN
		}
		this.main = main;

		if (cameraSettings.panClampBounds) {
			this.panClampBounds = main.debugMode ? this.panClampBoundsDebug : cameraSettings.panClampBounds;
			this.setupPanClamp();
		}

		if (this.main.debugMode) this.drawDebugBounds();

		return this;
	}

	/**
	 * Stops the camera from going too far
	 */
	/*enablePanClamp() {
		this.controls.addEventListener('change', this.panClamp.bind(this));
	}*/

	/**
	 * Releases the pan clamp
	 */
	/*disablePanClamp() {
		this.controls.removeEventListener('change', this.panClamp.bind(this));
	}*/

	/**
	 * Calculates the pan clamp
	 */
	/*panClamp(event: any) {
		// HALTED DUE TO MAYBE BEING THE WRONG DIRECTION
		const minX = -40, maxX = 40;
		let minY = -20, maxY = 150;
		const minZ = -45, maxZ = 45;

		// Adjust the y based on the polar angle
		//const panClampPolarModifierZoom = [10, 55]; // Would have been used to manage zoom
		const panClampPolarModifier = Maths.getAttenuatedValue(this.controls.getPolarAngle(), 0, 1);
		console.log(panClampPolarModifier);
		minY = panClampPolarModifier < 0.5 ? 10 : -20;

		const target = this.controls.target;
		const camPos = this.camera.position;

		// Calculate delta between camera and target
		const offset = camPos.clone().sub(target);

		// Clamp the target position
		target.x = THREE.MathUtils.clamp(target.x, minX, maxX);
		target.y = THREE.MathUtils.clamp(target.y, minY, maxY);
		target.z = THREE.MathUtils.clamp(target.z, minZ, maxZ);

		// Update the camera position to maintain offset
		this.camera.position.copy(target.clone().add(offset));
		console.log(this.camera.position);
	}*/

	/**
	 * Enables availability of orbit controls
	 */
	enable() {
		this.controls.enabled = true;
	}

	/**
	 * Disables availability of orbit controls
	 */
	disable() {
		this.controls.enabled = false;
	}

	/**
	 * Adjusts the camera position, if the camera's projection exceeds the currently activeClampBounds
	 * @param camera
	 */
	setupPanClamp() {
		const planeY = 0;
		const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeY);
		const tempVec = new THREE.Vector3();

		function getFrustumCornersOnPlane() {
			const ndcCorners = [
				new THREE.Vector2(-1, -1),
				new THREE.Vector2(1, -1),
				new THREE.Vector2(1, 1),
				new THREE.Vector2(-1, 1)
			];

			return ndcCorners.map(ndc => {
				const raycaster = new THREE.Raycaster();
				raycaster.setFromCamera(ndc, this.camera);
				return raycaster.ray.intersectPlane(plane, tempVec.clone());
			}).filter(p => p); // Only keep valid intersections
		}

		function clampTargetToBounds() {
			const corners = getFrustumCornersOnPlane.bind(this)();
			if (corners.length < 4) return;

			const excess = { x: 0, z: 0 };

			corners.forEach(pt => {
				if (pt!.x < this.panClampBounds.minX) excess.x = Math.max(excess.x, this.panClampBounds.minX - pt!.x);
				if (pt!.x > this.panClampBounds.maxX) excess.x = Math.min(excess.x, this.panClampBounds.maxX - pt!.x);
				if (pt!.z < this.panClampBounds.minZ) excess.z = Math.max(excess.z, this.panClampBounds.minZ - pt!.z);
				if (pt!.z > this.panClampBounds.maxZ) excess.z = Math.min(excess.z, this.panClampBounds.maxZ - pt!.z);
			});

			if (excess.x !== 0 || excess.z !== 0) {
				this.controls.target.x += excess.x;
				this.controls.target.z += excess.z;
				this.camera.position.x += excess.x;
				this.camera.position.z += excess.z;
			}
		}

		// Hook into the controls update loop
		const originalUpdate = this.controls.update.bind(this.controls);
		this.controls.update = () => {
			originalUpdate();
			clampTargetToBounds.bind(this)();
			return true;
		};
	}

	/**
	 * Creates a debug line to show camera bounds
	 */
	drawDebugBounds() {
		if (this.cameraSettings.panClampBounds) {
			const sPath: PathService = this.main.s('Path');
			const curvePath = sPath.createCurveFromPathPoints([
				{ point: new THREE.Vector3(this.cameraSettings.panClampBounds!.minX, 0.5, this.cameraSettings.panClampBounds!.minZ) },
				{ point: new THREE.Vector3(this.cameraSettings.panClampBounds!.minX, 0.5, this.cameraSettings.panClampBounds!.maxZ) },
				{ point: new THREE.Vector3(this.cameraSettings.panClampBounds!.maxX, 0.5, this.cameraSettings.panClampBounds!.maxZ) },
				{ point: new THREE.Vector3(this.cameraSettings.panClampBounds!.maxX, 0.5, this.cameraSettings.panClampBounds!.minZ) },
				{ point: new THREE.Vector3(this.cameraSettings.panClampBounds!.minX, 0.5, this.cameraSettings.panClampBounds!.minZ) },
			], 0, 0, true);

			const outline = sPath.debugCreateOutlines(curvePath, 0x0000ff);
			this.main.scene.add(outline);
		}
	}

	/*setupPanClamp(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera, terrainBounds: any) {
		const planeY = 0;
		const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeY);
		const tempVec = new THREE.Vector3();

		function getFrustumCornersOnPlane() {
			const ndcCorners = [
				new THREE.Vector2(-1, -1),
				new THREE.Vector2(1, -1),
				new THREE.Vector2(1, 1),
				new THREE.Vector2(-1, 1)
			];

			return ndcCorners.map(ndc => {
				const raycaster = new THREE.Raycaster();
				raycaster.setFromCamera(ndc, camera);
				return raycaster.ray.intersectPlane(plane, tempVec.clone());
			}).filter(p => p); // Only keep valid intersections
		}

		function clampTargetToBounds() {
			const corners = getFrustumCornersOnPlane();
			if (corners.length < 4) return;

			const excess = { negX: 0, negZ: 0, posX: 0, posZ: 0 };

			corners.forEach(pt => {
				if (pt!.x < terrainBounds.minX) excess.negX = Math.max(excess.negX, terrainBounds.minX - pt!.x);
				if (pt!.x > terrainBounds.maxX) excess.posX = Math.min(excess.posX, terrainBounds.maxX - pt!.x);
				if (pt!.z < terrainBounds.minZ) excess.negZ = Math.max(excess.negZ, terrainBounds.minZ - pt!.z);
				if (pt!.z > terrainBounds.maxZ) excess.posZ = Math.min(excess.posZ, terrainBounds.maxZ - pt!.z);
			});

			//if (excess.negX !== 0_

			if (excess.negX !== 0 || excess.negZ !== 0) {
				this.controls.target.x += excess.negX;
				this.controls.target.z += excess.negZ;
				camera.position.x += excess.negX;
				camera.position.z += excess.negZ;
			}

			if (excess.posX !== 0 || excess.posZ !== 0) {
				this.controls.target.x -= excess.posX;
				this.controls.target.z -= excess.posZ;
				camera.position.x -= excess.posX;
				camera.position.z -= excess.posZ;
				console.log("NEGGING Z", excess.posZ, excess.posX);
			}
		}

		// Hook into the controls update loop
		const originalUpdate = this.controls.update;
		this.controls.update = () => {
			originalUpdate();
			clampTargetToBounds.bind(this)();
			return true;
		};
	}*/
}

export interface ClampBounds {
	minX: number,
	maxX: number,
	minZ: number,
	maxZ: number
}