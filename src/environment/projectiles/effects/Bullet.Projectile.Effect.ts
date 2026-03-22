import * as THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class BulletProjectileEffect extends Effect {
	static assetName = 'BulletProjectileEffect';

    muzzleSmoke: THREE.Mesh;
    impactSmoke: THREE.Mesh;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, BulletProjectileEffect.assetName);

        // Muzzle smoke (at the origin of the group)
        this.muzzleSmoke = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8), 
            new THREE.MeshBasicMaterial({ color: '#888888', transparent: true, opacity: 0.8 })
        );
        this.groupMain.add(this.muzzleSmoke);

        // Impact smoke (positioned later by the Projectile based on the impact point)
        this.impactSmoke = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 8), 
            new THREE.MeshBasicMaterial({ color: '#888888', transparent: true, opacity: 0.8 })
        );
        this.groupMain.add(this.impactSmoke);
	}
}
