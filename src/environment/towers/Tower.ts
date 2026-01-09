import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { TowerStats, TowerStatesLegacy } from './TowerStats';
import { StateMachine } from '../../core/StateMachine';
import { TowerStates, TowerTransitions } from './TowerStates';
import { Projectile, ProjectileHitTypes } from '../attacks/Projectile';
import { PositionService } from '../PositionService';
import { Creep } from '../creeps/Creep';
import { InteractableOrders, InteractableTypes } from '../../game/InteractionService2';
import { CharacterAsset } from '../assets/CharacterAsset';
import { SpriteSheetRow } from '../assets/SpriteAsset';

// Maybe split CharacterAsset out into TowerAsset as well, for this?
export abstract class Tower extends CharacterAsset {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Static values
	 */
	static buttonIcon: string;
	static cost: number;
	static costType: string;
	static towerZoneWidth: number; // Determines how many zone placement tiles the tower blocks
	static instancedMeshInstanceCount: number = 25;

	/**
	 * Status
	 */
	typeName: InteractableTypes = "tower";
	states: TowerStatesLegacy = new TowerStatesLegacy();
	attackStateLength: number = 750;
	baseStats: TowerStats;
	stats: TowerStats;

	/**
	 * Objects
	 * */
	projectiles: Projectile[] = [];

	/**
	 * States
	 * */
	selectionGeometryScale = 1.1;
	stateMachine: StateMachine;
	interactiveOrder = InteractableOrders.towers;

	/**
	 * Constructor
	 * */
	constructor(main: Main, assetName: string, assetPositionY: number, spriteSheetRows: SpriteSheetRow[], spriteSheetCellColCount: number, instancedMeshAssetScale: number) {
		super(main, assetName, 'tower', assetPositionY, spriteSheetRows, spriteSheetCellColCount, instancedMeshAssetScale, Tower.instancedMeshInstanceCount);

		this.stateMachine = this.setDefaultStates();
		this.stateMachine.transition(TowerStates.scanning);
		this.setInteractive();
	}

	/**
	 * Sets default States for creeps
	 * */
	setDefaultStates() {
		const stateMachine = new StateMachine(this.main);

		stateMachine.addStates([
			{
				name: TowerStates.idle,
			},
			{
				name: TowerStates.scanning,
				//onEnter: this.lookForCreeps.bind(this),
			},
			{
				name: TowerStates.attacking,
				autoTransition: TowerTransitions.scanning,
				autoTransitionTimeMS: 1750,
				//onEnter: this.activateStandingPower.bind(this),
			},
			{
				name: TowerStates.activatingPower1,
			},
			{
				name: TowerStates.activatingPower2,
			},
		]);

		stateMachine.addTransitions([
			{
				name: TowerTransitions.pause,
				activatedStates: [TowerStates.idle],
				deactivatedStates: [TowerStates.attacking, TowerStates.activatingPower1, TowerStates.activatingPower2],
			},
			{
				name: TowerTransitions.attacking,
				activatedStates: [TowerStates.attacking],
				deactivatedStates: [TowerStates.idle, TowerStates.scanning, TowerStates.activatingPower1, TowerStates.activatingPower2],
			},
			{
				name: TowerTransitions.scanning,
				activatedStates: [TowerStates.scanning],
				deactivatedStates: [TowerStates.attacking, TowerStates.activatingPower1, TowerStates.activatingPower2],
			},
		]);

		return stateMachine;
	}

	/**
	 * Animate
	 * */
	animateCore(timeProperties: TickTimeProperties) {
		this.animate(timeProperties);
	}

	/**
	 * Animate: Overwritten by Towers
	 * */
	animate(timeProperties: TickTimeProperties) { }

	/**
	 * Resolve a hit
	 * */
	resolveHit(projectile: Projectile) {
		const sPositioning: PositionService = this.main.s('Position');
		let targets: Creep[] = [];

		switch (projectile.hitType) {
			case ProjectileHitTypes.direct:
				projectile.target.resolveAttack(this.stats.attack);
				break;
			case ProjectileHitTypes.splash:
				targets = sPositioning.getCreepsInRadiusFromPosition(projectile.target.groupMain.position, this.stats.attack.radius);
				targets.forEach(creep => creep.resolveAttack(this.stats.attack));
				break;
		}
	}

	/**
	 * Removes a Projectile
	 * */
	removeProjectile(removedProjectile: Projectile) {
		this.projectiles = this.projectiles.filter(projectile => projectile != removedProjectile);
	}

	/**
	 * When a tower is clicked
	 */
	select() {
		if (this.selected) {
			this.deselect();
			this.main.s('Interaction2')
		} else {
			this.selected = true;
			this.addSelectionVisibleMesh(this.stats.attack.range, 0.5)

			// Add debugs
			console.group();
			console.log(`Tower: ${this.constructor.name}`);
			console.log('Stats:', this.stats);
			console.groupEnd();
		}

		return { handled: true, cancelListeners: true };
	}
	deselect() {
		this.selected = false;
		this.removeSelectionVisibleMesh();
	}
}