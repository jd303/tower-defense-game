import * as THREE from 'three';
import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes } from '../projectiles/Projectile';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';
import { FanBoltProjectileEffect } from '../projectiles/effects/FanBolt.Projectile.Effect';
import { FanBoltProjectile } from '../projectiles/FanBolt.Projectile';
import { TickTimeProperties } from '../../core/TickService';
import { TowerStates, TowerTransitions } from './TowerStates';

export class TowerFanBolt extends Tower {
	static assetProperties: SpriteAssetProperties = {
		assetType: 'tower',
		assetName: 'TowerFanBolt',
		assetPath: 'assets/towers/fanbolt/spritesheet.tower.fanbolt.png',
		assetScale: 7
	}
	static towerProperties = {
		icon: 'assets/towers/fanbolt/ui.icon.tower.fanbolt.png',
		art: ''
	}
	static cost = 125;
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
		{ name: "idle", totalFrames: 1, currentFrame: 0 }
	]

	static stats: StatBlockCharacter = {
		attack: {
			duration: 1000,
			accuracy: 1.0,
			damage: 8,
			damageType: DamageTypes.lightning,
			rangeType: AttackRangeTypes.ranged,
			range: 15
		},
		projectile: {
			projectile: FanBoltProjectile,
			effect: FanBoltProjectileEffect,
			hitType: ProjectileHitTypes.direct,
			flightDuration: 300,
			splashRadius: 0
		},
	};

	projectileOriginY = 8;

	maxBolts = 3;
	hoveringBolts: THREE.Mesh[] = [];
	timeSinceLastBolt = 0;

	constructor(main: Main) {
		super(main, TowerFanBolt.assetProperties, TowerFanBolt.spriteSheetRows, TowerFanBolt.AnimationAttributes);
		this.stats = new CharacterStats({ ...TowerFanBolt.stats });
		return this;
	}

	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		// 1. Bolt Regeneration
		this.timeSinceLastBolt += timeProperties.deltaTime * 1000;
		const cooldown = this.stats.activeStats.attack!.duration;

		if (this.timeSinceLastBolt >= cooldown && this.hoveringBolts.length < this.maxBolts) {
			this.timeSinceLastBolt -= cooldown; // Alternatively reset to 0, but this handles overflow gracefully
			this.generateHoveringBolt();
		}

		// 2. Animate Hovering Bolts (Fan Shape)
		this.animateHoveringBolts(timeProperties);

		// 3. Targeting and Firing
		if (this.stateMachine.isInState(TowerStates.scanning) && this.hoveringBolts.length > 0) {
			const creepsInRange = this.sLevel.currentLevel.creepManager.findCreepsInRangeOf(position, this.stats.activeStats.attack!.range!);

			if (creepsInRange.length) {
				const target = creepsInRange[0];

				// Fire all hovering bolts
				this.hoveringBolts.forEach((boltMesh) => {
					const startPos = new THREE.Vector3();
					boltMesh.getWorldPosition(startPos);

					const activeProjectile = new this.stats.activeStats.projectile!.projectile({
						main: this.main,
						tower: this,
						startingPoint: startPos,
						target: target,
						isAccurate: true,
						hitType: this.stats.activeStats.projectile!.hitType,
						projectileAsset: this.stats.activeStats.projectile!.effect,
						projectileFlightDuration: this.stats.activeStats.projectile!.flightDuration,
					});

					this.projectiles.push(activeProjectile);

					this.groupMain.remove(boltMesh);
					if (boltMesh.geometry) boltMesh.geometry.dispose();
					if ((boltMesh.material as THREE.Material).dispose) (boltMesh.material as THREE.Material).dispose();
				});

				this.hoveringBolts = [];

				this.stateMachine.transition(TowerTransitions.attacking);
				setTimeout(() => {
					this.stateMachine.transition(TowerTransitions.scanning);
				}, this.stats.activeStats.attack?.duration || 1000);
			}
		}

		// 4. Animate Fired Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}

	generateHoveringBolt() {
		const geometry = new THREE.IcosahedronGeometry(0.8, 0);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
		const mesh = new THREE.Mesh(geometry, material);
		// Spawn at tower origin before floating up
		mesh.position.set(0, this.projectileOriginY, 0);

		this.groupMain.add(mesh);
		this.hoveringBolts.push(mesh);
	}

	animateHoveringBolts(timeProperties: TickTimeProperties) {
		const numBolts = this.hoveringBolts.length;
		if (numBolts === 0) return;

		const spreadAngle = Math.PI / 3; // 60 degrees spread inside the fan
		const radius = 3;
		const height = this.projectileOriginY + 2;

		const time = new Date().getTime() / 500;

		for (let i = 0; i < numBolts; i++) {
			let angle = 0;
			if (numBolts > 1) {
				angle = -(spreadAngle / 2) + (spreadAngle / (numBolts - 1)) * i;
			}

			const bobOffset = Math.sin(time + i) * 0.5;

			const targetX = Math.sin(angle) * radius;
			const targetY = height + Math.abs(Math.cos(angle)) * radius * 0.5 + bobOffset;
			const targetZ = 0;

			// Smooth movement towards hovering position
			this.hoveringBolts[i].position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);
		}
	}
}
