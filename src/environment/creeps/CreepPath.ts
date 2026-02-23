import * as THREE from 'three';
import { Interactable2, InteractableOrders, InteractionService2 } from '../../game/InteractionService2';
import { Main } from '../../core/Main';
import { MovePathDefinition, PathDefinition, PathGeometryTypes, PathPoint } from '../../dataTypes/PathInterfaces';
import { PathService } from '../../game/PathService';
import { Level } from '../../levels/Level';
import { CreepPathPropCurveArguments } from '../propManager/PropCurve';
import { VertexDisplacementFragmentShader, VertexDisplacementVertexShader } from '../../shaders/shader.vertex-displacement';
import { BasicFragmentShader } from '../../shaders/shader.basic';

export class CreepPath {
	/**
	 * Core
	 * */
	main: Main;
	level: Level;

	/**
	 * Setup Properties
	 * */
	static pathWidth: number = 9;
	static pathHeight: number = 0.1;
	static pathEdgeHeight: number = 1;
	static edgePathMultiplier: number = 1.1;
	variantDistance: number = 5;

	/**
	 * Wave Properties
	 * */
	id: string;
	corePath: MovePathDefinition = {
		id: 'core',
		active: true,
		pathPoints: [],
		pathLength: 0,
		path: new THREE.CurvePath(),
		pathProgress: 0,
		pathTravelPercentagePerSec: 0,
	};
	topEdgePathPoints: PathPoint[];
	bottomEdgePathPoints: PathPoint[];
	variantPaths: MovePathDefinition[] = [];
	groupMain: THREE.Group; // Contains a pathMesh's groupmain, if created

	/**
	 * Debugs
	 */
	debugLines: THREE.Line[] = [];

	/**
	 * Constructor
	 * */
	constructor(pathDefinition: CreepPathDefinition, level: Level, main: Main) {
		this.id = pathDefinition.id;
		this.level = level;
		this.main = main;
		this.setCorePath(pathDefinition.pathPoints);
		this.createPathGeometry(pathDefinition);
		this.createPathGeometryEdges(pathDefinition);
		this.createEdgePaths();
		this.testOnlyCreateEdgings();

		this.setInteractive();

		return this;
	}

	/**
	 * Sets the core path
	 * */
	setCorePath(pathPoints: PathPoint[]) {
		const sPath: PathService = this.main.s('Path');
		this.corePath.pathPoints = pathPoints;
		this.corePath.path = sPath.createCurveFromPathPoints(pathPoints);
		this.corePath.pathLength = this.corePath.path.getLength();
	}

	/**
	 * Creates a variant path for uniqueness
	 * */
	createVariantPath(adjust?: { x: number, z: number }): MovePathDefinition {
		const sPath = this.main.s('Path');

		const variantPath = sPath.createMovePath(this.corePath.id, this.corePath.pathPoints, adjust && adjust.x || this.getRandomAdjustX(), adjust && adjust.z || this.getRandomAdjustZ());
		this.variantPaths.push(variantPath);
		return variantPath;
	}

	/**
	 * Creates a extruded path shape on the map
	 * */
	createPathGeometry(pathDefinition: PathDefinition) {
		if (pathDefinition.pathGeometry == PathGeometryTypes.none) return;

		const lineWidth = CreepPath.pathWidth;
		const lineHeight = CreepPath.pathHeight;

		// Create the path shape
		const shape = new THREE.Shape();
		shape.moveTo(lineHeight, -lineWidth / 2);
		shape.lineTo(lineHeight, lineWidth / 2);
		shape.lineTo(0, lineWidth / 2);
		shape.lineTo(0, -lineWidth / 2);
		shape.lineTo(lineHeight, -lineWidth / 2);

		// Extrude Settings
		const extrudeSettings = {
			steps: 1000,
			extrudePath: this.corePath.path,
			bevelEnabled: false,

			//depth: 1,
			//bevelThickness: 1,
			//bevelSize: 0.75, // 0.2
			//bevelOffset: -0.33,
			//bevelSegments: 2,
			//curveSegments: 2,
		};

		// Create the material
		let pathMaterial;
		switch (pathDefinition.pathGeometry) {
			case PathGeometryTypes.dirt:
				pathMaterial = new THREE.ShaderMaterial({
					vertexShader: VertexDisplacementVertexShader,
					fragmentShader: VertexDisplacementFragmentShader,
					uniforms: {
						uTopColour: { value: new THREE.Vector3(0.76, 0.70, 0.50) },
						uEdgeColour: { value: new THREE.Vector3(0.5, 0.45, 0.25) },
					}
				});
				break;
			case PathGeometryTypes.rock:
				pathMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
				break;
		}

		// Create the geometry and mesh and attach
		const pathGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings as any);
		const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
		pathMesh.position.y = 0.1;
		pathMesh.name = 'creepPath';

		// Create group
		this.groupMain = new THREE.Group();
		this.groupMain.name = 'CreepPath';
		this.groupMain.add(pathMesh);

		// Add shadows
		this.groupMain.children.forEach((child: any) => {
			if (child.isMesh) {
				child.castShadow = false;
				child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}


	/**
	 * Creates an extruded edging along the paths
	 * */
	createPathGeometryEdges(pathDefinition: PathDefinition) {
		const lineWidth = CreepPath.pathWidth + 0.5;
		const lineHeight = CreepPath.pathEdgeHeight;
		const rimWidth = 0.3;
		const ditchHeight = 0.5;

		// Create the path shape
		const shape = new THREE.Shape();
		shape.moveTo(-lineHeight, -lineWidth / 2);
		shape.lineTo(-lineHeight, -lineWidth / 2 + rimWidth);
		shape.lineTo(-lineHeight + ditchHeight, -lineWidth / 2 + rimWidth);
		shape.lineTo(-lineHeight + ditchHeight, lineWidth / 2 - rimWidth);
		shape.lineTo(-lineHeight, lineWidth / 2 - rimWidth);
		shape.lineTo(-lineHeight, lineWidth / 2);
		shape.lineTo(0, lineWidth / 2);
		shape.lineTo(0, -lineWidth / 2);
		shape.lineTo(-lineHeight, -lineWidth / 2);

		// Extrude Settings
		const extrudeSettings = {
			steps: 250,
			extrudePath: this.corePath.path,
			bevelEnabled: false,

			//depth: 1,
			//bevelThickness: 1,
			//bevelSize: 0.75, // 0.2
			//bevelOffset: -0.33,
			//bevelSegments: 2,
			//curveSegments: 2,
		};

		// Create the material
		let pathMaterial;
		switch (pathDefinition!.pathGeometry) {
			case PathGeometryTypes.dirt:
				pathMaterial = new THREE.ShaderMaterial({
					vertexShader: VertexDisplacementVertexShader,
					fragmentShader: BasicFragmentShader,
					uniforms: {
						uColour: { value: new THREE.Vector3(0.5, 0.45, 0.25) }
					}
				});
				break;
			case PathGeometryTypes.rock:
				pathMaterial = new THREE.MeshStandardMaterial({ color: 0x684520 });
				break;
		}

		// Create the geometry and mesh and attach
		const pathGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings as any);
		const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
		pathMesh.position.y = -ditchHeight;
		pathMesh.name = 'creepPath';

		// Create group
		this.groupMain.add(pathMesh);

		// Add shadows
		this.groupMain.children.forEach((child: any) => {
			if (child.isMesh) {
				child.castShadow = false;
				child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}

	/**
	 * Creates paths at the edges
	 */
	createEdgePaths() {
		const samplingRate = 125;
		const sPath: PathService = this.main.s('Path');
		const corePathPoints = this.corePath.path.getSpacedPoints(samplingRate);
		const corePathFrenetFrames = this.corePath.path.computeFrenetFrames(samplingRate, false);
		const distance = CreepPath.pathWidth * CreepPath.edgePathMultiplier / 2;

		// Top path
		this.topEdgePathPoints = corePathPoints.map((point: THREE.Vector, index: number) => {
			const x = (point as THREE.Vector3).x + corePathFrenetFrames.binormals[index].x * distance;
			const y = (point as THREE.Vector3).y + corePathFrenetFrames.binormals[index].y * distance;
			const z = (point as THREE.Vector3).z + corePathFrenetFrames.binormals[index].z * distance;
			return { point: new THREE.Vector3(x, y, z) };
		});

		// Bottom path
		this.bottomEdgePathPoints = corePathPoints.map((point: THREE.Vector, index: number) => {
			const x = (point as THREE.Vector3).x + corePathFrenetFrames.binormals[index].x * -distance;
			const y = (point as THREE.Vector3).y + corePathFrenetFrames.binormals[index].y * -distance;
			const z = (point as THREE.Vector3).z + corePathFrenetFrames.binormals[index].z * -distance;
			return { point: new THREE.Vector3(x, y, z) };
		});

		if (this.main.debugMode) {
			const topEdgePath = sPath.createCurveFromPathPoints(this.topEdgePathPoints, 0, 0, false);
			const bottomEdgePath = sPath.createCurveFromPathPoints(this.bottomEdgePathPoints, 0, 0, false);
			const topPathDebugLine = sPath.debugCreateOutlines(topEdgePath, 0xff0000);
			const bottomPathDebugLine = sPath.debugCreateOutlines(bottomEdgePath, 0xff0000);
			this.debugLines.push(topPathDebugLine);
			this.debugLines.push(bottomPathDebugLine);
			this.main.scene.add(topPathDebugLine);
			this.main.scene.add(bottomPathDebugLine);
		}
	}

	testOnlyCreateEdgings() {
		/*const spriteManager = this.level.propManager;
		spriteManager.registerProp({
			assetName: "DirtEdge",
			position: new THREE.Vector3(-80, 0, 0),
			scale: new THREE.Vector3(1, 1, 1),
		}, this.level.levelDetails);*/
	}

	/**
	 * Sets whether this model can be interactive 
	 * */
	setInteractive() {
		const sInteraction2: InteractionService2 = this.main.s('Interaction2');
		sInteraction2.registerInteractable(new Interactable2('creepPath', InteractableOrders.creeps, this));
	}

	getRandomAdjustX() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}

	getRandomAdjustZ() {
		return Math.random() * this.variantDistance - this.variantDistance / 2;
	}

	/**
	 * Removes creep paths from the level
	 */
	dispose() {
		this.main.scene.remove(this.groupMain);
		this.debugLines.forEach(line => this.main.scene.remove(line));
	}
}

export interface CreepPathDefinition {
	id: string;
	pathGeometry: PathGeometryTypes;
	pathPoints: PathPoint[],
	propCurve?: CreepPathPropCurveArguments;
}