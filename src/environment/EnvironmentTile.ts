import * as THREE from 'three';
import { Main } from '../core/Main';
import { TowerZoneShapePlacement } from './towers/TowerPlacementZone';

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
		//const materialBevel = new THREE.MeshStandardMaterial({ color: this.properties.bevelColour });
		const materialBevel = new THREE.ShaderMaterial({
			uniforms: {
				uColor: { value: new THREE.Color(this.properties.bevelColour) },
				uRoughness: { value: 0.075 },
			},
			vertexShader: bevelVertexShader,
			fragmentShader: bevelFragmentShader
		});

		if (this.properties.type == "land") {
			const materialMain = new THREE.MeshStandardMaterial({ color: this.properties.colour });
			materialMain.polygonOffset = true;
			materialMain.polygonOffsetFactor = 1;
			materialMain.polygonOffsetUnits = 1;

			return [materialMain, materialBevel];
		} else {
			const materialWater = new THREE.ShaderMaterial({
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
	}
}

export interface EnvironmentTileProperties {
	type: "land" | "sea",
	distance: number,
	colour: number,
	bevelColour: number
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