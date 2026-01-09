import * as THREE from 'three';
import { Interactable2, InteractableOrders, InteractionService2 } from '../../game/InteractionService2';
import { Main } from '../../core/Main';
import { MovePathDefinition, PathDefinition, PathGeometryTypes, PathPoint } from '../../data/PathInterfaces';
import { PathService } from '../../game/PathService';

export class CreepPath {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Setup Properties
	 * */
	variantDistance: number = 5;

	/**
	 * Wave Properties
	 * */
	id: string;
	corePath: MovePathDefinition = {
		id: 'core',
		active: true,
		pathPoints: [],
		pathLength: 0,
		path: new THREE.CurvePath(),
		pathProgress: 0,
		pathTravelPercentagePerSec: 0,
	};
	variantPaths: MovePathDefinition[] = [];
	groupMain: THREE.Group; // Contains a pathMesh's groupmain, if created

	/**
	 * Constructor
	 * */
	constructor(pathDefinition: PathDefinition, main: Main) {
		this.id = pathDefinition.id;
		this.main = main;
		this.setCorePath(pathDefinition.pathPoints);
		this.createPathGeometry(pathDefinition);

		this.setInteractive();

		return this;
	}

	/**
	 * Sets the core path
	 * */
	setCorePath(pathPoints: PathPoint[]) {
		const sPath: PathService = this.main.s('Path');
		this.corePath.pathPoints = pathPoints;
		this.corePath.path = sPath.createCurveFromPathPoints(pathPoints);
		this.corePath.pathLength = this.corePath.path.getLength();
	}

	/**
	 * Creates a variant path for uniqueness
	 * */
	createVariantPath(): MovePathDefinition {
		const sPath = this.main.s('Path');

		const variantPath = sPath.createMovePath(this.corePath.id, this.corePath.pathPoints, this.getRandomAdjustX(), this.getRandomAdjustZ());
		this.variantPaths.push(variantPath);
		return variantPath;
	}

	/**
	 * Creates a extruded path shape on the map
	 * */
	createPathGeometry(pathDefinition: PathDefinition) {
		if (pathDefinition.pathGeometry == PathGeometryTypes.none) return;

		const lineWidth = 8;
		const lineHeight = -0.1;

		// Create the path shape
		const shape = new THREE.Shape();
		shape.moveTo(0, -lineWidth / 2);
		shape.lineTo(0, lineWidth / 2);
		shape.lineTo(lineHeight, lineWidth / 2);
		shape.lineTo(lineHeight, -lineWidth / 2);
		shape.lineTo(0, -lineWidth / 2);

		// Extrude Settings
		const extrudeSettings = {
			steps: 750,
			depth: 1,
			bevelEnabled: false,
			extrudePath: this.corePath.path,
		};

		// Create the material
		let pathMaterial;
		switch (pathDefinition.pathGeometry) {
			case PathGeometryTypes.dirt:
				//pathMaterial = new THREE.MeshStandardMaterial({ color: 0xbfa340 });
				pathMaterial = new THREE.ShaderMaterial({ vertexShader: creepPathVertexShader, fragmentShader: creepPathFragmentShader/*, flatShading: true*/ });
				break;
			case PathGeometryTypes.rock:
				pathMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
				break;
		}

		// Create the geometry and mesh and attach
		const pathGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings as any);
		const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
		pathMesh.name = 'creepPath';

		// Create group
		this.groupMain = new THREE.Group();
		this.groupMain.name = 'CreepPath';
		this.groupMain.add(pathMesh);

		// Add shadows
		this.groupMain.children.forEach((child: any) => {
			if (child.isMesh) {
				child.castShadow = false;
				child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive() {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractable(new Interactable2('creepPath', InteractableOrders.creeps, this));
	}

	getRandomAdjustX() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}

	getRandomAdjustZ() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}

	/**
	 * Removes creep paths from the level
	 */
	dispose() {
		this.main.scene.remove(this.groupMain);
	}
}

const creepPathVertexShader = `
	varying vec2 vUv;
	varying float vHeight;
	varying float vDisplacement; // New: Pass the "bumpiness" value

	float hash(vec2 p) {
		return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
	}

	float noise(vec2 p) {
		vec2 i = floor(p);
		vec2 f = fract(p);
		float a = hash(i);
		float b = hash(i + vec2(0.0, 0.0));
		vec2 u = f * f * (3.0 - 2.0 * f);
		return mix(a, b, u.x);
	}

	void main() {
		vUv = uv;
		vHeight = position.y;

		// 1. Calculate Noise
		float d = noise(position.xz * 3.0);  // was 3.0
		vDisplacement = d; // Save this for the fragment shader

		vec3 newPosition = position;
		
		// 2. Displace ONLY the sides
		// If we are at the "bottom" or "sides" of the rectangle extrusion
		if(position.y < 0.1) {
			newPosition.xz += normal.xz * d * 0.3; // Move outward based on noise
		}

		gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
	}
`;

const creepPathFragmentShader = `
	varying vec2 vUv;
	varying float vHeight;
	varying float vDisplacement;

	void main() {
		// 1. Base Colors
		vec3 sandColor = vec3(0.76, 0.70, 0.50);
		vec3 dirtColor = vec3(0.5, 0.45, 0.25);

		// 2. The Top vs Side Logic (from height)
		float topMask = smoothstep(0.3, 0.45, vHeight);

		// 3. Fake Lighting (Ambient Occlusion)
		// We darken the color where the displacement noise is low.
		// This makes the "bumpy" parts pop.
		float shadow = mix(1.8, 1.9, vDisplacement); 

		// 4. Edge Blend (Creeping dirt on the top edges)
		float edgeCreep = abs(vUv.y - 0.5) * 2.0;
		float dirtOnTop = smoothstep(0.6, 0.95, edgeCreep);

		// 5. Final Mix
		vec3 topFinal = mix(sandColor, dirtColor, dirtOnTop);
		vec3 finalColor = mix(dirtColor, topFinal, topMask);

		// 6. APPLY THE SHADOWS
		// This multiplies the color by our noise-based light map
		gl_FragColor = vec4(finalColor * shadow, 1.0);
	}
`;
