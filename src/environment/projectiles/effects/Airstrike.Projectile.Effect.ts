import THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class AirstrikeProjectileEffect extends Effect {
	static assetName = 'AirstrikeProjectileEffect';

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, AirstrikeProjectileEffect.assetName);

		// Arrow geometry: cylinder as the shaft, cone as the head
		const shaftGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
		const headGeometry = new THREE.ConeGeometry(0.6, 1.5, 8);

		// Orient cylinder so it points along Z axis
		shaftGeometry.rotateX(Math.PI / 2);
		headGeometry.rotateX(Math.PI / 2);
		
		// Move head to the tip of the shaft
		headGeometry.translate(0, 0, 1.5);
		shaftGeometry.translate(0, 0, -0.75); // Center the whole arrow a bit

		// Combine geometries
		const arrowGroup = new THREE.Group();
		
		const material = new THREE.MeshLambertMaterial({ color: 0x999999 }); // Steel grey
		
		const shaft = new THREE.Mesh(shaftGeometry, material);
		const head = new THREE.Mesh(headGeometry, material);

		arrowGroup.add(shaft);
		arrowGroup.add(head);

		// We use a group instead of a single mesh for the effect, so we replace the default mesh
		this.groupMain.remove(this.mesh);
		this.groupMain.add(arrowGroup);
	}
}
