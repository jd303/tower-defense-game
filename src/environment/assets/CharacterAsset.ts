import THREE from "three";
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { InteractableOrders } from '../../game/InteractionService2';
import { SpriteAsset, SpriteSheetRow } from "./SpriteAsset";

export abstract class CharacterAsset extends SpriteAsset {
	/**
	 * Setup Properties
	 * */
	interactiveOrder: InteractableOrders;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetType: string, assetPositionY: number, spriteSheetRows: SpriteSheetRow[], spriteSheetCellColCount: number, instancedMeshAssetScale: number, instancedMeshInstanceCount: number) {
		super(main, assetName, assetType, assetPositionY, spriteSheetRows, spriteSheetCellColCount, instancedMeshAssetScale, instancedMeshInstanceCount);

		this.registerOnLoadCallback(this.createSelectionGeometry.bind(this));
	}

	/**
	 * Creates invisible geometry for selection
	 */
	createSelectionGeometry() {
		const size = this.instancedMesh.getSizeOfInstance(this.instancedMeshIndex);
		const geometry = new THREE.BoxGeometry(size.x * 0.9, size.y * 0.9, size.z);
		const material = new THREE.MeshBasicMaterial();
		material.visible = false
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = this.instancedMeshPosition.position.y;
		this.groupMain.add(mesh);
	}

	/**
	 * Animates a Character to show it is attacking
	 * */
	animationAttack(timeProperties: TickTimeProperties) {
		//console.log("NO Attack animation yet")
	}

	/**
	 * Animates to show that a Character is hurt
	 * */
	animationHurtMe(timeProperties: TickTimeProperties) {
		//console.log("NO Hurt animation yet")
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
}
