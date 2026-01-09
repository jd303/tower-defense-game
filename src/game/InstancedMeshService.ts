import THREE from "three";
import { Main } from '../core/Main';
import { SpriteSheet } from "../game/SpriteService";
import { ShaderMaterialProperties } from "../environment/assets/Asset";

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
	 * Creates an instanced mesh for sprites
	 */
	createInstancedMesh(assetName: string, geometry: THREE.PlaneGeometry, material: THREE.ShaderMaterial, assetCount: number = 100) {
		if (this.instancedMeshes[assetName]) return console.error(`Cannot recreate ${assetName} Instanced Mesh`);

		const iMesh = new InstancedMesh(this.main, geometry, material, assetCount);
		this.instancedMeshes[assetName] = iMesh;

		return iMesh;
	}

	/**
	 * Creates an instanced mesh for sprites
	 */
	createSpriteSheetInstancedMesh(assetName: string, spriteSheet: SpriteSheet, materialProperties: ShaderMaterialProperties, assetCount: number = 100) {
		if (this.instancedMeshes[assetName]) return console.error(`Cannot recreate ${assetName} Instanced Mesh`);

		const vertexShader = spriteSheet.spriteService.vertexShader;
		const fragmentShader = spriteSheet.spriteService.fragmentShader;
		const material = new THREE.ShaderMaterial({
			...materialProperties,
			uniforms: {
				...materialProperties.uniforms,
				uMap: { value: spriteSheet.texture },
			},
			vertexShader,
			fragmentShader
		});

		const iMesh = new SpriteSheetInstancedMesh(this.main, material, assetCount);
		this.instancedMeshes[assetName] = iMesh;

		return iMesh;
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
			this.instancedMeshes[iMeshRecord].iMesh.instanceMatrix.needsUpdate = true;
			this.instancedMeshes[iMeshRecord].geometry.attributes.animationCol.needsUpdate = true;
		});
	}
}

/**
 * An Instanced Mesh
 */
export class InstancedMesh {
	main: Main;
	iMesh: THREE.InstancedMesh;
	iMeshTotalIndexes: number = 0;
	geometry: THREE.PlaneGeometry;

	constructor(main: Main, geometry: THREE.PlaneGeometry /* MIGHT HAVE TO RETHINK THIS GEOMETRY TYPE FOR OTHER INSTANCEDMESHES */, material: THREE.Material, assetCount: number = 100) {
		this.main = main;
		this.geometry = geometry;

		const mesh = new THREE.InstancedMesh(geometry, material, assetCount);
		this.iMesh = mesh;
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
		const box = new THREE.Box3().setFromObject(this.iMesh);
		const baseSize = new THREE.Vector3();
		box.getSize(baseSize);

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
		const finalWidth = baseSize.x * scale.x * this.iMesh.scale.x * material.uniforms.uSize.value;
		const finalHeight = baseSize.y * scale.y * this.iMesh.scale.y * material.uniforms.uSize.value;

		return new THREE.Vector3(finalWidth, finalHeight, 1)
	}
}

/**
 * An Instanced Mesh, with an attached spritesheet
 */
class SpriteSheetInstancedMesh extends InstancedMesh {
	constructor(main: Main, material: THREE.Material, assetCount: number = 100) {
		const geometry = new THREE.PlaneGeometry(1, 1);

		super(main, geometry, material, assetCount);
		geometry.setAttribute('animationCol', new THREE.InstancedBufferAttribute(new Float32Array(assetCount), 1));
		geometry.attributes.animationCol.needsUpdate = true;

		// Add animationRow attribute (0-indexed row number)
		const animationRowArray = new Float32Array(assetCount);
		geometry.setAttribute('animationRow', new THREE.InstancedBufferAttribute(animationRowArray, 1));

		// Add mirrorX attribute (0.0 = no mirror, 1.0 = mirror)
		const mirrorXArray = new Float32Array(assetCount);
		geometry.setAttribute('mirrorX', new THREE.InstancedBufferAttribute(mirrorXArray, 1));

		return this;
	}
}