import { Tower } from './Tower';
import { Main } from '../../core/Main';
import { ProjectileHitTypes, ProjectileTravelTypes } from '../attacks/Projectile';
import { DamageTypes } from '../../data/DamageTypes';
import { ArrowShot } from '../effects/ArrowShot';
import { SpriteSheetRow } from '../assets/SpriteAsset';
import { AttackRangeTypes, StatBlockCharacter, CharacterStats } from '../Stats';

export class TowerArcher extends Tower {
	/**
	 * Static details
	 */
	static assetName = "TowerArcher";
	static assetPath = 'assets/spritesheets/towers/spritesheet-tower-archer.png';
	static assetScale: number = 7;
	static assetPositionY = 0;
	static buttonIcon = 'assets/models/towers/Tower.Archer.UI.icon.png';
	static cost = 100;
	static costType = 'money';
	static towerZoneWidth = 0;
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 1 },
			uFrameRows: { value: 1 }
		}
	}
	static AnimationAttributes = {
		animates: true,
		animationSpeed: 2
	}
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "idle",
			totalFrames: 1,
			currentFrame: 0,
		}
	]

	/**
	 * Stats
	 * */
	static stats: StatBlockCharacter = {
		attack: {
			speed: 1,
			accuracy: 0.5,
			damage: 5,
			damageType: DamageTypes.piercing,
			rangeType: AttackRangeTypes.ranged,
			range: 13
		},
		projectile: {
			effect: ArrowShot,
			travelType: ProjectileTravelTypes.arc,
			hitType: ProjectileHitTypes.direct,
			speed: 20,
			splashRadius: 0
		},
	};

	/**
	 * Constructor
	 */
	constructor(main: Main) {
		super(main, TowerArcher.assetName, 'tower', TowerArcher.assetScale, TowerArcher.assetPositionY, TowerArcher.spriteSheetRows, TowerArcher.AnimationAttributes);

		this.stats = new CharacterStats({ ...TowerArcher.stats });

		console.log('NEXT UP, REFACTOR TARGETING WITH A HALFSECOND TICK TIMING, FOR EFFICIENCY');
		return this;
	}
}
