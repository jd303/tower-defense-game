import { Main } from '../../core/Main';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { MovementTypes } from '../../dataTypes/MovementTypes';
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
		assetScale: 3.25
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
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: -5,
		},
		kill_rewards: {
			economic_property: "money",
			value: 5
		},
		vp_loss: {
			value: 3
		},
		attack: {
			duration: 1000,
			accuracy: 1.0,
			damage: 5,
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
