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
	geometry: THREE.PlaneBufferGeometry;
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
		const geometry = new THREE.PlaneBufferGeometry( 250, 250, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0xFF0000, alphaMap:texture, side: THREE.DoubleSide, transparent: true, opacity: 1 });
		//const material = new THREE.MeshBasicMaterial( {color: 0xFF0000, side: THREE.DoubleSide} );
		const plane = new THREE.Mesh( geometry, material );
		plane.position.set(0, 5, 0);
		plane.rotation.set(Math.PI / 2, 0, 0);
		this.fogOfWarMesh = plane;
		console.log("FOWM", this.fogOfWarMesh);
	}

	createDebug() {
		const mask = [
			1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,
			1,1,1,0,1,1,1,1,
			1,1,0,0,0,1,1,1,
			1,0,0,0,0,0,1,1,
			1,1,0,0,0,1,1,1
		];
		
		//create a typed array to hold texture data
		const data = new Uint8Array(mask.length);
		//copy mask into the typed array
		data.set(mask.map(v => v*128));
		//create the texture
		const texture = new THREE.DataTexture(data, 8, 8, THREE.LuminanceFormat, THREE.UnsignedByteType);
		
		texture.flipY = true;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		//it's likely that our texture will not have "power of two" size, meaning that mipmaps are not going to be supported on WebGL 1.0, so let's turn them off
		texture.generateMipmaps = false;
		
		texture.magFilter = THREE.LinearFilter;
		texture.minFilter = THREE.LinearFilter;
		
		texture.needsUpdate = true;
		
		const geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1);
		const material = new THREE.MeshBasicMaterial( {color: 0xFF0000, alphaMap:texture, side: THREE.DoubleSide, transparent: true, opacity:1} );
		//const material = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
		
		// construct a mesh
		const plane = new THREE.Mesh( geometry, material ); 
		// add the mesh to the scene
		this.main.scene.add( plane );
		
		plane.position.z = -1;
		plane.position.y = 5;
		plane.rotation.set(Math.PI / 2, Math.PI, 0);
	}
}
