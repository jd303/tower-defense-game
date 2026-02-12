import * as THREE from 'three';
import { Main } from '../core/Main';
import { TowerZoneShapePlacement } from './towers/TowerPlacementZone';
import { WaterFragmentShader, WaterVertexShader } from '../shaders/shader.water';
import { PathService } from '../game/PathService';

export class EnvironmentTile {
	/**
	 * Core
	 * */
	static SmoothRadius = 2; // When smoothing, use this radius
	main: Main;
	properties: EnvironmentTileProperties;
	curve: THREE.Curve<any> | THREE.CatmullRomCurve3;
	groupMain: THREE.Group; // Contains a pathMesh's groupmain, if created
	towerZoneShapePlacement?: TowerZoneShapePlacement;
	debugOutline?: THREE.Line;

	/**
	 * Constructor
	 * */
	constructor(curve: THREE.CurvePath<any>, main: Main, environmentTileProperties: EnvironmentTileProperties, towerZoneShapePlacement?: TowerZoneShapePlacement) {
		const sPath: PathService = main.s('Path');

		// Set
		this.main = main;
		this.properties = environmentTileProperties;
		this.curve = environmentTileProperties.smooth ? sPath.smoothPathByPoints(curve, EnvironmentTile.SmoothRadius, 4) : curve;

		const mesh = this.createPathGeometry();
		this.groupMain = new THREE.Group();
		this.groupMain.add(mesh);

		if (towerZoneShapePlacement) this.towerZoneShapePlacement = towerZoneShapePlacement;

		if (this.main.debugMode) {
			this.debugOutline = sPath.debugCreateOutlines(curve, 0xff0000);
			this.main.scene.add(this.debugOutline);
		}

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
			bevelEnabled: true,
			depth: 0.2,
			bevelThickness: 0.5, //0.075
			bevelSize: 0.75, // 0.2
			bevelOffset: -0.33,
			bevelSegments: 2,
			steps: 1,
			curveSegments: 2,
			...options
		};

		const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		geometry.rotateX(Math.PI / 2); // So it stands up on XZ
		const materials = this.createEnvironmentTileMaterials();

		const mesh = new THREE.Mesh(geometry, materials);
		mesh.receiveShadow = true;
		mesh.material[0].needsUpdate = true;
		mesh.position.y = -0.22; // Not necessarily right, but shows under the debug lines for now
		return mesh;
	}

	/**
	 * Creates a material based on the environment tile type
	 */
	createEnvironmentTileMaterials() {
		const materialBevel = new THREE.ShaderMaterial({
			uniforms: {
				uColor: { value: new THREE.Color(this.properties.bevelColour) },
				uRoughness: { value: 0.075 },
			},
			vertexShader: bevelVertexShader,
			fragmentShader: bevelFragmentShader
		});

		// LAND
		if (this.properties.type == "land") {
			const materialMain = new THREE.MeshStandardMaterial({ color: this.properties.colour });
			materialMain.polygonOffset = true;
			materialMain.polygonOffsetFactor = 1;
			materialMain.polygonOffsetUnits = 1;

			return [materialMain, materialBevel];
		}

		// SEA
		else {
			const materialWater = new THREE.ShaderMaterial({
				uniforms: {
					uTime: { value: 0 },
					waterColor: { value: new THREE.Color(0x0077be) },
					foamColor: { value: new THREE.Color(0xffffff) },
					lightDir: { value: new THREE.Vector3(5, 10, 5).normalize() }
				},
				vertexShader: WaterVertexShader,
				fragmentShader: WaterFragmentShader,
				transparent: true
			});

			setInterval(() => {
				materialWater.uniforms.uTime.value += 0.1;
			}, 50);

			return [materialWater, materialBevel];
		}
	}

	/**
	 * Disposes the environment tile
	 */
	dispose() {
		this.main.scene.remove(this.groupMain);
		if (this.debugOutline) this.main.scene.remove(this.debugOutline);
	}
}

export interface EnvironmentTileProperties {
	type: "land" | "sea",
	distance: number,
	colour: number,
	bevelColour: number,
	smooth: boolean
}

const bevelVertexShader = `
	// Standard Three.js uniforms and attributes
	varying vec2 vUv;
	uniform float uRoughness; // Control the intensity (e.g., 0.05)

	// Simple hash function to generate "random" noise from a coordinate
	float hash(vec2 p) {
		p = fract(p * vec2(123.34, 456.21));
		p += dot(p, p + 45.32);
		return fract(p.x * p.y);
	}

	void main() {
		vUv = uv;
		
		// Copy the original position
		vec3 newPosition = position;

		// Generate noise based on the original X and Z
		// We use the original coordinates as a "seed"
		float noiseX = hash(position.xz + 1.0) - 0.5;
		float noiseZ = hash(position.zx + 2.0) - 0.5;

		// Apply the displacement
		newPosition.x += noiseX * uRoughness;
		newPosition.z += noiseZ * uRoughness;

		// Standard projection
		gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
	}
`;

const bevelFragmentShader = `
	precision highp float;
	uniform vec3 uColor;
	varying vec2 vUv;
	varying vec3 vNormal;

	void main() {
		vec3 color = uColor;
		color = pow(color.rgb, vec3(1.0 / 2.2));

		gl_FragColor = vec4(color, 1.0);
	}
`;