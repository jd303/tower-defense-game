import THREE, { Matrix4, Texture, Vector3 } from "three";
import { Main } from "../core/Main";
import { TerrainTypes } from "../data/LevelInterfaces";

import AllProps from "./props/AllProps";
import { PathService } from "../game/PathService";

export class PropManager {
	/**
	 * Core Properties
	 * */
	main: Main;
	tileset: TerrainTypes;
	propGroups: PropGroup[] = [];

	tempTreeTexture: any;

	/**
	 * Constructor
	 * */
	constructor(tileset: TerrainTypes, main: Main) {
		this.tileset = tileset;
		this.main = main;
	}

	/**
	 * Register a prop to place and render
	 */
	registerProp(propName: string, args: { position: Vector3, scale?: Vector3, rotate?: Vector3 }) {
		if (!args.scale) args.scale = new Vector3(1, 1, 1);
		if (!args.rotate) args.rotate = new Vector3(0, 0, 0);

		const prop = this.findProp(this.tileset, propName);
		if (prop) {
			const propAssetPlacement: PropAssetPlacement = {
				x: args.position.x,
				y: args.position.y,
				z: args.position.z,
				scaleX: args.scale.x,
				scaleY: args.scale.y,
				scaleZ: args.scale.z,
				rotX: args.rotate.x,
				rotY: args.rotate.y,
				rotZ: args.rotate.z
			}

			const propGroup = this.preparePropGroup(prop);
			propGroup.propPlacements.push(propAssetPlacement);
		}
	}

	/**
	 * Register a zone to generate props in
	 */
	registerPropZone(propName: string, args: { zonePath: Vector3[], count: number, zoneStrategy: PropZoneStrategy, scaleRandom?: number, rotateRandom?: number }) {
		if (!args.scaleRandom) args.scaleRandom = 0;
		if (!args.rotateRandom) args.rotateRandom = 0;

		const points = [
			{ x: -19.84615384615385, y: 6.8441556963370904e-15, z: -30.823337043689378 },
			{ x: -21.815384615384612, y: 5.316442371261847e-15, z: -23.943127882151572 },
			{ x: -6.738461538461536, y: 1.8763440423926226e-14, z: -20.503023301382655 },
			{ x: 5.815384615384609, y: 3.2998607821625255e-15, z: -14.861251788921663 },
			{ x: 23.66153846153846, y: 1.7721474570872824e-15, z: -7.981042627383857 },
			{ x: 32.76923076923077, y: -1.527713325075262e-16, z: 0.6880209161537891 },
			{ x: 36.03076923076924, y: -2.536004119624901e-15, z: 11.421147208152746 },
			{ x: 43.29230769230769, y: -4.1659278252747664e-15, z: 18.76167100155982 },
			{ x: 46.861538461538466, y: 1.2559047120313733e-15, z: -5.656091993117343 },
			{ x: 46, y: -7.931331155045169e-15, z: -28.280459965586573 },
			{ x: 39.29230769230769, y: 2.338575901792219e-14, z: -41.32009559889059 },
			{ x: 31.415384615384617, y: 1.2438460866775026e-14, z: -56.0178477246705 },
			{ x: 26.676923076923075, y: -2.388159237871287e-15, z: -53.244686946221464 },
			{ x: 21.076923076923077, y: 9.575151805858994e-15, z: -43.122650104882496 },
			{ x: 12.338461538461534, y: 8.046283903728754e-15, z: -36.23724119055004 },
			{ x: -1.4461538461538452, y: 8.107705918261034e-15, z: -36.51386135230996 },
			{ x: -7.415384615384617, y: -6.133859804207103e-15, z: -36.37555127143003 },
			{ x: -17.200000000000003, y: 7.199032143013888e-15, z: -32.42155847670557 }
		];

		const sPath: PathService = this.main.s('Path');
		//const segmentArray = sPath.createPathFromPoints(points);

		//console.log(segmentArray);
		console.log(propName);
		console.log(args.zonePath);
	}

	/**
	 * Register a zone to generate props in
	 */
	// OLD BACKUP
	/*registerPropZone(propName: string, args: { zonePath: Vector3[], count: number, zoneStrategy: PropZoneStrategy, scaleRandom?: number, rotateRandom?: number }) {
		if (!args.scaleRandom) args.scaleRandom = 0;
		if (!args.rotateRandom) args.rotateRandom = 0;

		const path: PathSegment[] = [
			{
				type: PathTypes.straight,
				points: [
					new Vector3(-19.84615384615385, 6.8441556963370904e-15, -30.823337043689378),
					new Vector3(-21.815384615384612, 5.316442371261847e-15, -23.943127882151572),
					new Vector3(-6.738461538461536, 1.8763440423926226e-14, -20.503023301382655),
					new Vector3(5.815384615384609, 3.2998607821625255e-15, -14.861251788921663),
					new Vector3(23.66153846153846, 1.7721474570872824e-15, -7.981042627383857),
					new Vector3(32.76923076923077, -1.527713325075262e-16, 0.6880209161537891),
					new Vector3(36.03076923076924, -2.536004119624901e-15, 11.421147208152746),
					new Vector3(43.29230769230769, -4.1659278252747664e-15, 18.76167100155982),
					new Vector3(46.861538461538466, 1.2559047120313733e-15, -5.656091993117343),
					new Vector3(46, -7.931331155045169e-15, -28.280459965586573),
					new Vector3(39.29230769230769, 2.338575901792219e-14, -41.32009559889059),
					new Vector3(31.415384615384617, 1.2438460866775026e-14, -56.0178477246705),
					new Vector3(26.676923076923075, -2.388159237871287e-15, -53.244686946221464),
					new Vector3(21.076923076923077, 9.575151805858994e-15, -43.122650104882496),
					new Vector3(12.338461538461534, 8.046283903728754e-15, -36.23724119055004),
					new Vector3(-1.4461538461538452, 8.107705918261034e-15, -36.51386135230996),
					new Vector3(-7.415384615384617, -6.133859804207103e-15, -36.37555127143003),
					new Vector3(-17.200000000000003, 7.199032143013888e-15, -32.42155847670557)
				],
			}
		];

		const zonePath = (this.main.s('Path') as PathService).createPathFromSegments(path);
		console.log("PATH", zonePath);

		console.log(propName);
		console.log(args.zonePath);
	}*/

	/**
	 * Finds a prop from prop definitions
	 */
	findProp(tileset: TerrainTypes, name: string): PropAsset | null {
		const prop = AllProps.find(prop => prop.tileset == tileset && prop.name == name);
		return prop || null;
	}

	/**
	 * Used to create a prop group for each unique prop
	 */
	preparePropGroup(prop: PropAsset): PropGroup {
		let thePropGroup = this.propGroups.find(propGroup => propGroup.asset == prop);
		if (!thePropGroup) {
			thePropGroup = {
				asset: prop,
				propPlacements: []
			}

			this.propGroups.push(thePropGroup);
		}

		return thePropGroup;
	}

	/**
	 * Renders prop groups
	 * */
	render() {
		this.propGroups.forEach(async (propGroup) => {
			const texture = await this.loadPropGroupTexture(propGroup);
			const model = await this.main.s('Loader').loadModel(propGroup.asset.assetPath);
			propGroup.loadedMaterial = this.setPropTexture(texture);
			propGroup.loadedModel = model;
			this.instanceMeshesAndPlace(propGroup);
		});
	}

	async loadPropGroupTexture(propGroup: PropGroup) {
		const textureResult = await this.main.s('Loader').loadTexture(propGroup.asset.texturePath);
		return textureResult;
	}

	/**
	 * Instance the Mesh and Place
	 * Assumes only 1 mesh in the Prop Model
	 */
	instanceMeshesAndPlace(propGroup: PropGroup) {
		const iMesh = new THREE.InstancedMesh(propGroup.loadedModel.scene.children[0].geometry, propGroup.loadedMaterial, propGroup.propPlacements.length);

		for (let x = 0; x < propGroup.propPlacements.length; x++) {
			const matrix_random = new THREE.Matrix4();
			const position = new THREE.Vector3()
			const quaternion = new THREE.Quaternion();
			const scale = new THREE.Vector3();

			const placement = propGroup.propPlacements[x];
			position.x = placement.x;
			position.y = placement.y;
			position.z = placement.z;

			const rotation = new THREE.Euler(placement.rotX, placement.rotY, placement.rotZ);
			quaternion.setFromEuler(rotation);

			const defaultScale = propGroup.asset.defaultScale || new Vector3(1, 1, 1);
			scale.x = defaultScale.x * placement.scaleX;
			scale.y = defaultScale.y * placement.scaleY;
			scale.z = defaultScale.z * placement.scaleZ;

			matrix_random.compose(position, quaternion, scale);

			iMesh.setMatrixAt(x, matrix_random);
		}

		iMesh.castShadow = true;
		iMesh.receiveShadow = true;
		propGroup.loadedMaterial.needsUpdate = true;
		this.main.scene.add(iMesh);

		// TEST: Can we animate individual items?
		/*setInterval(() => {
			let matrix = new Matrix4();
			let position = new Vector3();
			iMesh.getMatrixAt(0, matrix);
			position = position.setFromMatrixPosition(matrix);
			matrix.setPosition(position.x - 0.01, position.y, position.z);
			iMesh.setMatrixAt(0, matrix);

			iMesh.instanceMatrix.needsUpdate = true;
		}, 100);*/
	}

	/**
	 * Creates a texture for the model.
	 * This method may need significant upgrades in the future for each prop type
	 */
	setPropTexture(texture: Texture) {
		const material = new THREE.MeshStandardMaterial({ map: texture });
		material.side = THREE.DoubleSide; // || THREE.FrontSide || THREE.BackSide*/
		material.metalness = 0.25;
		material.roughness = 1;

		return material;
	}
}

interface PropGroup {
	asset: PropAsset;
	propPlacements: PropAssetPlacement[];
	loadedModel?: any;
	loadedMaterial?: any;
}

export interface PropAsset {
	tileset: TerrainTypes;
	name: string;
	assetPath: string;
	texturePath: string;
	defaultScale?: Vector3;
}

export interface PropAssetPlacement {
	x: number;
	y: number;
	z: number;
	scaleX: number;
	scaleY: number;
	scaleZ: number;
	rotX: number;
	rotY: number;
	rotZ: number;
}

export enum PropZoneStrategy {
	default = 0,
	centerOut = 1,
	topToBottom = 2,
	bottomToTop = 3,
	leftToRight = 4,
	rightToLeft = 5
}