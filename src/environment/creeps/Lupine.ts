import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { AttackRangeTypes, Stats } from '../Stats';
import { SpriteSheetRow } from '../assets/SpriteAsset';

export class Lupine extends Creep {
	/**
	 * Main
	 * */
	static assetType = 'creep';
	static assetName: string = 'CreepLupine';
	static assetPath: string = 'assets/spritesheets/creeps/spritesheet-lupine.png';
	static assetScale: number = 0.25;
	static assetPositionY: number = 0.5;

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
	static AnimationAttributes = {
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
	stats = new Stats({
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
			speed: 15,
			accuracy: 1.0,
			damage: 10,
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
		super(main, Lupine.assetName, Lupine.assetType, Lupine.assetPositionY, Lupine.spriteSheetRows, Lupine.assetScale);

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) { }
}
