import * as THREE from 'three';
import { TerrainTypes } from '../data/LevelInterfaces';
import { Main } from '../core/Main';
import { Interactable2, InteractableOrders } from '../game/InteractionService2';

export class Terrain {
	/**
	 * Definitions
	 * */
	main: Main;
	cast: boolean = false;
	receive: boolean = true;

	/**
	 * Three Objects
	 * */
	groupMain: THREE.Group;

	/**
	 * Constructor
	 * */
	constructor(terrainType: TerrainTypes, main: Main) {
		this.main = main;
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

		//const geometry = new THREE.PlaneGeometry(350, 260, 1, 1);
		const geometry = new THREE.PlaneGeometry(700, 520, 1, 1);
		const mesh = new THREE.Mesh(geometry, material);
		this.groupMain.add(mesh);

		mesh.rotation.x = -Math.PI * 0.5;

		this.setInteractive();

		return this;
	}

	/**
	 * Adds the terrain to the scene
	 */
	addToScene() {
		this.main.scene.add(this.groupMain);
	}

	/**
	 * Removes from the scene and removes the terrain item
	 */
	removeFromScene() {
		this.main.scene.remove(this.groupMain);
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

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive() {
		const sInteraction2 = this.main.s('Interaction2');
		sInteraction2.registerInteractable(new Interactable2('terrain', InteractableOrders.terrain, this));
	}
}
