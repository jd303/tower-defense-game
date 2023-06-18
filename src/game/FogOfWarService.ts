import * as THREE from 'three';
import { Main } from '../core/Main';

export class FogOfWarService {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Debugs
	 * */
	debugRed: boolean = false;
	debugShrinkGeometry: boolean = false;

	/**
	 * Assets
	 * */
	matrix: number[];
	texture: any;
	material: THREE.MeshBasicMaterial;
	geometry: THREE.BufferGeometry;
	fogOfWarMesh: THREE.Mesh;

	/**
	 * Standards
	 * */
	geometrySize: number = 350;
	matrixSize: number = 100;
	matrixMarginX: number = 40;
	matrixMarginY: number = 20;
	matrixFeather: number = 3;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Creates a new fog of war
	 * */
	createFogOfWar() {
		this.createMatrix();
		this.createMatrixFromTemplate(this.standardComplexMatrixTemplate, 4);
		this.createMaterial();
		this.createGeometry();
		this.createMesh();
		this.addToScene();
	}

	/**
	 * Creates a Fog of War Matrix
	 * */
	createMatrix(matrixWidth: number = this.matrixSize, matrixHeight: number = this.matrixSize) {
		this.matrix = Array.from({ length: matrixWidth * matrixHeight }, (arg, index) => this.matrixStyleStandard(index, matrixWidth, matrixHeight)) as number[];
	}

	/**
	 * Randomisation function for creating a standard fog of war
	 * */
	private matrixStyleStandard(index: number, matrixWidth: number, matrixHeight: number): number {
		const row = Math.floor(index / matrixWidth);
		const column = index % matrixWidth;

		const featheredMargin = row < this.matrixMarginY + this.matrixFeather || row > matrixHeight - this.matrixMarginY - this.matrixFeather || column < this.matrixMarginX + this.matrixFeather || column > matrixWidth - this.matrixMarginX - this.matrixFeather;
		const onMargin = row == this.matrixMarginY || row == matrixHeight - this.matrixMarginY || column == this.matrixMarginX || column == matrixWidth - this.matrixMarginX;
		const withinMargin = row < this.matrixMarginY || row > matrixHeight - this.matrixMarginY || column < this.matrixMarginX || column > matrixWidth - this.matrixMarginX;

		if (withinMargin) return 1;
		else if (onMargin) return Math.min(1, Math.random() + 0.25);
		else if (featheredMargin) return Math.random() / 4 + 0.25;
		else return 0;
	}

	/**
	 * Creates a matrix from a template
	 * */
	createMatrixFromTemplate(template: matrixDefinition, blurTimes: number, finalWidth: number = this.matrixSize, finalHeight: number = this.matrixSize) {
		let activeTemplate = [...template.template];
		let activeTemplateWidth = template.width;
		let activeTemplateHeight = activeTemplate.length / activeTemplateWidth;

		const widthSteps = Math.round((finalWidth - activeTemplateWidth) / blurTimes);
		const heightSteps = Math.round((finalHeight - activeTemplateHeight) / blurTimes);

		for (let x = 0; x < blurTimes; x++) {
			activeTemplate = this.blurMatrix(activeTemplate, activeTemplateWidth, Math.round(activeTemplateWidth + widthSteps), Math.round(activeTemplateHeight + heightSteps));
			activeTemplateWidth = Math.round(activeTemplateWidth + widthSteps);
			activeTemplateHeight = Math.round(activeTemplateHeight + heightSteps);
		}
		
		this.matrix = activeTemplate;
	}

	/**
	 * Blurs a matrix and adds detail
	 * */
	blurMatrix(template: number[], templateWidth: number, expectedWidth: number, expectedHeight: number) {
		// Transform the matrix into the given width and height
		const templateHeight = template.length / templateWidth;
		const widthMultiplication = expectedWidth / templateWidth;
		const heightMultiplication = expectedHeight / templateHeight;

		return Array.from({ length: expectedWidth * expectedHeight }, (nill, index) => {
			const matrixRow = Math.floor(index / expectedWidth);
			const matrixColumn = index % expectedWidth;
			const templateRow = Math.round(matrixRow / heightMultiplication);
			const templateColumn = Math.round(matrixColumn / widthMultiplication);

			// Get the original values
			const templateIndex = templateColumn + (templateRow * templateWidth);
			const templateItem = template[templateIndex];

			// Get surrounding, so that we can blur
			const templateRowAbove = Math.max(0, templateRow - 1);
			const templateRowBelow = Math.min(templateHeight, templateRow + 1);
			const templateColLeft = Math.max(0, templateColumn - 1);
			const templateColRight = Math.min(templateWidth, templateColumn + 1);
			let itemAbove = template[templateColumn + (templateRowAbove * templateWidth)];
			let itemBelow = template[templateColumn + (templateRowBelow * templateWidth)];
			let itemLeft = template[templateColLeft + (templateRow * templateWidth)];
			let itemRight = template[templateColRight + (templateRow * templateWidth)];

			if (itemAbove === undefined) itemAbove = 1;
			if (itemBelow === undefined) itemBelow = 1;
			if (itemLeft === undefined) itemLeft = 1;
			if (itemRight === undefined) itemRight = 1;

			if (templateRow == 0 || templateRow == expectedHeight || templateColumn == 0 || templateColumn == expectedWidth) return 1;
			else if (templateItem == 0) {
				var calculatedBlur = (itemAbove + itemBelow + itemLeft + itemRight) / 8;
				//console.log(calculatedBlur, itemAbove, itemBelow, itemLeft, itemRight);
				return calculatedBlur;
			}
			else return (itemAbove + itemBelow + itemLeft + itemRight) / 4
		}) as number[];
	}

	/**
	 * Creates a Texture
	 * */
	createMaterial(matrixWidth: number = this.matrixSize, matrixHeight: number = this.matrixSize) {
		const size = matrixWidth * matrixHeight;
		const data = new Uint8Array( 4 * size );

		for (let y = 0; y < matrixHeight; y++) {
			for (let x = 0; x < matrixWidth; x++) {
				const matrixIndex = x + (y * matrixWidth);
				const matrixItem = this.matrix[matrixIndex];

				const stride = matrixIndex * 4;
				const alpha = matrixItem * 255;

				data[ stride ] = alpha;
				data[ stride + 1 ] = alpha;
				data[ stride + 2 ] = alpha;
				data[ stride + 3 ] = alpha;
			}
		}

		// Create a Data Texture
		const texture = new THREE.DataTexture( data, matrixWidth, matrixHeight);
		texture.flipY = true;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.generateMipmaps = false; // it's likely that our texture will not have "power of two" size, meaning that mipmaps are not going to be supported on WebGL 1.0, so let's turn them off

		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;
		texture.needsUpdate = true;

		this.texture = texture;

		if (this.debugRed) {
			this.material = new THREE.MeshBasicMaterial( {color: 0xFF0000, alphaMap:this.texture, transparent: false } );
		} else {
			this.material = new THREE.MeshBasicMaterial( {color: 0x000000, alphaMap:this.texture, transparent: true } );
		}
	}

	/**
	 * Creates THREE Geometry
	 * */
	createGeometry(width: number = this.geometrySize, height: number = this.geometrySize) {
		if (this.debugShrinkGeometry) {
			width = 100;
			height = 80;
		}

		this.geometry = new THREE.PlaneGeometry(width, height, 1, 1);
	}

	/**
	 * Creates THREE Mesh
	 * */
	createMesh() {
		this.fogOfWarMesh = new THREE.Mesh( this.geometry, this.material ); 
		this.fogOfWarMesh.position.y = 3;
		this.fogOfWarMesh.rotation.set(Math.PI * -0.5, 0, 0);
	}

	/**
	 * Adds the Fog of War to the scene
	 * */
	addToScene() {
		this.main.scene.add(this.fogOfWarMesh);
	}

	/**
	 * Create various templates for matrix
	 * */
	debugMatrixTemplate: matrixDefinition = {
		template: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.25, 0.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0.25, 0.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0.25, 1, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0.4, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		],
		width: 25
	}
	standardComplexMatrixTemplate: matrixDefinition = {
		template: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		],
		width: 24
	}
	standardMatrixTemplate: matrixDefinition = {
		template: [
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		],
		width: 10
	}
}

interface matrixDefinition {
	template: number[];
	width: number;
}


/*
const exampleMatrix = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]
*/