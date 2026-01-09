import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { SpriteSheetRow } from '../assets/SpriteAsset';
//import { DamageTypes } from '../../data/DamageTypes';
import { Hero } from './Hero';
import { HeroStats } from './HeroStats';

export class Man0 extends Hero {
	/**
	 * Main
	 * */
	static assetName: string = 'Man0';
	static assetPath: string = 'assets/spritesheets/heroes/spritesheet-man0.png';
	static assetScale: number = 0.8;
	static assetPositionY: number = 1.2;
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "walk",
			totalFrames: 4,
			currentFrame: 0,
		},
		{
			name: "attack",
			totalFrames: 4,
			currentFrame: 0,
		}
	]
	static spriteSheetCellColCount: number = 4;

	/**
	 * Stats
	 * */
	stats = new HeroStats({
		name: "Man0",
		hp_total: 40,
		movement: {
			speed: 5.5,
			type: MovementTypes.walking,
		},
		damage: 2,
		damageType: DamageTypes.piercing,
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 0,
			poison: 0,
			lightning: 0,
			fire: -10,
		},
		interceptDistance: 5,
		numberIntercepted: 2
	});
	healthBarY: 2;

	/**
	 * Spritesheet & InstancedMesh properties
	 */
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 4 },
			uFrameRows: { value: 4 },
			uSize: { value: 10 }
		},
		alphaTest: 0.5,
		transparent: true
	}

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, Man0.assetName, Man0.assetPositionY, Man0.spriteSheetRows, Man0.spriteSheetCellColCount, Man0.assetScale);

		this.interceptionHandler.setInterceptionSlotCount(this.stats.numberIntercepted);

		return this;
	}

	/**
	 * Animations
	 * */
	animate(timeProperties: TickTimeProperties) { }
}
