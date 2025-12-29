import * as THREE from 'three';
import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { Projectile, ProjectileHitTypes, ProjectileTypes } from '../attacks/Projectile';
import { Creep } from '../creeps/Creep';
import { TowerStates, TowerTransitions } from './TowerStates';
import { DamageTypes } from '../../data/DamageTypes';
import { ArrowShot } from '../effects/ArrowShot';
import { TowerStats } from './TowerStats';

export class TowerArcher extends Tower {
	/**
	 * Tower Assets
	 * */
	assetPath: string = 'assets/models/towers/Tower.Slinger.glb';
	assetScale = 1.75;
	projectileBasis: THREE.Mesh = new THREE.Mesh(new THREE.CircleGeometry(0.2, 8), new THREE.MeshMatcapMaterial({ color: 'red' }));

	/**
	 * Static details
	 */
	static buttonIcon = 'assets/models/towers/Tower.Archer.UI.icon.png';
	static cost = 100;
	static costType = 'money';
	static towerZoneWidth = 0;

	/**
	 * Stats
	 * */
	static stats: TowerStats = {
		attack: {
			damage: 5,
			damageType: DamageTypes.piercing,
			type: ProjectileTypes.arc,
			hitType: ProjectileHitTypes.direct,
			range: 13,
			speed: 1.5,
			radius: 0
		},
		last_attack_time: 0,
		attack_cooldown: 50, // not used, uses state system instead
	};

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main);
		//this.loadModel();
		this.loadSpritesheetTemp();
		this.stats = { ...TowerArcher.stats };
		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}

	/**
	 * Animates
	 */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		if (this.stateMachine.isInState(TowerStates.scanning)) {
			const creep = this.main.s('Level').currentLevel.creepManager.creeps.find((creep: Creep) => {
				const creepPosition = creep.groupMain.position;
				const distance = creepPosition.distanceTo(position);

				// If something is in range
				if (distance < this.stats.attack.range) {
					return true;
				}
			});

			// If we have a target
			if (creep) {
				this.stateMachine.transition(TowerTransitions.attacking);
				const projectile = new Projectile(
					this.main,
					this,
					new THREE.Vector3(this.groupMain.position.x, 3.5, this.groupMain.position.z),
					creep,
					this.stats.attack.type,
					this.stats.attack.hitType,
					new ArrowShot(this.main),
					this.stats.attack.speed
				);

				this.projectiles.push(projectile);
				//}
			}
		}

		if (this.stateMachine.isInState(TowerStates.attacking)) {
			if (this.states.attacking.attackStartTime + this.states.attacking.attackDuration < new Date().getTime()) {
				this.states.attacking.isAttacking = false;
				this.groupModel.position.z = 0;
			} else {
				this.groupModel.position.z = Math.sin(timeProperties.elapsedTime * 50) / 10;
			}
		}

		// Animate Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}

	loadSpritesheetTemp() {
		const loader = new THREE.TextureLoader();
		const texture = loader.load('assets/temp/spritesheet-tower-archer.png');
		texture.colorSpace = THREE.SRGBColorSpace;

		// 2. Create the material (specifically SpriteMaterial)
		const material = new THREE.SpriteMaterial({ map: texture });

		// 3. Create the Sprite
		const sprite = new THREE.Sprite(material);

		// 4. Scale it (since it has no geometry, it defaults to 1x1 unit)
		sprite.scale.set(4, 4, 1);
		sprite.position.set(0, 1.60, 0);

		this.groupModel.scale.set(this.assetScale, this.assetScale, this.assetScale);
		this.groupModel.position.y = this.assetPositionY;
		this.groupModel.add(sprite);

		const cols = 1; // Number of horizontal frames
		const rows = 1; // Number of vertical frames
		const totalFrames = 1;

		// Tell the texture to only show 1/4th of the width and height
		texture.repeat.set(1 / cols, 1 / rows);

		let currentFrame = 0;

		function animateSprite() {
			currentFrame = (currentFrame + 1) % totalFrames;

			const column = currentFrame % cols;
			const row = Math.floor(currentFrame / cols);

			// Shift the "window" to the correct frame
			texture.offset.x = column / cols;
			texture.offset.y = 1 - (row + 1) / rows; // Y is often inverted in UVs
		}

		setInterval(animateSprite, 300);

		// Create a shadow
		const shadowTexture = loader.load('assets/temp/shadow-blob.png');
		const shadowMaterial = new THREE.MeshBasicMaterial({
			map: shadowTexture,
			transparent: true,
			opacity: 0.75,
			depthWrite: false // Prevents weird flickering with the floor
		});
		/*const shadowMaterial = new THREE.MeshBasicMaterial({
			color: 0x000000
		});*/

		const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shadowMaterial);
		shadow.rotation.x = -Math.PI / 2; // Lay it flat
		shadow.position.y = 0.2; // Position it at the troll's feet
		shadow.scale.set(2, 2, 2);

		this.groupModel.add(shadow);
	}
}
