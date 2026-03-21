import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { Projectile, ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { MineProjectileEffect } from '../projectiles/effects/Mine.Projectile.Effect';
import { MineProjectile } from '../projectiles/Mine.Projectile';
import { TickTimeProperties } from '../../core/TickService';
import * as THREE from 'three';
import { TowerStates, TowerTransitions } from './TowerStates';
import { PositionService } from '../PositionService';
import { CreepPath } from '../creeps/CreepPath';
import { Creep } from '../creeps/Creep';
import { LevelService } from '../../levels/LevelService';

export class TowerMine extends Tower {
	/**
	 * Static details
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerMine',
		assetPath: 'assets/towers/mine/spritesheet.tower.mine.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/mine/ui.icon.tower.mine.png',
		art: ''
	}
	static cost = 250;
	static towerZoneWidth = 0;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 4 },
			uFrameRows: { value: 4 }
		}
	}
	static AnimationAttributes = {
		animates: true,
		animationSpeed: 2
	}
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "idle",
			totalFrames: 1,
			currentFrame: 0,
		}
	]

	/**
	 * Stats
	 * */
	static stats: StatBlockCharacter = {
		attack: {
			duration: 3000,
			accuracy: 1.0,
			damage: 3,
			damageType: DamageTypes.fire,
			rangeType: AttackRangeTypes.ranged,
			range: 10
		},
		projectile: {
			projectile: MineProjectile,
			effect: MineProjectileEffect,
			hitType: ProjectileHitTypes.splash,
			flightDuration: 0,
			splashRadius: 3 // explosion size
		},
	};

	/**
	 * Abstract Overrides
	 */
	projectileOriginY = 0.5;

	maxMines: number = 2; // Can customize this
	mineLocations: THREE.Vector3[] = [];

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerMine.assetProperties, TowerMine.spriteSheetRows, TowerMine.AnimationAttributes);
		this.stats = new CharacterStats({ ...TowerMine.stats });

		// POOR TIMEOUT
		setTimeout(() => this.calculateMineLocations(), 1500);

		return this;
	}

	/**
	 * Calculates locations for mines
	 */
	calculateMineLocations() {
		this.mineLocations = [];

		const sLevel: LevelService = this.main.s('Level');
		const level = sLevel.currentLevel;
		if (!level || !level.creepManager) return;
		const creepPaths = level.creepManager.creepPaths;

		// Gather all potential points on paths
		const potentialPoints: THREE.Vector3[] = [];
		const towerPos = this.groupMain.position;
		console.log(towerPos, this.instancedMesh.iMesh.position);

		creepPaths.forEach((creepPath: CreepPath) => {
			const points = creepPath.corePath.path.getSpacedPoints(100);
			points.forEach(p => {
				const typedP = p as THREE.Vector3;
				if (towerPos.distanceTo(typedP) <= this.stats.activeStats.attack!.range!) {
					const randomX = Math.random() * 4 - 2;
					const randomZ = Math.random() * 4 - 2;
					const vec = new THREE.Vector3(typedP.x + randomX, typedP.y, typedP.z + randomZ);
					potentialPoints.push(vec);
				}
			});
		});

		// Randomly pick up to 10 points
		const numberOfLocations = Math.min(10, potentialPoints.length);
		for (let i = 0; i < numberOfLocations; i++) {
			const randomIndex = Math.floor(Math.random() * potentialPoints.length);
			this.mineLocations.push(potentialPoints.splice(randomIndex, 1)[0]);
		}
	}

	/**
	 * Override Animate to handle laying and detonating mines
	 * */
	animate(timeProperties: TickTimeProperties) {
		if (this.stateMachine.isInState(TowerStates.scanning) && this.mineLocations.length > 0) {

			if (this.projectiles.length < this.maxMines) {
				const randomLoc = this.mineLocations[Math.floor(Math.random() * this.mineLocations.length)];

				const activeProjectile = new this.stats.activeStats.projectile!.projectile({
					main: this.main,
					tower: this,
					startingPoint: randomLoc.clone(),
					target: null as any,
					isAccurate: true,
					hitType: this.stats.activeStats.projectile!.hitType,
					projectileAsset: this.stats.activeStats.projectile!.effect,
					projectileFlightDuration: 0,
				}) as MineProjectile;

				this.projectiles.push(activeProjectile);

				console.error("Have to rethink target in new Projectile, as it can be optional");

				// Set to attacking mode, and reset to scanning
				this.stateMachine.transition(TowerTransitions.attacking);
				setTimeout(() => {
					this.stateMachine.transition(TowerTransitions.scanning);
				}, this.stats.activeStats.attack?.duration);
			}
		}

		// Check for detonating mines
		const sPositioning: PositionService = this.main.s('Position');
		this.projectiles.forEach(p => {
			if (p instanceof MineProjectile) {
				const mine = p as MineProjectile;
				if (!mine.isDetonated) {
					// Detonate if creep gets within 1.5 radius
					const creeps = sPositioning.getCreepsInRadiusFromPosition(mine.projectileGroup.position, 1.5);
					if (creeps.length > 0) {
						mine.detonate(creeps[0]);
					}
				}
			}
		});

		// Animate Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}
}
