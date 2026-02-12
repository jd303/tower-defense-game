import { Main } from '../../core/Main';
import { Level } from '../../levels/Level';
import { SpriteAsset, SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';

export class PowerCatapultBarrageRock extends SpriteAsset {
	/**
	 * System Properties
	 * */
	main: Main;
	level: Level;

	/**
	 * Static properties
	 */
	static assetProperties: SpriteAssetProperties = {
		assetType: 'power',
		assetName: 'PowerCatapultBarrageRock',
		assetPath: 'assets/spritesheets/powers/spritesheet-power-catapultbarrage.png',
		assetScale: 5,
		assetPositionY: 0
	}
	static instancedMeshInstanceCount = 5;
	static instancedMeshAnimates: boolean = true;

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
		animationSpeed: 5
	}
	static spriteSheetRows: SpriteSheetRow[] = [
		{
			name: "barrage",
			totalFrames: 2,
			currentFrame: 0,
		}
	]

	/**
	 * Construtor
	 * */
	constructor(main: Main) {
		super(main, PowerCatapultBarrageRock.assetProperties, PowerCatapultBarrageRock.spriteSheetRows, PowerCatapultBarrageRock.AnimationAttributes);
	}
}