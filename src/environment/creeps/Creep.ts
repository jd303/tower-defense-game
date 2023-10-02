import * as THREE from 'three';
import { Main } from '../../core/Main';
import { StateMachine, StateMachineEvents } from '../../core/StateMachine';
import { TickTimeProperties } from '../../core/TickService';
import { MovePathDefinition } from '../../data/PathInterfaces';
import { ModelAsset, ModelCommons } from '../ModelAsset';
import { CreepStates, CreepTransitions } from './CreepStates';
import { CreepStats } from './CreepStats';
import { TowerAttackStats } from '../towers/TowerStats';
import { InteractionService } from '../../game/InteractionService';
import { Hero } from '../heroes/Hero';
import { HeroAttackStats } from '../heroes/HeroStats';

export class Creep extends ModelAsset {
	/**
	 * Stats
	 * */
	stats: CreepStats;

	/**
	 * Three Assets
	 * */
	groupMain: THREE.Group; // Outermost group - transforms the whole model
	groupTransforms: THREE.Group; // Inner group - applies minor transformations
	groupModel: THREE.Group; // Innermost group - applies status transforms
	mesh: THREE.Mesh;

	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Status
	 * */
	states: CreepStates;
	stateMachine: StateMachine;

	/**
	 * Combat and Interception
	 * */
	intercepter: Hero | null = null;

	/**
	 * Health bar
	 * */
	healthBar: THREE.Group | null;
	healthBarGroupName: string = 'healthbargroup';
	healthBarName: string = 'healthbar';
	healthBarY: number = 1;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);
		
		this.stateMachine = this.setDefaultStates();
		this.stateMachine.transition(CreepStates.pathmoving);

		this.setInteractive();
	}

	/**
	 * Sets default States for creeps
	 * */
	setDefaultStates() {
		const stateMachine = new StateMachine(this.main);

		stateMachine.addStates([
			{
				name: CreepStates.idle,
			},
			{
				name: CreepStates.pathmoving,
			},
			{
				name: CreepStates.interceptedmoving
			},
			{
				name: CreepStates.hurting,
				autoTransition: StateMachineEvents.Stop,
				autoTransitionTimeMS: 1000,
			},
			{
				name: CreepStates.hurt,
			},
			{
				name: CreepStates.healing,
				autoTransition: StateMachineEvents.Stop,
				autoTransitionTimeMS: 1500,
				onEnter: this.stateEnterHealing.bind(this),
				onExit: this.stateExitHealing.bind(this)
			},
			{
				name: CreepStates.activatingStandingPower,
				onEnter: this.activateStandingPower.bind(this),
			},
		]);

		stateMachine.addTransitions([
			{
				name: CreepTransitions.pause,
				activatedStates: [CreepStates.idle],
				deactivatedStates: [CreepStates.pathmoving, CreepStates.activatingStandingPower],
			},
			{
				name: CreepTransitions.unpause,
				activatedStates: [CreepStates.pathmoving],
				deactivatedStates: [CreepStates.idle],
			},
			{
				name: CreepTransitions.pathmoving,
				activatedStates: [CreepStates.pathmoving],
				deactivatedStates: [CreepStates.intercepted]
			},
			{
				name: CreepTransitions.stop,
				deactivatedStates: [CreepStates.pathmoving],
			},
			{
				name: CreepTransitions.took_damage,
				activatedStates: [CreepStates.hurting, CreepStates.hurt],
			},
			{
				name: CreepTransitions.activating_standing_power,
				activatedStates: [CreepStates.activatingStandingPower],
				deactivatedStates: [CreepStates.pathmoving],
			},
			{
				name: CreepTransitions.full_heal,
				deactivatedStates: [CreepStates.hurt],
			},
			{
				name: CreepTransitions.healed,
				activatedStates: [CreepStates.healing],
				deactivatedStates: [CreepStates.hurt, CreepStates.hurting],
			},
			{
				name: CreepTransitions.intercepted,
				activatedStates: [CreepStates.intercepted, CreepStates.interceptedmoving],
				deactivatedStates: [CreepStates.pathmoving, CreepStates.activatingStandingPower, CreepStates.activatingMovingPower],
			},
		]);

		return stateMachine;
	}

	/**
	 * Resolves when a creep was attacked
	 * */
	resolveAttack(attack: TowerAttackStats | HeroAttackStats) {
		// Check any weaknesses or resistances, such as resistance to magic damage

		// Adjust the creeps's health by this damage
		const damage = this.stats.calculateDamage(attack.damage, attack.damageType)
		this.adjustHealthByNumber(-1 * damage);
	}

	/**
	 * Changes a Creep's health
	 * @param { number } difference Positive or negative number to adjust the creeps' health
	 * */
	adjustHealthByNumber(difference: number) {
		const minHealth = Math.max(0, this.stats.hp_current + difference);
		const maxHealth = Math.min(this.stats.hp_total, minHealth);
		this.stats.hp_current = maxHealth;

		this.checkHealthStatus();
	}

	/**
	 * Sets a Creep's health to a percentage
	 * @param { number } percentage Percentage of health to set
	 * */
	setHealthByPercentage(percentage: number) {
		this.stats.hp_current = this.stats.hp_total * percentage / 100;

		this.checkHealthStatus();
	}

	/**
	 * Checks the health status and orgnaises health bars
	 * */
	checkHealthStatus() {

		switch (true) {

			// The Creep has died
			case this.stats.hp_current <= 0:
				this.killCreep();
				break;

			// The Creep has full health
			case this.stats.hp_current >= this.stats.hp_total:
				this.removeHealthBar();
				break;

			// The Creep has lost some health
			default:
				if (!this.healthBar) this.createHealthBar();
				else this.updateHealthBar();
	
				this.stateMachine.transition(CreepTransitions.took_damage);
				break;
			}
	}

	/**
	 * Combat and Interception
	 * */
	setIntercepted(byWhom: Hero) {
		this.intercepter = byWhom;
		this.stats.movement.speed += this.stats.movement.interception_modifier;
		this.stateMachine.transition(CreepTransitions.intercepted);
		console.log("I got intercepted", this);
	}
	setDisintercepted(byWhom: Hero) {
		console.log("I got disintercepted", this);
		if (this.intercepter == byWhom) {
			this.intercepter = null;
			this.stats.movement.speed -= this.stats.movement.interception_modifier;
			this.movePathManager.rejoinCorePath();
			this.stateMachine.transition(CreepTransitions.pathmoving);
		}
	}

	/**
	 * A creep has died
	 * */
	killCreep() {
		const rewards = this.stats.kill_rewards;
		const newValue = this.main.s('Economy').adjustEconomyValue(rewards.economic_property, rewards.value);
		this.main.s('Event').fire('commerce_money_changed', newValue);
		if (this.intercepter) this.intercepter.removeInterceptee(this);
		this.deleteCreep();
	}

	/**
	 * A creep has escaped their path / beaten the player
	 * */
	creepEscaped() {
		const sLevel = this.main.s('Level');
		sLevel.currentLevel.creepEscaped(this);
		this.deleteCreep();
	}

	/**
	 * Final deletions of Creeps
	 * */
	deleteCreep() {
		this.stateMachine.remove();
		this.main.s('Level').currentLevel.removeCreep(this);
		this.main.s('Interaction').deregisterDefaultTarget(this);
	}

	/**
	 * Creates a health bar for this creep
	 * */
	createHealthBar() {
		const barBG = ModelCommons.healthBarGeometry;
		const barFG = ModelCommons.healthBarGeometry;
		barBG.setAttribute( 'position', new THREE.BufferAttribute( ModelCommons.healthBarVertices, 3 ) );
		const healthBarGroup = new THREE.Group();
		const bgMesh = new THREE.Mesh(barBG, ModelCommons.healthBarBGMaterial);
		const fgMesh = new THREE.Mesh(barFG, ModelCommons.healthBarFGMaterial);
		fgMesh.name = this.healthBarName;
		healthBarGroup.name = this.healthBarGroupName;
		healthBarGroup.add(bgMesh);
		healthBarGroup.add(fgMesh);
		healthBarGroup.position.y = this.healthBarY;
		healthBarGroup.position.z = 1;
		this.healthBar = healthBarGroup;
		this.groupTransforms.add(healthBarGroup);

		this.updateHealthBar();
	}

	/**
	 * Updates the health bar
	 * */
	updateHealthBar() {
		const healthBarGroup = this.groupTransforms.getObjectByName(this.healthBarGroupName);
		healthBarGroup!.scale.x = this.stats.hp_current / this.stats.hp_total;
		//healthBarGroup!.position.x = (this.stats.hp_current / this.stats.hp_total) - 1; // left aligned
		healthBarGroup!.position.x = 0;
	}

	/**
	 * Removes a health bar if one exists
	 * */
	removeHealthBar() {
		if (this.healthBar) {
			this.groupTransforms.remove(this.healthBar);
			this.healthBar = null;
		}
	}

	/**
	 * Animation
	 * */
	animateCore(timeProperties: TickTimeProperties) {
		const states = this.stateMachine.activeStates;

		if (states.has(CreepStates.pathmoving) || states.has(CreepStates.interceptedmoving)) {
			this.animationMove(timeProperties);
		}

		if (states.has(CreepStates.hurting)) {
			this.animationHurtMe(timeProperties);
		}

		if (states.has(CreepStates.healing)) {
			this.animationHealing();
		}

		this.animate(timeProperties);
	}

	/**
	 * Overridden functions
	 * */
	animate(timeProperties: TickTimeProperties) {}

	/**
	 * Resolves what happens at the end of a path
	 * */
	finaliseEndOfPath(): void {
		if (this.movePathManager.activePath!.id == 'core') {
			this.creepEscaped();
		} else {
			this.movePathManager.completeActivePath();
		}
	}

	/**
	 * When the Creep is healed
	 * */
	stateEnterHealing() {
		const healingAnimationGroup = new THREE.Group();

		this.stateExitHealing();

		for (let x=0; x<4; x++) {
			const thisCross = ModelCommons.healingCrossMesh();
			thisCross.position.x += Math.random() - 0.5;
			thisCross.position.y += Math.random();
			const scale = Math.random() * 0.9 + 0.1;
			thisCross.scale.set(scale, scale, scale);

			healingAnimationGroup.add(thisCross);
		}
		
		healingAnimationGroup.name = "HealingAnimation";

		this.groupMain.add(healingAnimationGroup);
		healingAnimationGroup.position.z = 2;
	}

	/**
	 * When the Creep leaves healing state (also called when entering, to clear it out)
	 * */
	stateExitHealing() {
		const healingAnimationGroup = this.groupMain.getObjectByName("HealingAnimation");
		if (healingAnimationGroup) this.groupMain.remove(healingAnimationGroup);
	}

	/**
	 * Enabled Shadows
	 * */
	enableShadows(cast: boolean = true, receive: boolean = false) {
		// THis should be replaced when moving to ModelAsset
		this.groupModel.children.forEach((child: any) => {
			if (child.isMesh) {
				if (cast) child.castShadow = true;
				//if (receive) child.receiveShadow = true;
				child.material.needsUpdate = true;
			}
		});
	}

	/**
	 * Creates a temporary healing animation
	 * */
	createHealingEffect() {
		console.log("%c Creating healing effect", "color: green");
	}

	/**
	 * Creep Powers
	 * */
	activateStandingPower() {}
	activateIdlePower() {}

	/**
	 ******************************************************* UI INTERACTIONS
	 * */
	defaultClick() {
		console.log("Default Click: Creep");
		const sInteraction: InteractionService = this.main.s('Interaction');
		sInteraction.setSelectionState(this, true);
	}

	select() {
		console.log("Add a selection graphic: CREEP");
	}

	deselect() {
		console.log("Remove the selection graphic: CREEP");
	}
}