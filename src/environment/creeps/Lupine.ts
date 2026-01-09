import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';
import { SpriteSheetRow } from '../assets/SpriteAsset';

export class Lupine extends Creep {
	/**
	 * Main
	 * */
	static assetName: string = 'Lupine';
	static assetPath: string = 'assets/spritesheets/creeps/spritesheet-lupine.png';
	static assetScale: number = 0.25;
	static assetPositionY: number = 0.5;
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
		hp_total: 25,
		movement: {
			speed: 4,
			interception_modifier: 2,
			type: MovementTypes.walking,
		},
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: 0,
		},
		kill_rewards: {
			economic_property: "money",
			value: 5
		},
		vp_loss: 1,
		attack_speed: 15,
		attack_damage: 10,
		attack_damagetype: DamageTypes.crushing
	});
	healthBarY: 3;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, Lupine.assetName, Lupine.assetPositionY, Lupine.spriteSheetRows, Lupine.spriteSheetCellColCount, Lupine.assetScale);

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) { }
}
