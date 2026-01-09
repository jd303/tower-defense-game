import * as THREE from 'three';
import { Main } from '../core/Main';
import { TowerZoneShapePlacement } from './towers/TowerPlacementZone';
import { CameraService } from '../core/CameraService';

export class EnvironmentTile {
	/**
	 * Core
	 * */
	main: Main;
	properties: EnvironmentTileProperties;
	curve: THREE.Curve<any> | THREE.CatmullRomCurve3;
	groupMain: THREE.Group; // Contains a pathMesh's groupmain, if created
	towerZoneShapePlacement?: TowerZoneShapePlacement;

	/**
	 * Constructor
	 * */
	constructor(curve: THREE.Curve<any> | THREE.CatmullRomCurve3, main: Main, environmentTileProperties: EnvironmentTileProperties, towerZoneShapePlacement?: TowerZoneShapePlacement) {
		this.main = main;
		this.curve = curve;
		this.properties = environmentTileProperties;
		const mesh = this.createPathGeometry();

		if (towerZoneShapePlacement) this.towerZoneShapePlacement = towerZoneShapePlacement;

		this.groupMain = new THREE.Group();
		this.groupMain.add(mesh);

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
		const material = this.createEnvironmentTileMaterial();

		const mesh = new THREE.Mesh(geometry, material);
		mesh.receiveShadow = true;
		mesh.material.needsUpdate = true;
		mesh.position.y = 0.1;
		return mesh;
	}

	/**
	 * Creates a material based on the environment tile type
	 */
	createEnvironmentTileMaterial() {
		if (this.properties.type == "land") {
			const material = new THREE.MeshStandardMaterial({ color: this.properties.colour || 0xeeaa88 });
			material.polygonOffset = true;
			material.polygonOffsetFactor = 1;
			material.polygonOffsetUnits = 1;

			return material;
		} else {
			const waterMaterial = new THREE.ShaderMaterial({
				uniforms: {
					uTime: { value: 0 },
					waterColor: { value: new THREE.Color(0x0077be) },
					foamColor: { value: new THREE.Color(0xffffff) },
					lightDir: { value: new THREE.Vector3(5, 10, 5).normalize() }
				},
				vertexShader: waterVertexShader,
				fragmentShader: waterFragmentShader,
				transparent: true
			});

			setInterval(() => {
				waterMaterial.uniforms.uTime.value += 0.1;
			}, 50);

			return waterMaterial;
		}
	}

	/**
	 * Disposes the environment tile
	 */
	dispose() {
		this.main.scene.remove(this.groupMain);
	}
}

export interface EnvironmentTileProperties {
	type: "land" | "sea",
	distance: number,
	colour: number
}

const waterFragmentShader = `
	float contrast = 0.25;

	uniform float uTime;
	varying vec2 vUv;

	// Standard hash for randomness
	vec2 hash22(vec2 p) {
		p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
		return fract(sin(p) * 43758.5453123);
	}

	// Simple noise function
	float simpleNoise(vec2 p) {
		vec2 i = floor(p);
		vec2 f = fract(p);
		float a = hash22(i).x;
		float b = hash22(i + vec2(1.0, 0.0)).x;
		float c = hash22(i + vec2(0.0, 1.0)).x;
		float d = hash22(i + vec2(1.0, 1.0)).x;
		vec2 u = f * f * (3.0 - 2.0 * f);
		return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
	}

	// Voronoi for the actual ripples
	float voronoi(vec2 x) {
		vec2 n = floor(x);
		vec2 f = fract(x);
		float m = 8.0;
		for(int j=-1; j<=1; j++)
		for(int i=-1; i<=1; i++) {
			vec2 g = vec2(float(i), float(j));
			vec2 o = hash22(n + g);
			o = 0.5 + 0.5 * sin(uTime + 6.2831 * o);
			vec2 r = g + o - f;
			float d = dot(r, r);
			if(d < m) m = d;
		}
		return sqrt(m);
	}

	void main() {
      // 1. DYNAMIC CLUMPING (SOFTENED)
      // Lower the multipliers (0.8 and 1.0) to make the clumps much larger
      float n1 = simpleNoise(vUv * 0.8 + uTime * 0.05); 
      float n2 = simpleNoise(vUv * 1.0 - uTime * 0.5);
      float combinedClump = (n1 + n2) * 0.45;

      // Widen the smoothstep range (0.3 to 0.7) to create a soft "feathered" edge 
      // instead of a hard cutout.
      float threshold = 0.4 + sin(uTime * 0.3) * 0.05; 
      float clumpMask = smoothstep(0.3, 0.7, combinedClump);

      // 2. RIPPLE LOGIC (LARGER & LOWER CONTRAST)
      // Reduced scale from 12.0 to 4.0 makes the ripples "larger" and less "pointy"
      vec2 rippleUv = vUv * 4.0; 
      float v1 = voronoi(rippleUv + uTime * 0.1);
      float v2 = voronoi(rippleUv * 1.2 - uTime * 0.5);
      
      // We widen the smoothstep here (0.1 to 0.8) to make the ripples look like 
      // soft glows rather than sharp white spots.
      //float ripplePattern = smoothstep(0.9, 0.8, v1 * v2); // Very large smooth ripples
		float ripplePattern = smoothstep(0.1, 0.8, v1 * v2); // Small, sharper ripples

      // 3. BLENDING
      // Multiply by clumpMask to keep the grouping logic
      float finalRipple = ripplePattern * clumpMask;

      // Output Colors
      vec3 waterBase = vec3(0.0, 0.25, 0.26);
      vec3 rippleHighlight = vec3(0.5, 0.8, 1.0);
      
      // Reduce the intensity multiplier (0.3 instead of 0.6) for subtle contrast
      vec3 finalColor = mix(waterBase, rippleHighlight, finalRipple * contrast);

      gl_FragColor = vec4(finalColor, 1.0);
   }
`;

const waterVertexShader = `
	varying vec2 vUv;
	uniform float uTime;

	void main() {
		vUv = uv;
		vec3 pos = position;
		
		// Combine multiple sine waves for "random" movement
		float noise = sin(pos.x * 1.5 + uTime) * 0.1;
		noise += sin(pos.z * 1.0 + uTime * 0.8) * 0.01;
		
		pos.y += noise;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	}
`;