import { Main } from '../../core/Main';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { SpriteSheetRow } from '../assets/SpriteAsset';
import { Creep } from './Creep';
import { AttackRangeTypes, CharacterStats } from '../Stats';

export class Troll extends Creep {
	/**
	 * Main
	 * */
	static assetType = 'creep';
	static assetName: string = 'CreepTroll';
	static assetPath: string = 'assets/spritesheets/creeps/spritesheet-troll.png';
	static assetScale: number = 6.5;
	static assetPositionY: number = 2.1;
	static waveDifficulty = 3;

	/**
	 * Spritesheet & InstancedMesh properties
	 */
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 2 },
			uFrameRows: { value: 1 }
		}
	}
	static AnimationAttributes = {
		animates: true,
		animationSpeed: 1.5
	}
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "walk",
			totalFrames: 2,
			currentFrame: 0,
		}
	]

	/**
	 * Stats
	 * */
	stats = new CharacterStats({
		movement: {
			speed: 1.9,
			type: MovementTypes.walking,
		},
		life: {
			total: 40,
			current: 40,
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
		vp_loss: {
			value: 2
		},
		attack: {
			speed: 10,
			accuracy: 1.0,
			damage: 10,
			damageType: DamageTypes.crushing,
			rangeType: AttackRangeTypes.melee,
			range: 0
		}
	});
	healthBarY: 5;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, Troll.assetName, Troll.assetType, Troll.assetScale, Troll.assetPositionY, Troll.spriteSheetRows, Troll.AnimationAttributes);

		return this;
	}
}
