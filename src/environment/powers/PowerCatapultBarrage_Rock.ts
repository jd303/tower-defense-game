import { Main } from '../../core/Main';
import { Level } from '../../levels/Level';
import { SpriteAsset, SpriteSheetRow } from '../assets/SpriteAsset';

export class PowerCatapultBarrageRock extends SpriteAsset {
	/**
	 * System Properties
	 * */
	main: Main;
	level: Level;

	/**
	 * Static properties
	 */
	static assetName = 'PowerCatapultBarrageRock';
	static assetType = 'power';
	static assetPath = 'assets/spritesheets/powers/spritesheet-power-catapultbarrage.png';
	static assetPositionY = 0;
	static assetScale = 5;
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
		super(main, PowerCatapultBarrageRock.assetName, PowerCatapultBarrageRock.assetType, PowerCatapultBarrageRock.assetScale, PowerCatapultBarrageRock.assetPositionY, PowerCatapultBarrageRock.spriteSheetRows, PowerCatapultBarrageRock.AnimationAttributes);
	}
}