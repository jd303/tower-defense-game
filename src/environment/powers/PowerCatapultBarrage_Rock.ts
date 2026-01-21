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
	static assetScale = 1;
	static instancedMeshAssetScale = 1;
	static instancedMeshInstanceCount = 5;
	static instancedMeshAnimates: boolean = true;

	/**
	 * Spritesheet & InstancedMesh properties
	 */
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 2 },
			uFrameRows: { value: 1 },
			uSize: { value: 4 }
		},
		alphaTest: 0.5,
		transparent: true
	}
	static AnimationAttributes = {
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
		super(main, PowerCatapultBarrageRock.assetName, PowerCatapultBarrageRock.assetType, PowerCatapultBarrageRock.assetPositionY, PowerCatapultBarrageRock.spriteSheetRows, PowerCatapultBarrageRock.instancedMeshAssetScale, PowerCatapultBarrageRock.instancedMeshInstanceCount);
	}
}