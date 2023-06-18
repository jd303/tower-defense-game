import * as THREE from 'three';
import * as lil from 'lil-gui';
import { Main } from './Main';
import { TickCallback, TickService } from './TickService';

export class ParticleService {
	/**
	 * Properties
	 * */
	main: Main;
	lilGUI: lil.GUI;

	/**
	 * Systems
	 * */
	particleExperiences: ParticleExperience[] = []; // Particle Systems are 

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;

		return this;
	}

	/**
	 * Registers a particle experience, for animation
	 * */
	registerExperience(experience: ParticleExperience) {
		this.particleExperiences.push(experience);

		if (this.particleExperiences.length == 1) {
			const sTick: TickService = this.main.s('Tick');
			sTick.registerCallback(new TickCallback("ParticleExperienceUpdate", this.updateExperiences.bind(this)));
		}
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
		this.main.scene.remove(experience.group);
		this.particleExperiences = this.particleExperiences.filter(particleExperience => particleExperience !== experience);

		if (!this.particleExperiences.length) {
			const sTick: TickService = this.main.s('Tick');
			sTick.deregisterCallback("ParticleExperienceUpdate");
		}
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
export class ParticleExperience {

	/**
	 * System properties
	 * */
	main: Main;
	group: THREE.Group;
	particles: THREE.Points;
	complete: boolean = false;

	/**
	 * Setup properties
	 * */
	particleProperties: ParticleExperienceProperties;

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
	constructor(main: Main, particleProperties: ParticleExperienceProperties) {
		this.main = main;
		this.particleProperties = particleProperties;

		this.createParticlePositionsAndColors();
		this.createParticleGeometry();
		this.createParticleMaterial();
		this.createParticleAnimation();
		this.createParticles();

		// Create a containing group
		this.group = new THREE.Group();
		this.group.add(this.particles);
		this.group.position.x = this.particleProperties.position.x;
		this.group.position.y = this.particleProperties.position.y;
		this.group.position.z = this.particleProperties.position.z;
		this.main.scene.add(this.group);

		// Register itself with the Particle Service
		const sParticle = this.main.s('Particle');
		sParticle.registerExperience(this);
	}

	/**
	 * Creates a set of positions for particles
	 * */
	createParticlePositionsAndColors() {
		console.log(this.particleProperties.positionType);
		this.positions = new Float32Array(this.particleProperties.particleCount * 3); // 3 values (x|y|z) per vertex
		this.colors = new Float32Array(this.particleProperties.particleCount * 4);

		for (let i = 0; i < this.particleProperties.particleCount; i++) {
			const i3 = i * 3;
			const i4 = i * 4;

			const positions = this.particleProperties.positionType instanceof Function ? this.particleProperties.positionType() : this.particleProperties.positionType;
			const colors = this.particleProperties.colorType instanceof Function ? this.particleProperties.colorType() : this.particleProperties.colorType;

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
			size: this.particleProperties.pointSize,
			sizeAttenuation: this.particleProperties.pointSizeAttenuation, // Points scale with distance from cam
			color: this.particleProperties.pointColourStart
		});

		particleMaterial.vertexColors = true; // Says to use the color property of particlesGeometry
		const particleTexture = textureLoader.load(this.particleProperties.texture);
		particleMaterial.transparent = true;
		particleMaterial.alphaMap = particleTexture;
		
		// Stops particle graphics from creating alpha spots
		particleMaterial.depthWrite = false;

		// Blending Mode
		particleMaterial.blending = this.particleProperties.particleBlending;

		this.material = particleMaterial;
	}

	/**
	 * Gives each particle an animation direction
	 * Should be overwritten; defaults to random movement in the y axis
	 * */
	createParticleAnimation() {
		const particleAnimations = new Float32Array(this.particleProperties.particleCount * 3);

		for (let i=0; i<this.particleProperties.particleCount; i++) {
			particleAnimations[i] = 0;
			particleAnimations[i + 1] += Math.random() / 4;
			particleAnimations[i + 2] = 0;
		}

		this.particleAnimations = particleAnimations;
	}

	/**
	 * Finalises and creates particles based on geometry and things
	 * */
	createParticles() {
		this.particles = new THREE.Points(this.geometry, this.material);
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

		this.particleProperties.particleCount -= 1;
	}
}

export interface ParticleExperienceProperties {
	particleCount: number;
	pointColourStart: string;
	pointSize: number;
	pointSizeAttenuation: boolean;
	texture: string;
	positionType: ParticleSystemPositions;
	colorType: ParticleSystemColors;
	animationFunction: Function;
	particleBlending: THREE.Blending;
	particleAttenuation: number;
	position: THREE.Vector3;
}

/**
 * ENUM: Allowed position types
 * */
export class ParticleSystemPositions {
	static readonly default = new ParticleSystemPositions('DEFAULT', { x:0, y:0, z:0 });
 
	// private to disallow creating other instances of this type
	private constructor(private readonly key: string, public readonly value: any) {}
 
	toValue() {
		return this.key;
	}
}

/**
* ENUM: Allowed colors
* */
export class ParticleSystemColors {
	static readonly default = new ParticleSystemColors('DEFAULT', { r: 0, g: 0, b: 0 });
	static readonly explosionorange = new ParticleSystemColors('EXPLOSION', { r: 0.2, g: 0.2, b: 0.2, a:1 });

	// Private to disallow creating other instances of this type
	private constructor(private readonly key: string, public readonly value: any) {}

	toValue() {
		return this.key;
	}
}

export interface ParticleSystem {
	geometry: THREE.BufferGeometry;
	material: THREE.PointsMaterial;
	positions: Float32Array;
	colors: Float32Array;
}
