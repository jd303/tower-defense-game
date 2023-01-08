import * as THREE from 'three';
import { Main } from './core/Main';

export class LightingManager {
	/**
	 * System Properties
	 * */
	main: Main;

	/**
	 * Objects
	 * */
	lights: Light[] = [];
	lightHelpers: any[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Adds an ambient light
	 * */
	addAmbientLight(main: boolean = false, color: string = '#ffffff', intensity: number = 0.1) {
		const ambientLight = new Light();
		const threeLight = new THREE.AmbientLight(color, intensity);
		ambientLight.threeLight = threeLight;
		this.lights.push(ambientLight);
		this.main.scene.add(threeLight);

		if (main) ambientLight.isMain = true;
		return ambientLight;
	}

	/**
	 * Adds an ambient light
	 * */
	addDirectionalLight(
		main: boolean = false,
		position: THREE.Vector3 = new THREE.Vector3(0, 20, 30),
		color: string = '#ffffff',
		intensity: number = 1.25
	) {
		const directionalLight = new Light();
		const threeLight = new THREE.DirectionalLight(color, intensity);
		directionalLight.threeLight = threeLight;
		directionalLight.threeLight.position.set(position.x, position.y, position.z);
		this.lights.push(directionalLight);
		this.main.scene.add(threeLight);

		if (main) directionalLight.isMain = true;
		return directionalLight;
	}

	/**
	 * Shows Light Helpers
	 * */
	addLightHelpers() {
		this.lights.forEach((light) => {
			let helper;
			switch (true) {
				case light instanceof THREE.DirectionalLight:
					helper = new THREE.DirectionalLightHelper(light.threeLight as THREE.DirectionalLight, 5);
					this.main.scene.add(helper);
					break;
			}
		});
	}

	/**
	 * Makes a light cast shadows
	 * */
	addShadowsToLight(light: Light) {
		light.threeLight.castShadow = true;
		light.threeLight.shadow.mapSize.width = 1024;
		light.threeLight.shadow.mapSize.height = 1024;
		(light.threeLight.shadow.camera as any).left = 200;
		(light.threeLight.shadow.camera as any).right = -200;
		(light.threeLight.shadow.camera as any).bottom = -200;
		(light.threeLight.shadow.camera as any).top = 200;
		(light.threeLight.shadow.camera as any).near = 0.5;
		(light.threeLight.shadow.camera as any).far = 200;
		//directionalLight.shadow.radius = 10; // Adds 'blur' to shadows
		//directionalLight.shadow.type = THREE.PCFSoftShadowMap;
	}

	/**
	 * Returns the main light
	 * */
	getMainLight() {
		return this.lights.find((light) => light.isMain);
	}

	/**
	 * Remove Light Helpers
	 * */
	removeLightHelpers() {
		this.lightHelpers.forEach((lh) => {
			this.main.scene.remove(lh);
			this.lightHelpers = this.lightHelpers.filter((x) => x != lh);
		});
	}
}

class Light {
	isMain: boolean;
	threeLight: THREE.Light;
}
