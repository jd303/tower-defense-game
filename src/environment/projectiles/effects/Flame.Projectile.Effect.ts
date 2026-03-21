import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class FlameProjectileEffect extends Effect {
	static assetName = 'FlameProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, FlameProjectileEffect.assetName);

		// Use a cone geometry for the flame. 
		// Radius: 5, Height: 20
		const geometry = new THREE.ConeGeometry(5, 20, 16);
		
		// Translate geometry so the origin is at the tip (bottom of the cone)
		geometry.translate(0, 10, 0);

		// Rotate the cone so it points along the Z axis (forward)
		geometry.rotateX(Math.PI / 2);

		const material = new THREE.MeshLambertMaterial({ 
			color: 0xff4500, // Orange-red
			transparent: true,
			opacity: 0.6
		});

		this.createMesh(geometry, material);
	}
}
