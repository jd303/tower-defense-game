import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Level } from '../../levels/Level';
import { Power, PowerCommons } from './Power';
import { TickCallback, TickService, TickTimeProperties } from '../../core/TickService';
import { PathService } from '../../game/PathService';
import { PowerStats } from '../Stats';
import { PositionService } from '../PositionService';

export class PowerSpringDoorTrap extends Power {
	/**
	 * Static properties
	 */
	static powerProperties = {
		assetName: 'PowerSpringDoorTrap',
		icon: 'assets/powers/springDoorTrap/Power.SpringDoorTrap.UI.icon.png',
		art: ''
	}
	static radiusOfEffect = 8;

	/**
	 * Unique properties for this Power
	 */
	launchTime: number;
	growingMesh: THREE.Mesh;
	shrinkingMesh: THREE.Mesh;

	/**
	 * Stats
	 */
	static stats = new PowerStats({
		cost: 10,
		radiusPrimary: 8
	})

	/**
	 * Constructor
	 * */
	constructor(main: Main, level: Level, position: THREE.Vector3) {
		super(main, level, position);

		this.createSpringDoorTraps();
	}

	/**
	 * Creates the catapult barrage
	 */
	async createSpringDoorTraps() {
		console.log("We lob some encouragement at towers");

		this.growingMesh = PowerCommons.activityCircle(PowerSpringDoorTrap.radiusOfEffect, 0.25);
		this.growingMesh.position.set(this.position.x, this.position.y + 2, this.position.z);
		this.growingMesh.scale.set(0.7, 0.7, 0.7);

		this.shrinkingMesh = PowerCommons.activityCircle(PowerSpringDoorTrap.radiusOfEffect, 0.25);
		this.shrinkingMesh.position.set(this.position.x, this.position.y + 2, this.position.z);
		this.shrinkingMesh.scale.set(1.2, 1.2, 1.2);

		PowerCommons.activityCircleMaterial.color = new THREE.Color(0x6F27D8);
		PowerCommons.activityCircleMaterial.transparent = true;
		PowerCommons.activityCircleMaterial.opacity = 0.65;

		// Add them
		this.main.scene.add(this.growingMesh);
		this.main.scene.add(this.shrinkingMesh);

		// Animate them
		const sTick: TickService = this.main.s('Tick');
		const callback = new TickCallback('animateTimeMotivation', this.animate.bind(this));
		sTick.registerCallback(callback);

		setTimeout(() => {
			sTick.deregisterCallback('animateTimeMotivation');
			this.main.scene.remove(this.growingMesh);
			this.main.scene.remove(this.shrinkingMesh);

			PowerCommons.activityCircleMaterial.color = new THREE.Color(0x4298B5);
			PowerCommons.activityCircleMaterial.transparent = false;
			PowerCommons.activityCircleMaterial.opacity = 1;
		}, 1500);

		// Determine which creeps were affected
		const sPosition: PositionService = this.main.s('Position');
		const creepsAffected = sPosition.getCreepsInRadiusFromPosition(this.position, PowerSpringDoorTrap.radiusOfEffect);

		const sPath: PathService = this.main.s('Path');
		creepsAffected.forEach(creep => {
			// Give them a boost of speed
			creep.stats.addModifier('spring-bounce', { movement: { speed: 35 } });

			// Setup movement path points
			const bouncePathStart = creep.groupMain.position.clone();
			const bouncePathStartCP1 = creep.groupMain.position.clone();
			const bouncePathStartPoint = {
				incomingControlPoint: bouncePathStartCP1,
				point: bouncePathStart,
				outgoingControlPoint: bouncePathStartCP1
			}
			const bouncePathEnd = creep.getExpectedPositionAt(-4000);
			const bouncePathEndCP1 = bouncePathEnd.clone();
			const bouncePathEndPoint = {
				incomingControlPoint: bouncePathEndCP1,
				point: bouncePathEnd,
				outgoingControlPoint: bouncePathEndCP1
			}
			const bounceMidCP1 = new THREE.Vector3(bouncePathStart.x, bouncePathStart.y + 10, bouncePathStart.z);
			const bouncePathMid = new THREE.Vector3(bouncePathStart.x + (bouncePathEnd.x - bouncePathStart.x) / 2, bouncePathStart.y + (bouncePathEnd.y - bouncePathStart.y) / 2 + 10, bouncePathStart.z + (bouncePathEnd.z - bouncePathStart.z) / 2);
			const bounceMidCP2 = new THREE.Vector3(bouncePathEnd.x, bouncePathEnd.y + 10, bouncePathEnd.z);
			const bouncePathMidPoint = {
				incomingControlPoint: bounceMidCP1,
				point: bouncePathMid,
				outgoingControlPoint: bounceMidCP2
			}

			// Create a new movePath for the creep, and remove the buffs after doing so
			const bouncePath = sPath.createMovePath('spring-bounce', [bouncePathStartPoint, bouncePathMidPoint, bouncePathEndPoint]);
			bouncePath.callbackOnComplete = [() => {
				creep.stats.removeModifier('spring-bounce');
			}];

			// Resolve
			if (creep.movePathManager.activePath) {
				creep.movePathManager.activePath.pathProgress = Math.max(0, creep.movePathManager.activePath.pathProgress - 0.015);
			}
			creep.movePathManager.addPath(bouncePath);
			creep.movePathManager.setActivePath('spring-bounce', true);
		});
	}

	/**
	 * Animates the barrage
	 */
	animate(tickTimeProperties: TickTimeProperties) {
		if (!this.launchTime) this.launchTime = tickTimeProperties.elapsedTime;

		const elapsedTime = tickTimeProperties.elapsedTime - this.launchTime;

		// CONFIGURATION
		const duration = 1.45;       // Total time for the effect
		const frequency = 2.5;       // How fast it wobbles
		const decayConstant = 2.0;  // How fast the wobbling dies down
		const initialOffset = 0.15;  // Difference from 1.0 (1.3 and 0.7)

		// 1. Normalized progress (0 to 1)
		const t = Math.min(1, elapsedTime / duration);

		if (t < 1) {
			const damping = Math.exp(-decayConstant * t) * (1 - t);
			const wave = Math.sin(elapsedTime * frequency);
			const currentOffset = initialOffset * damping * wave;
			const sScale = 1 + currentOffset;
			this.shrinkingMesh.scale.set(sScale, sScale, sScale);
			const gScale = 1 - currentOffset;
			this.growingMesh.scale.set(gScale, gScale, gScale);
		}
	}
}