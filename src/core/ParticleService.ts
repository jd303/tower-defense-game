import * as THREE from 'three';
import * as lil from 'lil-gui';
import { Main } from './Main';
import { TickService } from './TickService';

export class ParticleService {
	/**
	 * Properties
	 * */
	main: Main;
	lilGUI: lil.GUI;

	/**
	 * Systems
	 * */
	particleExperiences: ParticleExperience[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;

		const sTick: TickService = this.main.s('Tick');
		sTick.registerCallback(this.updateExperiences.bind(this));

		return this;
	}

	/**
	 * Creates an explosion particle system
	 * */
	createExplosion() {
		const particleExplosion = new ParticleExperienceExplosion(this.main);
		this.particleExperiences.push(particleExplosion);
	}

	/**
	 * Updated on tick
	 * */
	updateExperiences() {
		this.particleExperiences.forEach(experience => {
			if (experience.complete) this.removeExperience(experience);
			else experience.tickCallback();
		});
	}

	/**
	 * Cleans up the experience
	 * */
	removeExperience(experience: ParticleExperience) {
		this.main.scene.remove(experience.particles);
		this.particleExperiences = this.particleExperiences.filter(particleExperience => particleExperience !== experience); 
	}

	/**
	 * Debug particles
	 * */
	/*createDebugParticles() {
		const textureLoader = new THREE.TextureLoader();
		const particlesGeometry = new THREE.BufferGeometry();
		const particleCount = 500;
		const positions = new Float32Array(particleCount * 3); // 3 values (x|y|z) per vertex
		const colors = new Float32Array(particleCount * 3);
		for (let i = 0; i < particleCount; i++) {
			//positions[i] = (Math.random() - 0.5) * 10;
			positions[i] = 0;
			colors[i] = Math.random();
		}
		particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // Applies the geometry position attribute using a BufferAttribute
		particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // Applies the geometry color attribute using a BufferAttribute
		const particleMaterial = new THREE.PointsMaterial({
			size: 75,
			sizeAttenuation: true, // Points scale with distance from cam
			color: 'orange'
		});
		//particleMaterial.color = new THREE.Color('red'); // Affects the below (either blending or superceding?)
		particleMaterial.vertexColors = true; // Says to use the color property of particlesGeometry
		const particles = new THREE.Points(particlesGeometry, particleMaterial);
		this.main.scene.add(particles);

		const particleTexture = textureLoader.load('assets/particles/explosion_large.jpg');
		particleMaterial.transparent = true;
		particleMaterial.alphaMap = particleTexture;
		
		// Blending method (best?)
		particleMaterial.depthWrite = false;
		//particleMaterial.blending = THREE.NoBlending;
		particleMaterial.blending = THREE.NormalBlending;
		//particleMaterial.blending = THREE.AdditiveBlending; // Adds the particle to whatever is behind.  Sparkles, beautiful effects, but may have performance issues
		//particleMaterial.blending = THREE.SubtractiveBlending;
		//particleMaterial.blending = THREE.MultiplyBlending;

		// Create explosion directions
		const explosionSpeed = 0.05;
		const explosionDirections = Array(particleCount * 3);
		for (let i=0; i<particleCount; i++) {
			explosionDirections[i] = (1 - Math.random() * 2) * explosionSpeed;
			explosionDirections[i + 1] = (Math.random()) * explosionSpeed;
			explosionDirections[i + 2] = (1 - Math.random() * 2) * explosionSpeed;
		}

		const sTick: TickService = this.main.s('Tick');
		sTick.registerCallback(() => {
			for (let i = 0; i < particleCount; i++) {
				// EXAMPLE: SIN WAVE
				//const i3 = i * 3;
				//const x = particlesGeometry.attributes.position.array[i3];
				//particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);

				// EXAMPLE: Material Opacity
				particleMaterial.opacity -= 0.00005;

				// EXAMPLE: Explosion
				const i3 = i * 3;
				//const x = particlesGeometry.attributes.position.array[i3];
				(particlesGeometry.attributes.position.array[i3] as number) += explosionDirections[i3];
				(particlesGeometry.attributes.position.array[i3+1] as number) += explosionDirections[i3+1];
				(particlesGeometry.attributes.position.array[i3+2] as number) += explosionDirections[i3+2];

				// Update location
				particlesGeometry.attributes.position.needsUpdate = true;
			}
		});
	}*/
}

/**
 * Super Class for particle experiences
 * */
class ParticleExperience {

	/**
	 * System properties
	 * */
	main: Main;
	particles: THREE.Points;
	complete: boolean = false;

	/**
	 * Setup properties
	 * */
	texture: string;
	particleCount: number;
	positionType: ParticleSystemPositions;
	colorType: ParticleSystemColors;
	animationType: ParticleSystemAnimation;
	particleBlending: THREE.Blending;
	particleAttenuation: number;

	/**
	 * Live Properties
	 * */
	positions: Float32Array;
	colors: Float32Array;
	geometry: THREE.BufferGeometry;
	material: THREE.PointsMaterial;
	particleAnimations: Float32Array;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}
	
	/**
	 * Creates a set of positions for particles
	 * */
	createParticlePositionsAndColors() {
		this.positions = new Float32Array(this.particleCount * 3); // 3 values (x|y|z) per vertex
		this.colors = new Float32Array(this.particleCount * 4);

		for (let i = 0; i < this.particleCount; i++) {
			const i3 = i * 3;
			const i4 = i * 4;

			const positions = this.positionType instanceof Function ? this.positionType() : this.positionType;
			const colors = this.colorType instanceof Function ? this.colorType() : this.colorType;

			this.positions[i3] = positions.x;
			this.positions[i3+1] = positions.y;
			this.positions[i3+2] = positions.z;

			this.colors[i4] = colors.r;
			this.colors[i4+1] = colors.g;
			this.colors[i4+2] = colors.b;
			this.colors[i4+3] = colors.a;
		}
	}

	/**
	 * Creates a geometry and particle count
	 * */
	createParticleGeometry() {
		const particlesGeometry = new THREE.BufferGeometry();
		particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3)); // Applies the geometry position attribute using a BufferAttribute
		particlesGeometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 4)); // Applies the geometry color attribute using a BufferAttribute
		
		this.geometry = particlesGeometry;
	}

	/**
	 * Creates material for particle systems
	 * */
	createParticleMaterial() {
		const textureLoader = new THREE.TextureLoader();
		const particleMaterial = new THREE.PointsMaterial({
			size: 75,
			sizeAttenuation: true, // Points scale with distance from cam
			color: 'orange'
		});

		particleMaterial.vertexColors = true; // Says to use the color property of particlesGeometry
		const particleTexture = textureLoader.load(this.texture);
		particleMaterial.transparent = true;
		particleMaterial.alphaMap = particleTexture;
		
		// Stops particle graphics from creating alpha spots
		particleMaterial.depthWrite = false;

		// Blending Mode
		particleMaterial.blending = this.particleBlending;

		this.material = particleMaterial;
	}

	/**
	 * Gives each particle an animation direction
	 * NOTE: Currently creates a static animation: all particles have the same movement each frame
	 * */
	createParticleAnimation() {
		const particleAnimations = new Float32Array(this.particleCount * 3);

		for (let i=0; i<this.particleCount; i++) {
			const animationValues = this.animationType instanceof Function && this.animationType() || this.animationType;

			particleAnimations[i] = animationValues.x;
			particleAnimations[i + 1] = animationValues.y;
			particleAnimations[i + 2] = animationValues.z;
		}

		this.particleAnimations = particleAnimations;
	}

	/**
	 * Finalises and creates particles based on geometry and things
	 * */
	createParticles() {
		this.particles = new THREE.Points(this.geometry, this.material);
		this.main.scene.add(this.particles);
	}

	/**
	 * Called on Tick callback
	 * */
	tickCallback() {}

	/**
	 * Removes a particle
	 * */
	removeParticle(index: number) {
		this.positions = this.positions.slice(index, 3);
		this.colors = this.colors.slice(index, 4);

		this.particleCount -= 1;
	}
}

/**
 * A specific explosion animation
 * */
class ParticleExperienceExplosion extends ParticleExperience {

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main);

		this.texture = 'assets/particles/explosion_large.jpg';
		this.particleCount = 1000;
		this.positionType = ParticleSystemPositions.origin.value;
		this.colorType = ParticleSystemColors.explosionorange.value;
		this.animationType = ParticleSystemAnimation.explosion.value;
		this.particleBlending = THREE.NormalBlending;
		
		this.createParticlePositionsAndColors();
		this.createParticleGeometry();
		this.createParticleMaterial();
		this.createParticleAnimation();
		this.createParticles();

		return this;
	}

	/**
	 * Overwrites the tick callback
	 * */
	tickCallback(): void {
		for (let i = 0; i < this.particleCount; i++) {
			const i3 = i * 3;
			const i4 = i * 4;
			
			// Update particle positions
			(this.geometry.attributes.position.array[i3] as number) += this.particleAnimations[i3];
			(this.geometry.attributes.position.array[i3+1] as number) += this.particleAnimations[i3+1];
			(this.geometry.attributes.position.array[i3+2] as number) += this.particleAnimations[i3+2];

			// Recolour points
			(this.geometry.attributes.color.array[i4] as number) += 0.03;
			(this.geometry.attributes.color.array[i4+1] as number) += 0.03;
			(this.geometry.attributes.color.array[i4+2] as number) += 0.03;

			// Attenuate points
			(this.geometry.attributes.color.array[i4+3] as number) -= 0.03;
			if (this.geometry.attributes.color.array[i4+3] <= 0) this.removeParticle(i);

			// Update location
			this.geometry.attributes.position.needsUpdate = true;
			this.geometry.attributes.color.needsUpdate = true;
		}

		// Remove a random particle
		if (this.particleCount <= 0) this.complete = true;
	}
}

/**
 * ENUM: Allowed position types
 * */
class ParticleSystemPositions {
	static readonly origin  = new ParticleSystemPositions('ORIGIN', { x:0, y:0, z:0 });
 
	// private to disallow creating other instances of this type
	private constructor(private readonly key: string, public readonly value: any) {}
 
	toValue() {
		return this.key;
	}
}

/**
* ENUM: Allowed colors
* */
class ParticleSystemColors {
	static readonly default = new ParticleSystemColors('DEFAULT', { r: 0, g: 0, b: 0 });
	static readonly explosionorange = new ParticleSystemColors('EXPLOSION', { r: 0.2, g: 0.2, b: 0.2, a:1 });

	// Private to disallow creating other instances of this type
	private constructor(private readonly key: string, public readonly value: any) {}

	toValue() {
		return this.key;
	}
}

/**
* ENUM: Allowed animations
* */
class ParticleSystemAnimation {

	// Default values
	static speed_explosion: number = 0.1;

	// Enummables
	static readonly default = new ParticleSystemAnimation('DEFAULT', { x: 0, y: 0, z: 0 });
	static readonly explosion = new ParticleSystemAnimation('EXPLOSION', () => { return { x: (1 - Math.random() * 2) * this.speed_explosion, y: (Math.random()) * this.speed_explosion, z: (1 - Math.random() * 2) * this.speed_explosion } });

	// Private to disallow creating other instances of this type
	private constructor(private readonly key: string, public readonly value: any) {}

	toValue() {
		return this.key;
	}
}

interface ParticleSystem {
	geometry: THREE.BufferGeometry;
	material: THREE.PointsMaterial;
	positions: Float32Array;
	colors: Float32Array;
}
