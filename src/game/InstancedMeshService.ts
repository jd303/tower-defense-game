import THREE from "three";
import { Main } from '../core/Main';
import { SpriteSheet } from "../game/SpriteService";
import { ShaderMaterialProperties, SpriteAsset } from "../environment/assets/SpriteAsset";
import { TickCallback, TickService, TickTimeProperties } from "../core/TickService";

export class InstancedMeshService {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Main properties
	 */
	instancedMeshes: Record<string, InstancedMesh> = {};

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Sources an instanced mesh or creates one
	 */
	async sourceInstancedMesh(assetName: string, assetClass: typeof SpriteAsset, spriteSheet: SpriteSheet, instancedMeshInstanceCount: number, instancedMeshAnimates: boolean) {
		if (this.instancedMeshes[assetName]) {
			if (this.instancedMeshes[assetName] instanceof Promise) {
				return await this.instancedMeshes[assetName];
			} else return this.instancedMeshes[assetName];
		} else {
			const instancedMesh = await this.createSpriteSheetInstancedMesh(assetClass.assetName, spriteSheet, assetClass.ShaderMaterialProperties, instancedMeshInstanceCount, instancedMeshAnimates);

			if (instancedMesh) {
				const positioner = new THREE.Object3D();
				positioner.position.set(-100 + Math.random() * 5, assetClass.assetPositionY + assetClass.assetScale / 2, -90 + Math.random() * 5);
				positioner.scale.set(assetClass.assetScale, assetClass.assetScale, assetClass.assetScale);
				positioner.updateMatrix();

				// Setup with initial settings
				instancedMesh.geometry.attributes.animationRow.setX(0, 0);
				instancedMesh.geometry.attributes.animationSpeed.setX(0, 0);
				instancedMesh.geometry.attributes.cellsInRow.setX(0, 0);

				for (let x = 0; x < instancedMesh.iMesh.count; x++) {
					instancedMesh.iMesh.setMatrixAt(x, positioner.matrix);
				}

				this.main.scene.add(instancedMesh.iMesh);
			}

			return instancedMesh;
		}
	}

	/**
	 * Creates an instanced mesh for sprites
	 */
	createInstancedMesh(assetName: string, geometry: THREE.PlaneGeometry, material: THREE.ShaderMaterial, assetCount: number = 100) {
		if (this.instancedMeshes[assetName]) return console.error(`Cannot recreate ${assetName} Instanced Mesh`);

		const iMesh = new InstancedMesh(this.main, assetName, this, geometry, material, assetCount);
		this.instancedMeshes[assetName] = iMesh;

		return iMesh;
	}

	/**
	 * Creates an instanced mesh for sprites
	 */
	createSpriteSheetInstancedMesh(assetName: string, spriteSheet: SpriteSheet, materialProperties: ShaderMaterialProperties, assetCount: number = 100, instancedMeshAnimates: boolean = false) {
		if (this.instancedMeshes[assetName]) return console.error(`Cannot recreate ${assetName} Instanced Mesh`);

		const vertexShader = spriteSheet.spriteService.vertexShader;
		const fragmentShader = spriteSheet.spriteService.fragmentShader;
		const material = new THREE.ShaderMaterial({
			...materialProperties,
			uniforms: {
				...materialProperties.uniforms,
				uTime: { value: 0 },
				uMap: { value: spriteSheet.texture },
			},
			vertexShader,
			fragmentShader
		});

		const iMesh = new SpriteSheetInstancedMesh(this.main, assetName, this, material, assetCount);
		iMesh.instancedMeshAnimates = instancedMeshAnimates;
		this.instancedMeshes[assetName] = iMesh;

		return iMesh;
	}

	/**
	 * Removes an instanced Mesh
	 */
	removeInstancedMesh(assetName: string) {
		delete this.instancedMeshes[assetName];
	}

	/**
	 * Gets an instanced Mesh
	 */
	getInstancedMeshByName(name: string) {
		return this.instancedMeshes[name];
	}

	/**
	 * Update Instanced Meshes and frames
	 */
	updateInstancedMeshes() {
		Object.keys(this.instancedMeshes).forEach((iMeshRecord: any) => {
			if (this.instancedMeshes[iMeshRecord].instancedMeshAnimates) {
				this.instancedMeshes[iMeshRecord].iMesh.instanceMatrix.needsUpdate = true;
			}
		});
	}
}

/**
 * An Instanced Mesh
 */
export class InstancedMesh {
	main: Main;
	assetName: string;
	iMesh: THREE.InstancedMesh;
	iMeshMaximumIndexes: number = 0;
	iMeshTotalIndexes: number = 0;
	geometry: THREE.PlaneGeometry;
	instancedMeshService: InstancedMeshService;
	instancedMeshAnimates: boolean = false;

	/**
	 * Constructor
	 */
	constructor(main: Main, assetName: string, instancedMeshService: InstancedMeshService, geometry: THREE.PlaneGeometry /* MIGHT HAVE TO RETHINK THIS GEOMETRY TYPE FOR OTHER INSTANCEDMESHES */, material: THREE.Material, assetCount: number = 100) {
		this.main = main;
		this.assetName = assetName;
		this.instancedMeshService = instancedMeshService;
		this.geometry = geometry;
		this.iMeshMaximumIndexes = assetCount;

		const mesh = new THREE.InstancedMesh(geometry, material, assetCount);
		this.iMesh = mesh;
		mesh.count = 0; // Manually set the count to 0, which will be incremented as assets are added
		mesh.frustumCulled = false;

		const colour = new THREE.Color(1, 1, 1);
		for (let x = 0; x < assetCount; x++) {
			this.iMesh.setColorAt(x, colour);
		}

		return this;
	}

	/**
	 * Assigns and increments an Instanced Mesh Index
	 */
	assignInstancedMeshIndex() {
		const currentIndexedMesh = this.iMeshTotalIndexes;
		this.iMeshTotalIndexes += 1;
		return currentIndexedMesh;
	}

	/**
	 * Gets the size of an instance based on the instance index
	 */
	getSizeOfInstance(instancedMeshIndex: number) {
		/*const box = new THREE.Box3().setFromObject(this.iMesh);
		const baseSize = new THREE.Vector3();
		box.getSize(baseSize);*/

		//const box = new THREE.Box3().setFromObject(this.iMesh);
		this.iMesh.geometry.computeBoundingBox();
		const geoBox = this.iMesh.geometry.boundingBox!;
		const baseSize = new THREE.Vector3();
		geoBox.getSize(baseSize);

		const matrix = new THREE.Matrix4();
		const scale = new THREE.Vector3();

		// Get the matrix for instance
		this.iMesh.getMatrixAt(instancedMeshIndex, matrix);

		// Extract the scale components from the matrix columns
		// This is faster than matrix.decompose()
		scale.set(
			new THREE.Vector3(matrix.elements[0], matrix.elements[1], matrix.elements[2]).length(),
			new THREE.Vector3(matrix.elements[4], matrix.elements[5], matrix.elements[6]).length(),
			new THREE.Vector3(matrix.elements[8], matrix.elements[9], matrix.elements[10]).length()
		);

		const material = this.iMesh.material as THREE.ShaderMaterial;
		console.error("Need to calculate instance size properly, for selector");
		//const finalWidth = baseSize.x * scale.x * this.iMesh.scale.x * material.uniforms.uSize.value;
		//const finalHeight = baseSize.y * scale.y * this.iMesh.scale.y * material.uniforms.uSize.value;
		const finalWidth = 3;
		const finalHeight = 3;

		return new THREE.Vector3(finalWidth, finalHeight, 1)
	}

	/**
	 * Resets the instanced mesh
	 */
	resetIndexes() {
		this.iMeshTotalIndexes = 0;
	}

	/**
	 * Dispose
	 */
	dispose() {
		this.main.scene.remove(this.iMesh);
		(this.iMesh.material as THREE.Material).dispose();
		this.iMesh.geometry.dispose();
		this.instancedMeshService.removeInstancedMesh(this.assetName);
	}
}

/**
 * An Instanced Mesh, with an attached spritesheet
 */
class SpriteSheetInstancedMesh extends InstancedMesh {
	constructor(main: Main, assetName: string, instancedMeshService: InstancedMeshService, material: THREE.Material, assetCount: number = 100) {
		const geometry = new THREE.PlaneGeometry(1, 1);
		super(main, assetName, instancedMeshService, geometry, material, assetCount);

		// Add animationRow attribute
		const animationRowArray = new Float32Array(assetCount);
		geometry.setAttribute('animationRow', new THREE.InstancedBufferAttribute(animationRowArray, 1));

		// Add currentCellsInRow attribute
		const cellsInRowArray = new Float32Array(assetCount);
		geometry.setAttribute('cellsInRow', new THREE.InstancedBufferAttribute(cellsInRowArray, 1));

		// Add mirrorX attribute (0.0 = no mirror, 1.0 = mirror)
		const mirrorXArray = new Float32Array(assetCount);
		geometry.setAttribute('mirrorX', new THREE.InstancedBufferAttribute(mirrorXArray, 1));

		// Add animationSpeed
		const animationSpeedArray = new Float32Array(assetCount);
		geometry.setAttribute('animationSpeed', new THREE.InstancedBufferAttribute(animationSpeedArray, 1));

		// Add animationTimeOffset
		const animationTimeOffsetArray = new Float32Array(assetCount);
		geometry.setAttribute('animationTimeOffset', new THREE.InstancedBufferAttribute(animationTimeOffsetArray, 1));

		// Animate the uTime
		const sTick: TickService = this.main.s('Tick');
		sTick.registerCallback(new TickCallback(`spritesheet-${assetName}`, this.updateTime.bind(this)));

		return this;
	}

	/**
	 * Updates the uTime of a SpriteSheet
	 */
	updateTime(event: TickTimeProperties) {
		(this.iMesh.material as THREE.ShaderMaterial).uniforms.uTime.value = event.elapsedTime;
	}
}