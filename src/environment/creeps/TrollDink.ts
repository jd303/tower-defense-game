import THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';
import { SpriteSheetRow } from '../assets/SpriteAsset';

export class TrollDink extends Creep {
	/**
	 * Main
	 * */
	static assetName: string = 'TrollDink';
	static assetPath: string = 'assets/spritesheets/creeps/spritesheet-troll.png';
	static assetScale: number = 0.4;
	static assetPositionY: number = 1.6;
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "walk",
			totalFrames: 2,
			currentFrame: 0,
		}
	]
	static spriteSheetCellColCount: number = 2;

	/**
	 * Spritesheet & InstancedMesh properties
	 */
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 2 },
			uFrameRows: { value: 1 },
			uSize: { value: 8 }
		},
		alphaTest: 0.5,
		transparent: true
	}

	/**
	 * Stats
	 * */
	stats = new CreepStats({
		hp_total: 30,
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
			value: 5
		},
		vp_loss: 1,
		attack_speed: 10,
		attack_damage: 10,
		attack_damagetype: DamageTypes.piercing
	});
	healthBarY: 1.5;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, TrollDink.assetName, TrollDink.assetPositionY, TrollDink.spriteSheetRows, TrollDink.spriteSheetCellColCount, TrollDink.assetScale);

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) { }
}
