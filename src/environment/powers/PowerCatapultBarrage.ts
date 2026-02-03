import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Level } from '../../levels/Level';
import { Power } from './Power';
import { AssetGenerator } from '../assets/AssetGenerator';
import { SpriteAsset } from '../assets/SpriteAsset';
import { TickCallback, TickService, TickTimeProperties } from '../../core/TickService';
import { PowerStats } from '../Stats';
import { PowerCatapultBarrageRock } from './PowerCatapultBarrage_Rock';

export class PowerCatapultBarrage extends Power {
	/**
	 * Static properties
	 */
	static assetName = 'PowerCatapultBarrage';
	static buttonIcon = 'assets/models/powers/Power.CatapultBarrage.UI.icon.png';

	/**
	 * Unique properties for this Power
	 */
	launchTime: number;
	rocks: SpriteAsset[] = [];
	rockStartPositions: Record<string, any>[] = []; // { 0: { "travelPercent": 0.5, "speedAdjust": 0.1 } }

	/**
	 * Stats
	 */
	static stats = new PowerStats({
		cost: 10,
		damage: 3,
		radiusPrimary: 2.5,
		radiusSecondary: 5
	})

	/**
	 * Constructor
	 * */
	constructor(main: Main, level: Level, position: THREE.Vector3) {
		super(main, level, position);

		this.createCatapultBarrage();
	}

	/**
	 * Creates the catapult barrage
	 */
	async createCatapultBarrage() {
		const rockAssetName = 'PowerCatapultBarrageRock';
		const numberOfBoulders = 5;
		const startingHeight = 16;
		const startingLeft = -20;
		const startingHeightRandom = 6;
		const randomDist = 12;

		for (let x = 0; x < numberOfBoulders; x++) {
			const rock = await AssetGenerator.createSpriteAsset(rockAssetName, this.main) as SpriteAsset;
			this.rocks.push(rock);

			const startPosition = new THREE.Vector3();
			startPosition.set(this.position.x, this.position.y, this.position.z);
			const randomX = Math.random() * randomDist - randomDist / 2;
			const randomZ = Math.random() * randomDist - randomDist / 2;
			startPosition.y = startingHeight + Math.random() * startingHeightRandom;
			startPosition.x += randomX + startingLeft;
			startPosition.z += randomZ;

			const endPosition = startPosition.clone();
			endPosition.x = endPosition.x + (-1 * startingLeft);
			endPosition.y = 0;

			rock.registerOnLoadCallback(() => {
				rock.setInstancedMeshPosition(startPosition);
			});

			this.rockStartPositions.push({
				start: startPosition,
				end: endPosition,
				fallSpeed: 2 + (Math.random() * 3 - 1.5)
			});
		}

		const sTick: TickService = this.main.s('Tick');
		const callback = new TickCallback('animateCatapultBarrage', this.animate.bind(this));
		sTick.registerCallback(callback);
	}

	/**
	 * Animates the barrage
	 */
	animate(tickTimeProperties: TickTimeProperties) {
		if (!this.launchTime) this.launchTime = tickTimeProperties.elapsedTime;

		const elapsedTime = tickTimeProperties.elapsedTime - this.launchTime;
		const xTravelDuration = 2;

		this.rocks.forEach((rock, index) => {
			if (!rock.instancedMesh || !rock.instancedMesh.iMesh) return; // InstancedMesh load race condition blunt fix

			const rockPosition = rock.instancedMeshPosition;
			const startData = this.rockStartPositions[index];

			const tX = Math.min(1, elapsedTime / xTravelDuration);
			const easedTX = -(Math.cos(Math.PI * tX) - 1) / 2;

			const totalXDist = startData.end.x - startData.start.x;
			rockPosition.position.x = startData.start.x + (totalXDist * easedTX);

			const scaleAmount = Math.pow(elapsedTime, PowerCatapultBarrageRock.assetScale);
			rockPosition.scale.x = Math.min(PowerCatapultBarrageRock.assetScale, scaleAmount);

			const dropAmount = Math.pow(elapsedTime, 5.5) * startData.fallSpeed;
			rockPosition.position.y = Math.max(0, startData.start.y - dropAmount);

			rock.setInstancedMeshPosition(rockPosition.position);

			if (rockPosition.position.y <= 0) {
				this.resolveRockFall(index);
			}
		});
	}

	/*animate(tickTimeProperties: TickTimeProperties) {
	 if (!this.launchTime) this.launchTime = tickTimeProperties.elapsedTime;

	 const elapsedTime = tickTimeProperties.elapsedTime - this.launchTime;
	 const xTravelDuration = 1.5; 

	 this.rocks.forEach((rock, index) => {
		  const rockPosition = rock.instancedMeshPosition;
		  const startData = this.rockStartPositions[index];

		  // 1. Normalized time (0.0 to 1.0)
		  const tX = Math.min(1, elapsedTime / xTravelDuration);
		  
		  // 2. Ease In-Out Sine Curve
		  // This maps tX (0 to 1) to a smooth S-curve
		  const easedTX = -(Math.cos(Math.PI * tX) - 1) / 2;

		  // 3. Apply to X
		  const totalXDist = startData.end.x - startData.start.x;
		  rockPosition.position.x = startData.start.x + (totalXDist * easedTX);

		  // --- Keep your Y logic as is (usually gravity is just Ease-In) ---
		  const dropAmount = Math.pow(elapsedTime, 3.0) * startData.fallSpeed; 
		  rockPosition.position.y = Math.max(0, startData.start.y - dropAmount);

		  rock.setInstancedMeshPosition(rockPosition.position);

		  if (rockPosition.position.y <= 0) {
				this.resolveRockFall(index);
		  }
	 });
}*/

	/**
	 * When a rock falls to Y: 0
	 */
	resolveRockFall(rockIndex: number) {
		this.rockStartPositions.splice(rockIndex, 1);

		// IF this will be the last one, let's reset the sprite
		if (this.rocks.length == 1) {
			this.rocks[0].instancedMesh.resetIndexes();

			const sTick: TickService = this.main.s('Tick');
			sTick.deregisterCallback('animateCatapultBarrage');
		}

		// Instantiate
		const rock = this.rocks[rockIndex];

		// Then apply damage
		const creepsInShortRange = this.level.creepManager.findCreepsInRangeOf(rock.instancedMeshPosition.position, PowerCatapultBarrage.stats.activeStats.radiusPrimary!);
		let creepsInMidRange = this.level.creepManager.findCreepsInRangeOf(rock.instancedMeshPosition.position, PowerCatapultBarrage.stats.activeStats.radiusSecondary!);
		creepsInMidRange = creepsInMidRange.filter(midRangeCreep => !creepsInShortRange.find(shortRangeCreep => midRangeCreep == shortRangeCreep));
		creepsInShortRange.forEach(creep => creep.adjustHealthByNumber(-1 * Math.floor(PowerCatapultBarrage.stats.activeStats.damage!)));
		creepsInMidRange.forEach(creep => creep.adjustHealthByNumber(-1 * Math.floor(PowerCatapultBarrage.stats.activeStats.damage! / 3)));

		// The dispose
		this.rocks.splice(rockIndex, 1);
		if (!this.rocks.length) rock.dispose();
	}
}