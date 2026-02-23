import { Main } from '../../../core/Main';
import { TickTimeProperties } from '../../../core/TickService';
import { DamageTypes } from '../../../dataTypes/DamageTypes';
import { MovementTypes } from '../../../dataTypes/MovementTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../../assets/SpriteAsset';
//import { DamageTypes } from '../../dataTypes/DamageTypes';
import { Hero, HeroAssetProperties } from '../Hero';
import { AttackRangeTypes, CharacterStats } from '../../Stats';

export class AldricEthersteel extends Hero {
	/**
	 * Main
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'hero',
		assetName: 'AldricEthersteel',
		assetPath: 'assets/heroes/aldricEthersteel/spritesheet-aldricethersteel.png',
		assetScale: 6,
		assetPositionY: 0
	}
	static heroProperties: HeroAssetProperties = {
		iconUI: 'assets/heroes/aldricEthersteel/icon.ui.aldricethersteel.png',
		iconGallery: 'assets/heroes/aldricEthersteel/gallery-aldricethersteel.png',
		heroArt: 'assets/heroes/aldricEthersteel/hero-art-aldricethersteel.png',
	}
	static assetPositionY: number = 0; // Matches the path
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "idle",
			totalFrames: 1,
			currentFrame: 0,
		},
		{
			name: "walk",
			totalFrames: 2,
			currentFrame: 0,
		},
		{
			name: "attack",
			totalFrames: 2,
			currentFrame: 0,
		}
	]

	/**
	 * Stats
	 * */
	stats = new CharacterStats({
		movement: {
			speed: 5.5,
			type: MovementTypes.walking,
		},
		interception: {
			distance: 5,
			interceptionCount: 2
		},
		life: {
			total: 40,
			current: 40,
		},
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: -10,
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
			damage: 5,
			damageType: DamageTypes.piercing,
			rangeType: AttackRangeTypes.melee,
			range: 0
		}
	});
	healthBarY: 2;

	/**
	 * Spritesheet & InstancedMesh properties
	 */
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 4 },
			uFrameRows: { value: 4 }
		}
	}
	static AnimationAttributes = {
		animates: true,
		animationSpeed: 4
	}

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, AldricEthersteel.assetProperties, AldricEthersteel.spriteSheetRows, AldricEthersteel.AnimationAttributes);

		this.interceptionHandler.setInterceptionSlotCount(this.stats.activeStats.interception!.interceptionCount);

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) { }
}
