import * as THREE from 'three';
import { Main } from './Main';

export class LightingService {
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
	addAmbientLight(main: boolean = false, color: string = '#ffffff', intensity: number = 0.5) {
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
		position: THREE.Vector3 = new THREE.Vector3(40, 40, 40),
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
		light.threeLight.shadow.mapSize.width = 2048;
		light.threeLight.shadow.mapSize.height = 2048;
		(light.threeLight.shadow.camera as any).left = 250;
		(light.threeLight.shadow.camera as any).right = -250;
		(light.threeLight.shadow.camera as any).bottom = -250;
		(light.threeLight.shadow.camera as any).top = 250;
		(light.threeLight.shadow.camera as any).near = 0.5;
		(light.threeLight.shadow.camera as any).far = 250;
		//directionalLight.shadow.radius = 10; // Adds 'blur' to shadows
		//directionalLight.shadow.type = THREE.PCFSoftShadowMap;
		light.threeLight.shadow.normalBias = 0.03;
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

export class Light {
	isMain: boolean;
	threeLight: THREE.Light;
}
