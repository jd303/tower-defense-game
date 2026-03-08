import THREE from "three";
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Asset } from "./Asset";

export abstract class ModelAsset extends Asset {
	/**
	 * Model Asset Properties
	 */
	groupTransforms: THREE.Group; // Middle group - applies minor transformations
	groupModel: THREE.Group; // Innermost group - applies status transforms
	shadowsEnabled: boolean = false;
	geometry: THREE.ShapeGeometry;
	material: THREE.Material;
	mesh: THREE.Mesh;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetType: string) {
		super(main, assetName, assetType);

		this.groupTransforms = new THREE.Group();
		this.groupTransforms.name = `transforms-${assetName}`;
		this.groupModel = new THREE.Group();
		this.groupModel.name = `model-${assetName}`;

		this.groupTransforms.add(this.groupModel);
		this.groupMain.add(this.groupTransforms);
	}

	/**
	 * Loads the model
	 * */
	async loadModel(callback?: Function) {
		const model = await this.main.s('Loader').loadModel(ModelAsset.assetPath);
		this.groupModel.scale.set(ModelAsset.assetScale, ModelAsset.assetScale, ModelAsset.assetScale);
		this.groupModel.position.y = ModelAsset.assetPositionY;
		this.groupModel.add(...model.scene.children);
		this.enableShadows();
		this.addSelectionGeometry();

		if (callback) callback();
	}

	/**
	 * Add mesh manually
	 * */
	createMesh(geometry: THREE.BufferGeometry, material: THREE.Material) {
		this.mesh = new THREE.Mesh(geometry, material);
		this.groupModel.scale.set(ModelAsset.assetScale, ModelAsset.assetScale, ModelAsset.assetScale);
		this.groupModel.add(this.mesh);
		this.mesh.name = this.assetName;
		this.enableShadows();
		this.addSelectionGeometry();
	}

	/**
	 * Enabled shadows on the model
	 * */
	enableShadows(cast: boolean = true, receive: boolean = false) {
		this.groupModel.children.forEach((child: any) => {
			if (child.isMesh && this.shadowsEnabled) {
				child.castShadow = cast;
				child.receiveShadow = receive;
				child.material.needsUpdate = true;
			}
		});
	}

	/**
	 * Sets the position of the asset
	 */
	setPosition(point: THREE.Vector3) {
		this.groupMain.position.set(point.x, point.y, point.z);
	}

	/**
	 * Jiggles a model to show it is attacking
	 * */
	animationAttack(timeProperties: TickTimeProperties) {
		// Jiggle animation
		const jiggleZ = Math.sin(timeProperties.elapsedTime * 50) / 20;
		this.groupTransforms.position.z = jiggleZ;
	}

	/**
	 * Shows that a Hero is hurt
	 * */
	animationHurtMe(timeProperties: TickTimeProperties) {
		this.groupModel.position.z = Math.sin(timeProperties.elapsedTime * 50) / 12;
	}

	/**
	 * Animates healing crosses
	 * */
	animationHealing() {
		const healingCrosses = this.groupMain.getObjectByName("HealingAnimation");
		if (healingCrosses) {
			healingCrosses.children.forEach((cross, index) => {
				cross.position.y += index * 0.005 + 0.001;
			});
		}
	}

	/**
	 * Actions to take when we delete the model asset (might also be handled more fully elsewhere)
	 */
	deleteModelAsset() {
		this.unsetInteractive();
	}

	/**
	 * Disposes of this asset, but keeps the spritesheet and instancedmesh
	 */
	dispose() {
		console.error("WE NEED TO DISPOSE HERE");
	}
}
