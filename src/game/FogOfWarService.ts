import * as THREE from 'three';
import { Main } from '../core/Main';

export class FogOfWarService {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Assets
	 * */
	geometry: THREE.BufferGeometry;
	material: THREE.MeshBasicMaterial;
	fogOfWarMesh: THREE.Mesh;

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
		const texture = this.createFogOfWarTexture();
		this.createFogOfWarGeometry(texture);
		this.main.scene.add(this.fogOfWarMesh);
	}

	/**
	 * Creates a fog of war
	 * */
	createFogOfWarTexture() {
		const mask = [
			1,1,0,1,1,1,1,1,
			1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,
			1,1,1,1,0,1,1,1,
			1,1,1,0,1,1,1,1,
			1,1,0,1,0,1,0,1,
			1,0,0,1,0,0,1,1,
			1,1,0,1,0,1,1,0
		];

		//create a typed array to hold texture data
		const data = new Uint8Array(mask.length);
		//copy mask into the typed array
		data.set(mask.map(v => v*255));
		//create the texture
		const texture = new THREE.DataTexture(data, 8, 8, THREE.LuminanceFormat, THREE.UnsignedByteType);

		texture.flipY = true;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.generateMipmaps = false; //it's likely that our texture will not have "power of two" size, meaning that mipmaps are not going to be supported on WebGL 1.0, so let's turn them off

		texture.needsUpdate = true;

		// Sharp filters
		//texture.magFilter = THREE.NearestFilter;
		//texture.minFilter = THREE.NearestFilter;

		// Soft filters
		//texture.magFilter = THREE.LinearFilter;
		//texture.minFilter = THREE.LinearFilter;

		return texture;
	}

	/**
	 * Create the geometry
	 * */
	createFogOfWarGeometry(texture: THREE.DataTexture) {
		console.log("TXT", texture);
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array( [
			-1.0, -1.0,  1.0, // v0
			1.0, -1.0,  1.0, // v1
			1.0,  1.0,  1.0, // v2
		
			1.0,  1.0,  1.0, // v3
			-1.0,  1.0,  1.0, // v4
			-1.0, -1.0,  1.0  // v5
		]);
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		const material = new THREE.MeshBasicMaterial({ color: 0xFF0000, alphaMap:texture, side: THREE.DoubleSide, transparent: true, opacity: 1 });
		//const material = new THREE.MeshBasicMaterial( {color: 0xFF0000, side: THREE.DoubleSide} );
		const plane = new THREE.Mesh( geometry, material );
		plane.position.set(0, 5, 0);
		plane.rotation.set(Math.PI / 2, 0, 0);
		this.fogOfWarMesh = plane;
		console.log("FOWM", this.fogOfWarMesh);
	}

	createDebug() {
		console.log("%c, TODO: Convert Fog of War into a matrix for simplicty in understanding and updating", "color: red");
		
		const width = 70;
		const height = 50;
		const widthMargin = Math.floor(width * 0.1);
		const heightMargin = Math.floor(height * 0.1);

		const size = width * height;
		const data = new Uint8Array( 4 * size );

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				const stride = (y * width + x) * 4;

				let alpha;
				if (x < widthMargin || x > width - widthMargin || y < heightMargin || y > height - heightMargin) {
					alpha = 255;
				} else if (x == widthMargin || x == width - widthMargin || y == heightMargin || y == height - heightMargin) {
					alpha = Math.random() * 255;
				} else {
					alpha = 0;
				}

				data[ stride ] = alpha;
				data[ stride + 1 ] = alpha;
				data[ stride + 2 ] = alpha;
				data[ stride + 3 ] = alpha;
			}
		}


		/*for ( let i = 0; i < size; i ++ ) {
			const stride = i * 4;
			const rand = Math.random() * 255;
			data[ stride ] = rand;
			data[ stride + 1 ] = rand;
			data[ stride + 2 ] = rand;
			data[ stride + 3 ] = rand;
		}*/

		//console.log(data);

		// used the buffer to create a DataTexture
		//const texture = new THREE.DataTexture( data, width, height, THREE.LuminanceFormat, THREE.UnsignedByteType);
		const texture = new THREE.DataTexture( data, width, height);
		console.log(texture);
		texture.flipY = true;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.generateMipmaps = false; // it's likely that our texture will not have "power of two" size, meaning that mipmaps are not going to be supported on WebGL 1.0, so let's turn them off

		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;

		texture.needsUpdate = true;

		const geometry = new THREE.PlaneGeometry(350, 265, 1, 1);
		/*const vertices = new Float32Array( [
			-2.0, -2.0,  2.0, // v0
			2.0, -2.0,  2.0, // v1
			2.0,  2.0,  2.0, // v2
		
			2.0,  2.0,  2.0, // v3
			-2.0,  2.0,  2.0, // v4
			-2.0, -2.0,  2.0  // v5
		]);
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );*/
		const material = new THREE.MeshBasicMaterial( {color: 0x000000, alphaMap:texture, transparent: true } );

		const plane = new THREE.Mesh( geometry, material ); 
		// add the mesh to the scene
		this.main.scene.add( plane );

		plane.position.z = 7;
		plane.position.y = 3;
		plane.rotation.set(Math.PI * -0.5, 0, 0);
	}
}
