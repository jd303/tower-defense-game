import THREE from "three";
import { Main } from "../../core/Main";
import { ParticleExperience, ParticleExperienceProperties, ParticleSystemColors, ParticleSystemPositions } from "../../core/ParticleService";

/**
 * A specific explosion animation
 * */
export class ParticleExperienceExplosionActive extends ParticleExperience {

	/**
	 * Stats
	 * */
	colorChange: number = 0.03;
	attenuation: number = 0.04;
	pointColourStart: string = 'orange';
	pointSize: number = 165;

	/**
	 * Constructor
	 * */
	constructor(main: Main, position: THREE.Vector3) {
		const speed_explosion = 0.02;

		const particleProperties: ParticleExperienceProperties = {
			particleCount: 25,
			pointColourStart: 'red',
			pointSize: 50,
			pointSizeAttenuation: true,
			texture: 'assets/particles/explosion_large.jpg',
			positionType: ParticleSystemPositions.default.value,
			colorType: ParticleSystemColors.explosionorange.value,
			animationFunction: () => { return { x: (0.5 - Math.random() * 1) * speed_explosion, y: 0, z: (0.5 - Math.random() * 1) * speed_explosion } },
			particleBlending: THREE.NormalBlending,
			particleAttenuation: 0,
			position: position
		}

		super(main, particleProperties);
		return this;
	}

	/**
	 * Gives each particle an animation direction
	 * NOTE: Currently creates a static animation: all particles have the same movement each frame
	 * */
	createParticleAnimation() {
		const particleAnimations = new Float32Array(this.particleProperties.particleCount * 3);

		for (let i=0; i<this.particleProperties.particleCount; i++) {
			const i3 = i * 3;
			const animationValues = this.particleProperties.animationFunction();

			particleAnimations[i3] = animationValues.x;
			particleAnimations[i3 + 1] = animationValues.y;
			particleAnimations[i3 + 2] = animationValues.z;
		}

		this.particleAnimations = particleAnimations;
	}

	/**
	 * Overwrites the tick callback
	 * */
	tickCallback(): void {
		for (let i = 0; i < this.particleProperties.particleCount; i++) {
			const i3 = i * 3;
			const i4 = i * 4;
			
			// Update particle positions
			(this.geometry.attributes.position.array[i3] as number) += this.particleAnimations[i3];
			(this.geometry.attributes.position.array[i3+1] as number) += this.particleAnimations[i3+1];
			(this.geometry.attributes.position.array[i3+2] as number) += this.particleAnimations[i3+2];
			//(this.geometry.attributes.size.array[i3] as number) += 5;

			// Recolour points
			(this.geometry.attributes.color.array[i4] as number) += this.colorChange;
			(this.geometry.attributes.color.array[i4+1] as number) += this.colorChange;
			(this.geometry.attributes.color.array[i4+2] as number) += this.colorChange;

			// Attenuate points
			(this.geometry.attributes.color.array[i4+3] as number) -= this.attenuation;
			if (this.geometry.attributes.color.array[i4+3] <= 0) this.removeParticle(i);

			// Update location
			this.geometry.attributes.position.needsUpdate = true;
			this.geometry.attributes.color.needsUpdate = true;

			this.material.size -= 0.002;
		}

		// Remove a random particle
		if (this.particleProperties.particleCount <= 0) this.complete = true;
	}
}

/**
 * A specific explosion animation
 * */
export class ParticleExperienceExplosionPassive extends ParticleExperience {

	/**
	 * Stats
	 * */
	colorChange: number = 0.03;
	attenuation: number = 0.02;
	pointColourStart: string = 'orange';
	pointSize: number = 165;

	/**
	 * Constructor
	 * */
	constructor(main: Main, position: THREE.Vector3) {
		const speed_explosion = 0.03;
		const speed_explosion_y = 0.1;

		const particleProperties: ParticleExperienceProperties = {
			particleCount: 25,
			pointColourStart: 'orange',
			pointSize: 150,
			pointSizeAttenuation: true,
			texture: 'assets/particles/explosion_large.jpg',
			positionType: ParticleSystemPositions.default.value,
			colorType: ParticleSystemColors.explosionorange.value,
			animationFunction: () => { return { x: (2 - Math.random() * 4) * speed_explosion, y: Math.abs((Math.random()) * speed_explosion_y), z: (2 - Math.random() * 4) * speed_explosion } },
			//animationFunction: () => { return { x: 0, y: Math.abs((Math.random()) * speed_explosion_y), z: 0 } },
			particleBlending: THREE.NormalBlending,
			particleAttenuation: 0,
			position: position
		}

		super(main, particleProperties);
		return this;
	}

	/**
	 * Gives each particle an animation direction
	 * NOTE: Currently creates a static animation: all particles have the same movement each frame
	 * */
	createParticleAnimation() {
		const particleAnimations = new Float32Array(this.particleProperties.particleCount * 3);

		for (let i=0; i<this.particleProperties.particleCount; i++) {
			const i3 = i * 3;
			const animationValues = this.particleProperties.animationFunction();

			particleAnimations[i3] = animationValues.x;
			particleAnimations[i3 + 1] = animationValues.y;
			particleAnimations[i3 + 2] = animationValues.z;
		}

		this.particleAnimations = particleAnimations;
	}

	/**
	 * Overwrites the tick callback
	 * */
	tickCallback(): void {
		for (let i = 0; i < this.particleProperties.particleCount; i++) {
			const i3 = i * 3;
			const i4 = i * 4;
			
			// Update particle positions
			(this.geometry.attributes.position.array[i3] as number) += this.particleAnimations[i3];
			(this.geometry.attributes.position.array[i3+1] as number) += this.particleAnimations[i3+1];
			(this.geometry.attributes.position.array[i3+2] as number) += this.particleAnimations[i3+2];

			// Recolour points
			(this.geometry.attributes.color.array[i4] as number) += this.colorChange;
			(this.geometry.attributes.color.array[i4+1] as number) += this.colorChange;
			(this.geometry.attributes.color.array[i4+2] as number) += this.colorChange;

			// Attenuate points
			(this.geometry.attributes.color.array[i4+3] as number) -= this.attenuation;
			if (this.geometry.attributes.color.array[i4+3] <= 0) this.removeParticle(i);

			// Update location
			this.geometry.attributes.position.needsUpdate = true;
			this.geometry.attributes.color.needsUpdate = true;
		}

		// Remove a random particle
		if (this.particleProperties.particleCount <= 0) this.complete = true;
	}
}