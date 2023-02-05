import * as THREE from 'three';
import { TerrainTypes } from '../data/LevelInterfaces';

export class Terrain {
	/**
	 * Definitions
	 * */
	cast: boolean = false;
	receive: boolean = true;

	/**
	 * Three Objects
	 * */
	groupMain: THREE.Group;

	/**
	 * Constructor
	 * */
	constructor(terrainType: TerrainTypes) {
		this.groupMain = new THREE.Group();

		// Determin the terrain type
		let material;
		switch (terrainType) {
			case TerrainTypes.grass:
				material = new THREE.MeshStandardMaterial({ color: '#508100' });
				break;
			case TerrainTypes.sand:
				material = new THREE.MeshStandardMaterial({ color: '#EDCA52' });
				break;
		}

		const geometry = new THREE.PlaneGeometry(350, 260, 1, 1);
		const mesh = new THREE.Mesh(geometry, material);
		this.groupMain.add(mesh);

		mesh.rotation.x = -Math.PI * 0.5;

		return this;
	}

	/**
	 * Enables shadows for terrain
	 * */
	enableShadows() {
		this.groupMain.children.forEach((child: any) => {
			if (child.isMesh) {
				if (this.cast) child.castShadow = true;
				if (this.receive) child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}
}
