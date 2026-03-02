import { Main } from '../../core/Main';
import { DamageTypes } from '../../dataTypes/DamageTypes';
import { MovementTypes } from '../../dataTypes/MovementTypes';
import { Creep } from './Creep';
import { AttackRangeTypes, CharacterStats } from '../Stats';
import { SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';

export class Lupine extends Creep {
	/**
	 * Main
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'creep',
		assetName: 'CreepLupine',
		assetPath: 'assets/spritesheets/creeps/spritesheet-lupine.png',
		assetScale: 2
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
		animationSpeed: 2
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
			speed: 4,
			type: MovementTypes.walking,
		},
		life: {
			total: 25,
			current: 25,
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
		vp_loss: {
			value: 1
		},
		attack: {
			duration: 250,
			accuracy: 1.0,
			damage: 5,
			damageType: DamageTypes.piercing,
			rangeType: AttackRangeTypes.melee,
			range: 0
		}
	});
	healthBarY: 3;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, Lupine.assetProperties, Lupine.spriteSheetRows, Lupine.AnimationAttributes);

		return this;
	}
}
