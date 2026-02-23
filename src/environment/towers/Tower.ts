import THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { StateMachine } from '../../core/StateMachine';
import { TowerStates, TowerTransitions } from './TowerStates';
import { Projectile, ProjectileHitTypes } from '../attacks/Projectile';
import { PositionService } from '../PositionService';
import { Creep } from '../creeps/Creep';
import { InteractableOrders, InteractableTypes } from '../../game/InteractionService2';
import { CharacterAsset } from '../assets/CharacterAsset';
import { ShaderAnimationAttributes, SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';


// Maybe split CharacterAsset out into TowerAsset as well, for this?
export abstract class Tower extends CharacterAsset {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Static values
	 */
	static towerProperties: TowerAssetProperties;
	static cost: number;
	static towerZoneWidth: number; // Determines how many zone placement tiles the tower blocks
	static instancedMeshInstanceCount: number = 25;
	static instancedMeshAnimates: boolean = true;

	/**
	 * Status
	 */
	interactiveTypeName: InteractableTypes = "tower";
	attackStateLength: number = 750;

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
	constructor(main: Main, assetProperties: SpriteAssetProperties, spriteSheetRows: SpriteSheetRow[], animationAttributes: ShaderAnimationAttributes) {
		super(main, assetProperties, spriteSheetRows, animationAttributes);

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
				autoTransitionTimeMS: 2750,
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
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		if (this.stateMachine.isInState(TowerStates.scanning)) {
			const creepsInRange = this.sLevel.currentLevel.creepManager.findCreepsInRangeOf(position, this.stats.activeStats.attack!.range!);

			// If we have a target
			if (creepsInRange.length) {
				this.stateMachine.transition(TowerTransitions.attacking);

				const isAccurate = Math.random() < this.stats.activeStats.attack!.accuracy;

				const activeProjectile = new Projectile(
					this.main,
					this,
					new THREE.Vector3(this.groupMain.position.x, 5, this.groupMain.position.z),
					creepsInRange[0],
					isAccurate,
					this.stats.activeStats.projectile!.travelType,
					this.stats.activeStats.projectile!.hitType,
					new this.stats.activeStats.projectile!.effect(this.main),
					this.stats.activeStats.projectile!.speed,
				);

				this.projectiles.push(activeProjectile);
			}
		}

		// Animate Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}

	/**
	 * Resolve a hit
	 * */
	resolveHit(projectile: Projectile) {
		const sPositioning: PositionService = this.main.s('Position');
		let targets: Creep[] = [];

		switch (projectile.hitType) {
			case ProjectileHitTypes.direct:
				projectile.target.resolveAttack(this.stats.activeStats.attack!);
				break;
			case ProjectileHitTypes.splash:
				targets = sPositioning.getCreepsInRadiusFromPosition(projectile.target.groupMain.position, this.stats.activeStats.projectile!.splashRadius);
				targets.forEach(creep => creep.resolveAttack(this.stats.activeStats.attack!));
				break;
		}
	}

	/**
	 * Removes a Projectile
	 * */
	disposeProjectile(removedProjectile: Projectile) {
		this.projectiles = this.projectiles.filter(projectile => projectile != removedProjectile);
		removedProjectile.dispose();
	}

	/**
	 * Disposes all projectiles
	 */
	disposeAllProjectiles() {
		this.projectiles.forEach(projectile => projectile.dispose(true));
		this.projectiles = [];
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
			this.addSelectionVisibleMesh(this.stats.activeStats.attack!.range, 0.5)

			// Add debugs
			console.group();
			console.log(`Tower: ${this.constructor.name}`);
			console.log('Stats:', this.stats);
			console.groupEnd();
		}

		return { handled: true, stopPropagation: true };
	}
	deselect() {
		this.selected = false;
		this.removeSelectionVisibleMesh();
	}
}

export interface TowerAssetProperties {
	icon: string; // In level
	art: string; // In power picker popup
}