import { Main } from '../../core/Main';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { AttackRangeTypes, CharacterStats } from '../Stats';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';

export class TrollDink extends Creep {
	/**
	 * Main
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'creep',
		assetName: 'CreepTrollDink',
		assetPath: 'assets/spritesheets/creeps/spritesheet-troll.png',
		assetScale: 3.25,
		assetPositionY: 0
	}
	static waveDifficulty = 1;

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
		animationSpeed: 1.75
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
			speed: 2,
			type: MovementTypes.walking,
		},
		life: {
			total: 30,
			current: 30,
		},
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 10,
			poison: 0,
			lightning: 0,
			fire: -10,
		},
		kill_rewards: {
			economic_property: "money",
			value: 5
		},
		vp_loss: {
			value: 1
		},
		attack: {
			speed: 10,
			accuracy: 1.0,
			damage: 10,
			damageType: DamageTypes.piercing,
			rangeType: AttackRangeTypes.melee,
			range: 0
		}
	});
	healthBarY: 3.5;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, TrollDink.assetProperties, TrollDink.spriteSheetRows, TrollDink.AnimationAttributes);

		return this;
	}
}
