import { Main } from '../../core/Main';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { SpriteSheetRow } from '../assets/SpriteAsset';
import { Creep } from './Creep';
import { CreepStats } from './CreepStats';

export class Troll extends Creep {
	/**
	 * Main
	 * */
	static assetName: string = 'Troll';
	static assetPath: string = 'assets/spritesheets/creeps/spritesheet-troll.png';
	static assetScale: number = 0.75;
	static assetPositionY: number = 3;
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
		super(main, Troll.assetName, Troll.assetPositionY, Troll.spriteSheetRows, Troll.spriteSheetCellColCount, Troll.assetScale);

		return this;
	}
}
