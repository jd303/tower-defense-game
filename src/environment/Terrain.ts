import * as THREE from 'three';
import { TerrainTypes } from '../dataTypes/LevelInterfaces';
import { Main } from '../core/Main';
import { Interactable2, InteractableOrders } from '../game/InteractionService2';
import { LoaderService } from '../core/LoaderService';
import { Level } from '../levels/Level';

export class Terrain {
	/**
	 * Definitions
	 * */
	main: Main;
	cast: boolean = false;
	receive: boolean = true;
	terrainType: TerrainTypes;

	/**
	 * Three Objects
	 * */
	groupMain: THREE.Group;
	backgroundImageTexture: THREE.Texture;
	backgroundImageGeometry: THREE.PlaneGeometry;
	backgroundImageMaterial: THREE.Material;
	backgroundImageMesh: THREE.Mesh | null;

	/**
	 * Constructor
	 * */
	constructor(terrainOptions: { terrainType: TerrainTypes, backgroundImagePath?: string }, main: Main) {
		this.main = main;
		this.terrainType = terrainOptions.terrainType;
		this.groupMain = new THREE.Group();
		this.groupMain.name = "Terrain";

		if (terrainOptions.backgroundImagePath) {
			this.createBackgroundImage(terrainOptions.backgroundImagePath!);
		}

		this.createBackgroundPlane(terrainOptions.terrainType);
		this.setInteractive();

		return this;
	}

	/**
	 * Creates a background image, if the level has one
	 */
	async createBackgroundImage(backgroundImagePath: string) {
		const sLoader: LoaderService = this.main.s('Loader');
		this.backgroundImageTexture = await sLoader.loadTexture(backgroundImagePath);
		this.backgroundImageTexture.colorSpace = THREE.SRGBColorSpace;
		this.backgroundImageGeometry = new THREE.PlaneGeometry(Level.levelWidth, Level.levelWidth * 0.65);
		this.backgroundImageMaterial = new THREE.MeshBasicMaterial({ map: this.backgroundImageTexture });
		this.backgroundImageMesh = new THREE.Mesh(this.backgroundImageGeometry, this.backgroundImageMaterial);
		this.backgroundImageMesh.rotation.x = -Math.PI / 2;
		this.backgroundImageMesh.position.y = 0.01;

		this.groupMain.add(this.backgroundImageMesh);
	}

	/**
	 * Creates a background image, if the level has one
	 */
	async createBackgroundPlane(terrainType: TerrainTypes) {
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
	dispose() {
		this.main.scene.remove(this.groupMain);

		this.backgroundImageTexture?.dispose();
		this.backgroundImageGeometry?.dispose();
		this.backgroundImageMaterial?.dispose();
		this.backgroundImageMesh = null;
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
