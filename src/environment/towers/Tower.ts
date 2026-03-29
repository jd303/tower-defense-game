import THREE from 'three';
import { Main } from '../../core/Main';
import { TickTimeProperties } from '../../core/TickService';
import { StateMachine } from '../../core/StateMachine';
import { TowerStates, TowerTransitions } from './TowerStates';
import { Projectile, ProjectileHitTypes } from '../projectiles/Projectile';
import { PositionService } from '../PositionService';
import { Creep } from '../creeps/Creep';
import { InteractableOrders, InteractableTypes } from '../../game/InteractionService2';
import { CharacterAsset } from '../assets/CharacterAsset';
import { ShaderAnimationAttributes, SpriteAssetProperties, SpriteSheetRow } from '../assets/SpriteAsset';
import { StatBlockCharacter } from '../Stats';


// Maybe split CharacterAsset out into TowerAsset as well, for this?
export abstract class Tower extends CharacterAsset {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Static values
	 */
	static stats: StatBlockCharacter;
	static towerProperties: TowerAssetProperties;
	static cost: number;
	static towerZoneWidth: number; // Determines how many zone placement tiles the tower blocks
	static instancedMeshInstanceCount: number = 25;
	static instancedMeshAnimates: boolean = true;

	/**
	 * Status
	 */
	interactiveTypeName: InteractableTypes = "tower";

	/**
	 * Objects
	 * */
	abstract projectileOriginY: number;
	projectiles: Projectile[] = [];
	projectileStubs: THREE.Group[] = []; // Stores any misfired stubs
	projectileStubTimeouts: ReturnType<typeof setTimeout>[] = []; // Stores timeouts for misfired stubs

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
		this.setInteractive();

		setTimeout(() => {
			this.stateMachine.transition(TowerStates.scanning);
		}, 1000);
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
				onEnter: this.stateEnterScanning.bind(this),
			},
			{
				name: TowerStates.attacking,
				onEnter: this.stateEnterAttacking.bind(this),
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
	 * Animate
	 * */
	animate(timeProperties: TickTimeProperties) {
		const position = this.groupMain.position;

		if (this.readyToPerformScan(timeProperties)) {
			const sPosition: PositionService = this.main.s('Position');
			const creepsInRange = sPosition.getCreepsInRadiusFromPosition(position, this.stats.activeStats.attack!.range!);

			// If we have a target
			if (creepsInRange.length) {
				const isAccurate = Math.random() < this.stats.activeStats.attack!.accuracy;

				const activeProjectile = new this.stats.activeStats.projectile!.projectile({
					main: this.main,
					tower: this,
					startingPoint: new THREE.Vector3(this.groupMain.position.x, this.projectileOriginY, this.groupMain.position.z),
					target: creepsInRange[0],
					isAccurate: isAccurate,
					hitType: this.stats.activeStats.projectile!.hitType,
					projectileAsset: this.stats.activeStats.projectile!.effect,
					projectileFlightDuration: this.stats.activeStats.projectile!.flightDuration,
				});

				this.projectiles.push(activeProjectile);

				// Set to attacking mode, and reset to scanning
				this.stateMachine.transition(TowerTransitions.attacking);
				setTimeout(() => {
					this.stateMachine.transition(TowerTransitions.scanning);
				}, this.stats.activeStats.attack?.duration);
			}
		}

		// Animate Projectiles
		this.projectiles.forEach((projectile) => projectile.animate(timeProperties));
	}

	/**
	 * Determines if the tower is ready to perform a scan
	 */
	readyToPerformScan(timeProperties: TickTimeProperties) {
		return timeProperties.isTickHalfSecond && this.stateMachine.isInState(TowerStates.scanning);
	}

	/**
	 * Resolve a hit
	 * */
	resolveHit(projectile: Projectile) {
		const sPositioning: PositionService = this.main.s('Position');
		let targets: Creep[] = [];

		switch (projectile.hitType) {
			case ProjectileHitTypes.direct:
			case ProjectileHitTypes.ricochet:
				projectile.target.resolveAttack(this.stats.activeStats.attack!);
				break;
			case ProjectileHitTypes.splash:
				targets = sPositioning.getCreepsInRadiusFromPosition(projectile.projectileGroup.position, this.stats.activeStats.projectile!.splashRadius);
				targets.forEach(creep => creep.resolveAttack(this.stats.activeStats.attack!));
				break;
		}
	}

	/**
	 * State enter
	 */
	stateEnterScanning() {
		this.spriteSheetFrameManager.changeAnimation("scanning");
	}
	stateEnterAttacking() {
		this.spriteSheetFrameManager.changeAnimation("attacking");
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
		this.projectiles.forEach(projectile => projectile.dispose());
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