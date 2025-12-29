import THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';

export class Troll extends Creep {
	/**
	 * Main
	 * */
	assetPath: string = 'assets/models/creeps/creep_troll.glb';
	assetScale: number = 1;
	shadowsEnabled = true;

	/**
	 * Stats
	 * */
	stats = new CreepStats({
		hp_total: 40,
		movement: {
			speed: 2,
			interception_modifier: 2,
			type: MovementTypes.walking,
		},
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: -10,
		},
		kill_rewards: {
			economic_property: "money",
			value: 10
		},
		vp_loss: 2,
		attack_speed: 10,
		attack_damage: 10,
		attack_damagetype: DamageTypes.crushing
	});
	healthBarY: 3;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		//this.loadModel();
		this.loadSpriteSheetTemp();

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) { }

	loadSpriteSheetTemp() {
		const loader = new THREE.TextureLoader();
		const texture = loader.load('assets/temp/spritesheet-troll.png');
		texture.colorSpace = THREE.SRGBColorSpace;

		// 2. Create the material (specifically SpriteMaterial)
		const material = new THREE.SpriteMaterial({ map: texture });

		// 3. Create the Sprite
		const sprite = new THREE.Sprite(material);

		// 4. Scale it (since it has no geometry, it defaults to 1x1 unit)
		sprite.scale.set(4, 4, 1);
		sprite.position.set(0, 2, 0);

		this.groupModel.scale.set(this.assetScale, this.assetScale, this.assetScale);
		this.groupModel.position.y = this.assetPositionY;
		this.groupModel.add(sprite);

		const cols = 2; // Number of horizontal frames
		const rows = 1; // Number of vertical frames
		const totalFrames = 2;

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
			opacity: 1,
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
