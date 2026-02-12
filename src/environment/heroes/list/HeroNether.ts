import { Main } from '../../../core/Main';
import { TickTimeProperties } from '../../../core/TickService';
import { DamageTypes } from '../../../data/DamageTypes';
import { MovementTypes } from '../../../data/MovementTypes';
import { SpriteAssetProperties, SpriteSheetRow } from '../../assets/SpriteAsset';
//import { DamageTypes } from '../../data/DamageTypes';
import { Hero, HeroAssetProperties } from '../Hero';
import { AttackRangeTypes, CharacterStats } from '../../Stats';

export class Nether extends Hero {
	/**
	 * Main
	 * */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'hero',
		assetName: 'Nether',
		assetPath: 'assets/heroes/nether/spritesheet-nether.png',
		assetScale: 6,
		assetPositionY: 0
	}
	static heroProperties: HeroAssetProperties = {
		iconUI: 'assets/heroes/nether/icon.ui.nether.png',
		iconGallery: 'assets/heroes/nether/gallery-nether.png',
		heroArt: 'assets/heroes/nether/hero-art-nether.png',
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
		super(main, Nether.assetProperties, Nether.spriteSheetRows, Nether.AnimationAttributes);

		this.interceptionHandler.setInterceptionSlotCount(this.stats.activeStats.interception!.interceptionCount);

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) { }
}
