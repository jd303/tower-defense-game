import * as THREE from 'three';
import { Main } from './Main';
import { Service } from './Service';

export class LightingService extends Service {
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
		super();

		this.main = main;
	}

	/**
	 * Adds an ambient light
	 * */
	createAmbientLight(name: string, color: string = '#ffffff', intensity: number = 0.5) {
		const ambientLight = new Light();
		const threeLight = new THREE.AmbientLight(color, intensity);
		ambientLight.threeLight = threeLight;
		ambientLight.name = name;
		ambientLight.threeLight.name = name;
		this.lights.push(ambientLight);

		return ambientLight;
	}

	/**
	 * Adds a directional light
	 * */
	createDirectionalLight(
		name: string,
		position: THREE.Vector3 = new THREE.Vector3(40, 40, 40),
		color: string = '#ffffff',
		intensity: number = 1.25
	) {
		const directionalLight = new Light();
		const threeLight = new THREE.DirectionalLight(color, intensity);
		directionalLight.threeLight = threeLight;
		directionalLight.name = name;
		directionalLight.threeLight.name = name;
		directionalLight.threeLight.position.set(position.x, position.y, position.z);
		this.lights.push(directionalLight);

		return directionalLight;
	}

	/**
	 * Adds a point light
	 * */
	createPointLight(
		name: string,
		position: THREE.Vector3 = new THREE.Vector3(0, 5, 0),
		color: string = '#ffffff',
		intensity: number = 1,
		distance: number = 10,
		decay: number = 0.5
	) {
		const pointLight = new Light();
		const threeLight = new THREE.PointLight(color, intensity, distance, decay);
		pointLight.threeLight = threeLight;
		pointLight.name = name;
		pointLight.threeLight.name = name;
		pointLight.threeLight.position.set(position.x, position.y, position.z);
		this.lights.push(pointLight);

		return pointLight;
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

		if (light.threeLight.shadow) {
			light.threeLight.shadow.mapSize.width = 4096;
			light.threeLight.shadow.mapSize.height = 4096;
			(light.threeLight.shadow.camera as any).left = 250;
			(light.threeLight.shadow.camera as any).right = -250;
			(light.threeLight.shadow.camera as any).bottom = -250;
			(light.threeLight.shadow.camera as any).top = 250;
			(light.threeLight.shadow.camera as any).near = 0.5;
			(light.threeLight.shadow.camera as any).far = 250;
			//light.threeLight.shadow.radius = 10; // Adds 'blur' to shadows
			//(light.threeLight.shadow as any).type = THREE.PCFSoftShadowMap;
			light.threeLight.shadow.normalBias = 0.4; // 0.03

		}
	}

	/**
	 * Stops a light casting shadows
	 * */
	removeShadowsFromLight(light: Light) {
		light.threeLight.castShadow = false;
	}

	/**
	 * Returns the main light
	 * */
	getLightByName(name: string) {
		return this.lights.find((light) => light.name == name);
	}

	/**
	 * Adds the light to the scene
	 * @param { string | Light } lightToEnable Name of the light as a string, or an actual light
	 * */
	enableLight(lightToEnable: string | Light) {
		let light = null;

		if (typeof (lightToEnable) == "string") {
			light = this.getLightByName(lightToEnable);
		} else if (lightToEnable instanceof Light) {
			light = lightToEnable;
		}

		if (light) this.main.scene.add(light.threeLight);
	}

	/**
	 * Removes the light to the scene
	 * */
	disableLight(name: string) {
		const light = this.getLightByName(name);
		if (light) this.main.scene.remove(light.threeLight);
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

	/**
	 * Disposes of all lights
	 */
	disposeAll() {
		this.lights.forEach(light => {
			this.main.scene.remove(light.threeLight);
			light.threeLight.dispose();
		});
		this.lights = [];
	}
}

export class Light {
	name: string;
	threeLight: THREE.Light;
}
