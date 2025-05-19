import * as THREE from 'three';
import { Main } from '../core/Main';

export class EnvironmentTile {
	/**
	 * Core
	 * */
	main: Main;
	colour: number;
	curve: THREE.Curve<any> | THREE.CatmullRomCurve3;
	groupMain: THREE.Group; // Contains a pathMesh's groupmain, if created

	/**
	 * Constructor
	 * */
	constructor(curve: THREE.Curve<any> | THREE.CatmullRomCurve3, main: Main, colour = 0xeeaa88) {
		this.main = main;
		this.curve = curve;
		this.colour = colour;
		const mesh = this.createPathGeometry();

		this.groupMain = new THREE.Group();
		this.groupMain.add(mesh);
		this.main.scene.add(this.groupMain);

		console.log("TODO, Make this interactive, and rethink interactions");
		//this.setInteractive(main);

		return this;
	}

	/**
	 * Creates a extruded path shape on the map
	 * */
	createPathGeometry() {
		const shape = this.createShapeFromCurve();
		const mesh = this.createBeveledMeshFromShape(shape);
		return mesh;
	}

	/**
	 * Creates a shape, given a curve
	 */
	createShapeFromCurve() {
		const shape = new THREE.Shape();
		const divisions = 100;

		const first = this.curve.getPoint(0);
		shape.moveTo(first.x, first.z);

		for (let i = 0; i <= 1; i += 1 / divisions) {
			const point = this.curve.getPoint(i);
			shape.lineTo(point.x, point.z);
		}

		return shape;
	}

	/**
	 * Turns a shape into a bevelled environmnet tile
	 */
	createBeveledMeshFromShape(shape: THREE.Shape, options = {}) {
		const extrudeSettings = {
			depth: 0.2,
			bevelEnabled: true,
			bevelThickness: 0.05,
			bevelSize: 0.2,
			bevelSegments: 2,
			steps: 1,
			curveSegments: 100,
			...options
		};

		const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		geometry.rotateX(Math.PI / 2); // So it stands up on XZ
		const material = new THREE.MeshStandardMaterial({ color: this.colour });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.receiveShadow = true;
		material.polygonOffset = true;
		material.polygonOffsetFactor = 1;
		material.polygonOffsetUnits = 1;
		mesh.material.needsUpdate = true;
		mesh.position.y = 0.1;
		return mesh;
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive(main: Main) {
		/*const sInteraction = main.s('Interaction');
		sInteraction.registerDefaultTarget(new Interactable(InteractableOrders.terrain, this));*/
	}
}
