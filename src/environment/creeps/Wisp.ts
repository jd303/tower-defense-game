import { Main } from '../../core/Main';
import { DamageTypes } from '../../data/DamageTypes';
import { MovementTypes } from '../../data/MovementTypes';
import { Creep } from './Creep';
import { CreepStates, CreepTransitions } from './CreepStates';
import { AttackRangeTypes, CharacterStats } from '../Stats';
import { SpriteSheetRow } from '../assets/SpriteAsset';

export class Wisp extends Creep {
	/**
	 * Main
	 * */
	static assetType = 'creep';
	static assetName: string = 'CreepWisp';
	static assetPath: string = 'assets/spritesheets/creeps/spritesheet-wisp.png';
	static assetScale: number = 2;
	static assetPositionY = 3;
	static waveDifficulty = 1.5;

	/**
	 * Spritesheet & InstancedMesh properties
	 */
	static ShaderMaterialProperties = {
		uniforms: {
			uFrameCols: { value: 2 },
			uFrameRows: { value: 2 }
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
		},
		{
			name: "power",
			totalFrames: 2,
			currentFrame: 0,
		}
	]

	/**
	 * Stats
	 * */
	stats = new CharacterStats({
		movement: {
			speed: 2.75,
			type: MovementTypes.flying,
		},
		life: {
			total: 10,
			current: 10,
		},
		defenses: {
			piercing: 0,
			crushing: 0,
			arcane: 10,
			poison: 0,
			lightning: 0,
			fire: 0,
		},
		kill_rewards: {
			economic_property: "money",
			value: 15
		},
		vp_loss: {
			value: 1
		},
		attack: {
			speed: 10,
			accuracy: 1.0,
			damage: 10,
			damageType: DamageTypes.arcane,
			rangeType: AttackRangeTypes.melee,
			range: 0
		}
	});
	healthBarY: 5;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, Wisp.assetName, Wisp.assetType, Wisp.assetScale, Wisp.assetPositionY, Wisp.spriteSheetRows, Wisp.AnimationAttributes);

		this.modifyStateMachine();
		this.stateMachine.transition(CreepStates.pathmoving);

		return this;
	}

	/**
	 * Adds unique state items for the Wisp
	 * */
	modifyStateMachine() {
		// Wisps stop to use their ability
		this.stateMachine.modifyState(CreepStates.pathmoving, {
			name: CreepStates.pathmoving,
			autoTransition: CreepTransitions.activating_standing_power,
			autoTransitionTimeMS: 5000,
			onEnter: this.activatePathMoving.bind(this),
		});

		// Wisps then activate and move on
		this.stateMachine.modifyState(CreepStates.activatingStandingPower, {
			name: CreepStates.activatingStandingPower,
			autoTransition: CreepTransitions.pathmoving,
			autoTransitionTimeMS: 2000,
			onEnter: this.activateStandingPower.bind(this),
		});
	}

	/**
	 * WISP: Normal walking
	 */
	activatePathMoving() {
		this.spriteSheetFrameManager?.changeAnimation('walk');
	}

	/**
	 * WISP POWER: Normalise health amongst nearby creeps
	 * */
	activateStandingPower(): void {
		console.log('%c WISP: Life Scales', 'color: purple');

		this.spriteSheetFrameManager.changeAnimation('power');

		const creepsAroundMe = this.main.s('Position').getCreepsInRadiusFromPosition(this.groupMain.position, 15);
		const creepsThatArentMe = creepsAroundMe.filter((creep: Creep) => creep !== this);

		const combinedHealthPercentage =
			creepsThatArentMe.reduce((percentage: number, creep: Creep) => percentage + (creep.stats.activeStats.life!.current / creep.stats.activeStats.life!.total) * 100, 0);
		const averageHealthPercentage = combinedHealthPercentage / creepsThatArentMe.length;

		creepsThatArentMe.forEach((creep: Creep) => {
			creep.stateMachine.transition(CreepTransitions.healed);
			//creep.adjustHealthByNumber(20);
			creep.setHealthByPercentage(averageHealthPercentage);
		});
	}
}
