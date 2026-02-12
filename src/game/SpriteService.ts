import THREE from "three";
import { Main } from "../core/Main"
import { LoaderService } from "../core/LoaderService";
import { SpriteAsset } from "../environment/assets/SpriteAsset";

export class SpriteService {
	/**
	 * Core
	 * */
	main: Main;
	spriteSheets: Record<string, SpriteSheet | Promise<SpriteSheet>> = {};
	vertexShader: string;
	fragmentShader: string;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Sources or creates a SpriteSheet
	 */
	async sourceSpriteSheet(assetName: string, assetClass: typeof SpriteAsset) {
		const cols = assetClass.ShaderMaterialProperties.uniforms.uFrameCols.value;
		const rows = assetClass.ShaderMaterialProperties.uniforms.uFrameRows.value;
		const frames = cols * rows;

		// If the spritesheet exists and is still loading, return the Promise, else create it
		if (this.spriteSheets[assetName]) {
			if (this.spriteSheets[assetName] instanceof Promise) {
				return await this.spriteSheets[assetName];
			} else return this.spriteSheets[assetName];
		} else {
			this.spriteSheets[assetName] = this.createSpriteSheet(assetName, assetClass.assetProperties.assetPath, cols, rows, frames);
			return await this.spriteSheets[assetName];
		}
	}

	/**
	 * Creates a SpriteSheet
	 */
	async createSpriteSheet(assetName: string, path: string, sheetCols: number, sheetRows: number, sheetFrames: number) {
		if (!this.vertexShader) this.createVertexShader();
		if (!this.fragmentShader) this.createFragmentShader();

		const spriteSheet = new SpriteSheet(this.main, assetName, path, new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), sheetCols, sheetRows, sheetFrames, this);
		await spriteSheet.setup();
		this.spriteSheets[assetName] = spriteSheet;

		return spriteSheet;
	}

	/**
	 * Removes a spritesheet
	 */
	removeSpriteSheet(assetName: string) {
		delete this.spriteSheets[assetName];
	}

	/**
	 * Gets SpriteSheets by name
	 */
	getSpriteSheet(name: string) {
		return this.spriteSheets[name];
	}

	/**
	 * Create spritesheet Shaders
	 */
	createVertexShader() {
		this.vertexShader = `
			attribute float animationRow;
			attribute float cellsInRow;
			attribute float animationSpeed;
			attribute float animationTimeOffset;
			attribute float mirrorX;
			
			varying vec2 vUv;
			varying vec3 vInstanceColour;
			varying float vMirrorX;
			
			uniform float uTime;
			uniform float uFrameCols;
			uniform float uFrameRows;

			void main() {
				vInstanceColour = instanceColor;
				vMirrorX = mirrorX;

				float col = 0.0;
				float row = animationRow;

				// Dead Code Elimination - only animate sprites that need it
				#if USE_ANIMATION == 1
					float staggeredTime = uTime + animationTimeOffset;
					float timeScaled = staggeredTime * animationSpeed;
					col = floor(mod(timeScaled, cellsInRow)) * step(1.1, cellsInRow);
				#endif

				if (mirrorX > 0.5) {
					col = (uFrameCols - 1.0) - col;
				}

				float frameWidth = 1.0 / uFrameCols;
				float frameHeight = 1.0 / uFrameRows;

				vUv.x = (uv.x + col) * frameWidth;
				vUv.y = (uv.y + (uFrameRows - 1.0 - row)) * frameHeight;

				#if BILLBOARD == 1
               // BILLBOARDING LOGIC: Faces camera
               vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
               float instanceScale = length(vec3(instanceMatrix[0].x, instanceMatrix[0].y, instanceMatrix[0].z));
               
               // Reconstruct the quad in view space (always facing front)
               mvPosition.xy += position.xy * instanceScale;
               gl_Position = projectionMatrix * mvPosition;
            #else
               // STANDARD LOGIC: Follows object/instance rotation
               vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
					float instanceScale = length(vec3(instanceMatrix[0].x, instanceMatrix[0].y, instanceMatrix[0].z));
               gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
            #endif
			}`;
	}

	createFragmentShader() {
		this.fragmentShader = `
			uniform sampler2D uMap;
			uniform vec3 uEnvironmentColour;

			varying vec2 vUv;
			varying vec3 vInstanceColour;
			varying float vMirrorX;

			void main() {
				vec2 uv = vUv;
				
				// Dead Code Elimination - only animate sprites that need it
				#if USE_ANIMATION == 1
						if (vMirrorX > 0.5) {
							float frameWidth = fract(vUv.x) == vUv.x ? 1.0 : 1.0 / floor(1.0 / fract(vUv.x));
							float frameStartX = floor(vUv.x / frameWidth) * frameWidth;
							float localU = (vUv.x - frameStartX) / frameWidth;
							uv.x = frameStartX + (1.0 - localU) * frameWidth;
						}
				#endif
				
				// Setup base colour
				vec4 color = texture2D(uMap, uv);
				color.rgb = pow(color.rgb, vec3(0.5));

				// Multiply the colour with any provided vInstanceColour
				color.rgb *= vInstanceColour;

				// Add lighting
				//vec3 envColor = vec3(1.1, 1.05, 0.9); // warm sunlight example
				//vec3 envColor = vec3(0.4, 0.45, 0.7); // moonlight
				color.rgb *= uEnvironmentColour;

				if (color.a < 0.1) discard;
				gl_FragColor = color;
			}`;
	}

	/**
	 * Creates a text sprite
	 * */
	makeTextSprite(message: string, config: TextSpriteConfig = { fontSizePx: 120, fontFamily: 'Arial', fontColour: 'white', bgColour: 'transparent' }) {
		const font = `${config.fontSizePx}px ${config.fontFamily}`;
		const color = config.fontColour;
		const bgColour = config.bgColour;

		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		(context as any).font = font;

		// Adjust canvas size to fit text
		const metrics = (context as any).measureText(message);
		canvas.width = metrics.width;
		canvas.height = parseInt(font);

		// Re-set context after resizing
		(context as any).font = font;
		(context as any).fillStyle = bgColour;
		(context as any).fillRect(0, 0, canvas.width, canvas.height);
		(context as any).fillStyle = color;
		(context as any).fillText(message, 0, canvas.height * 0.8);

		const texture = new THREE.CanvasTexture(canvas);
		const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
		const sprite = new THREE.Sprite(material);

		// Scale sprite based on canvas size
		sprite.scale.set(canvas.width / 100, canvas.height / 100, 1);

		return sprite;
	}
}

export class SpriteSheet {
	/**
	 * Setup properties
	 */
	assetName: string;
	texturePath: string;
	scale: THREE.Vector3;
	position: THREE.Vector3;
	sheetCols: number;
	sheetRows: number;
	totalFrames: number;
	spriteService: SpriteService;

	/**
	 * Live Properties
	 */
	main: Main;
	texture: THREE.Texture;
	sprite: THREE.Sprite;
	spriteMaterial: THREE.SpriteMaterial;

	/**
	 * Constructor
	 */
	constructor(main: Main, assetName: string, texturePath: string, scale: THREE.Vector3, position: THREE.Vector3, sheetCols: number, sheetRows: number, sheetFrames: number, spriteService: SpriteService) {
		this.main = main;
		this.assetName = assetName;
		this.texturePath = texturePath;
		this.scale = scale;
		this.position = position;
		this.sheetCols = sheetCols;
		this.sheetRows = sheetRows;
		this.totalFrames = sheetFrames;
		this.spriteService = spriteService;
	}

	/**
	 * Creates the sprite sheet
	 */
	async setup() {
		const sLoader: LoaderService = this.main.s('Loader');

		this.texture = await sLoader.loadTexture(this.texturePath);
		this.texture.colorSpace = THREE.SRGBColorSpace;
		this.texture.premultiplyAlpha = false;
		this.texture.wrapS = THREE.ClampToEdgeWrapping;
		this.texture.wrapT = THREE.ClampToEdgeWrapping;
		this.texture.magFilter = THREE.NearestFilter;
		//this.texture.minFilter = THREE.NearestFilter; // Too sharp, but removes the black line
		this.texture.minFilter = THREE.LinearMipMapLinearFilter; // smoother, but a black line to fix

		this.spriteMaterial = new THREE.SpriteMaterial({ map: this.texture });
		this.sprite = new THREE.Sprite(this.spriteMaterial);
		this.sprite.scale.set(this.scale.x, this.scale.y, this.scale.z);
		this.sprite.position.set(this.position.x, this.position.y, this.position.z);

		this.texture.repeat.set(1 / this.sheetCols, 1 / this.sheetRows);
	}

	/**
	 * Dispose
	 */
	dispose() {
		this.main.scene.remove(this.sprite);
		this.spriteMaterial.dispose();
		this.texture.dispose();
		this.spriteService.removeSpriteSheet(this.assetName);
	}
}

interface TextSpriteConfig {
	fontSizePx: number,
	fontFamily: string,
	fontColour: string,
	bgColour: string
}
