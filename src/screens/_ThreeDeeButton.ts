import THREE from "three";
import { Main } from "../core/Main";
import { LoaderService } from "../core/LoaderService";

export class ThreeDeeButton {
	static FrameGeometry = () => new THREE.BoxGeometry(20, 20);
	static FrameMaterial = () => new THREE.MeshStandardMaterial({ color: 0x84643D });
	static IconGeometry = () => new THREE.PlaneGeometry(18, 18);
	static IconMaterial = (texture: THREE.Texture) => new THREE.MeshBasicMaterial({ map: texture, transparent: true });

	main: Main;
	assetName: string;
	iconTexturePath: string;
	groupMain: THREE.Group;
	frameGeometry: THREE.BoxGeometry;
	frameMaterial: THREE.Material;
	frameMesh: THREE.Mesh;
	iconGeometry: THREE.PlaneGeometry;
	iconMaterial: THREE.Material;
	iconMesh: THREE.Mesh;
	starGeometry: THREE.BoxGeometry;
	starMaterial: THREE.Material;
	starMesh: THREE.Mesh;

	constructor(main: Main, assetName: string, iconTexturePath: string) {
		this.main = main;
		this.assetName = assetName;
		this.iconTexturePath = iconTexturePath;
		this.groupMain = new THREE.Group();
		this.groupMain.name = `threeDeeButton-${assetName}`;

		this.frameGeometry = ThreeDeeButton.FrameGeometry();
		this.frameMaterial = ThreeDeeButton.FrameMaterial();
		this.frameMesh = new THREE.Mesh(this.frameGeometry, this.frameMaterial);
		this.groupMain.add(this.frameMesh);

		this.createHeroPlane();
		this.createEquippedStar();

		return this;
	}

	/**
	 * Loads the hero texture and adds to the group
	 */
	async createHeroPlane() {
		const sLoader: LoaderService = this.main.s('Loader');
		const texture = await sLoader.loadTexture(this.iconTexturePath);

		this.iconGeometry = ThreeDeeButton.IconGeometry();
		this.iconMaterial = ThreeDeeButton.IconMaterial(texture);
		this.iconMesh = new THREE.Mesh(this.iconGeometry, this.iconMaterial);
		this.iconMesh.position.z = 1;
		this.groupMain.add(this.iconMesh);
	}

	/**
	 * Creates an 'equipped' star
	 */
	createEquippedStar() {
		this.starGeometry = new THREE.BoxGeometry(2, 2);
		this.starMaterial = new THREE.MeshBasicMaterial({ color: 0xE8DC71 });
		this.starMesh = new THREE.Mesh(this.starGeometry, this.starMaterial);
		this.starMesh.position.set(8, 8, 1);
		this.groupMain.add(this.starMesh);

		this.starMesh.visible = false;
	}

	/**
	 * Sets whether a hero is equipped
	 */
	setEquipped(isEquipped: boolean) {
		this.starMesh.visible = isEquipped;
	}

	/**
	 * Deletes self
	 */
	dispose() {
		this.main.scene.remove(this.groupMain);
		this.frameGeometry.dispose();
		this.frameMaterial.dispose();
		this.iconGeometry.dispose();
		this.iconMaterial.dispose();
		this.starGeometry.dispose();
		this.starMaterial.dispose();
	}
}