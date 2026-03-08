import THREE from 'three';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileArguments } from './Projectile';
import { LevelService } from '../../levels/LevelService';

export class AuraProjectile extends Projectile {
	/**
	 * Constructor
	 * */
	constructor({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback }: ProjectileArguments) {
		super({ main, tower, startingPoint, target, isAccurate, hitType, projectileAsset, projectileFlightDuration, hitCallback });
		return this;
	}

	/**
	 * Sets up the aura
	 * */
	setup() {
		console.log("OK, GOT TO FIX THIS, AND MAKE IT EASIER TO ADD PROJETILE EFFECTS BECAUSE IT'S CONFUSING");

		console.log("WHY I GOTTA MANUALLY ADD TO THE SCENE?");

		//this.main.scene.add(this.projectileAssetInstance.mesh);
		this.projectileAssetInstance.groupMain.position.set(this.tower.groupMain.position.x, 2, this.tower.groupMain.position.z);
	}

	/**
	 * Animates the projectile
	 * */
	animate(timeProperties: TickTimeProperties) {
		this.animateProjectile(timeProperties);

		if (this.pathProgress >= 1) {
			this.tower.disposeProjectile(this);

			const sLevel: LevelService = this.main.s('Level');
			const allCreepsInRange = sLevel.currentLevel.creepManager.findCreepsInRangeOf(this.tower.groupMain.position, this.tower.stats.activeStats.attack!.range!);

			allCreepsInRange.forEach(creep => {
				this.target = creep;
				this.tower.resolveHit(this);
			});
		}
	}

	// Is Overwritten by the projectile type
	animateProjectile(timeProperties: TickTimeProperties) {
		this.pathProgress += 0.02;

		const scale = this.tower.stats.activeStats.attack!.range! * this.pathProgress;
		this.projectileAssetInstance.mesh.scale.set(scale, scale, scale);
	}
}
