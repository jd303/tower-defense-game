import THREE from "three";
import { Main } from "../core/Main"
import { LoaderService } from "../core/LoaderService";

export class SpriteService {
	/**
	 * Core
	 * */
	main: Main;
	spriteSheets: Record<string, SpriteSheet> = {};
	vertexShader: string;
	fragmentShader: string;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Creates a SpriteSheet
	 */
	async createSpriteSheet(assetName: string, path: string, sheetCols: number, sheetRows: number, sheetFrames: number) {
		if (!this.vertexShader) this.createVertexShader();
		if (!this.fragmentShader) this.createFragmentShader();

		const spriteSheet = new SpriteSheet(this.main, path, new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), sheetCols, sheetRows, sheetFrames, this);
		await spriteSheet.setup();
		this.spriteSheets[assetName] = spriteSheet;

		return spriteSheet;
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
        attribute float animationCol;
        attribute float animationRow;  // NEW: Per-instance row attribute
        attribute float mirrorX;       // NEW: Per-instance mirror flag (0.0 or 1.0)
        
        varying vec2 vUv;
        varying vec3 vInstanceColor;
        varying float vMirrorX;        // NEW: Pass mirror flag to fragment shader
        
        uniform float uFrameCols;
        uniform float uFrameRows;
        uniform float uSize;

        void main() {
            vInstanceColor = instanceColor;
            vMirrorX = mirrorX;  // NEW: Pass to fragment shader
            
            float frameWidth = 1.0 / uFrameCols;
            float frameHeight = 1.0 / uFrameRows;
            float col = mod(animationCol, uFrameCols);
            
            // NEW: Use the animationRow attribute instead of calculating from frame
            float row = animationRow;

            vUv.x = (uv.x + col) * frameWidth;
            vUv.y = (uv.y + (uFrameRows - 1.0 - row)) * frameHeight;

            vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            float instanceScale = length(vec3(instanceMatrix[0].x, instanceMatrix[0].y, instanceMatrix[0].z));
            
            mvPosition.xy += position.xy * instanceScale * uSize;
            
            gl_Position = projectionMatrix * mvPosition;
        }
    `;
	}
	createFragmentShader() {
		this.fragmentShader = `
        uniform sampler2D uMap;
        varying vec2 vUv;
        varying vec3 vInstanceColor;
        varying float vMirrorX;  // NEW: Receive mirror flag

        void main() {
            vec2 uv = vUv;
            
            // NEW: Mirror on X axis if flag is set
            if (vMirrorX > 0.5) {
                // Calculate the frame boundaries
                float frameWidth = fract(vUv.x) == vUv.x ? 1.0 : 1.0 / floor(1.0 / fract(vUv.x));
                float frameStartX = floor(vUv.x / frameWidth) * frameWidth;
                float frameEndX = frameStartX + frameWidth;
                
                // Mirror within the current frame
                float localU = (vUv.x - frameStartX) / frameWidth;
                localU = 1.0 - localU;
                uv.x = frameStartX + localU * frameWidth;
            }
            
            vec4 color = texture2D(uMap, uv);
            
            // Apply gamma correction to the texture
            color.rgb = pow(color.rgb, vec3(0.5));

            // Multiply texture by our instance color (tinting)
            color.rgb *= vInstanceColor;

            if (color.a < 0.1) discard;
            gl_FragColor = color;
        }
    `;
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
	spriteMaterial: THREE.SpriteMaterial;
	shaderMaterial: THREE.ShaderMaterial;

	constructor(main: Main, texturePath: string, scale: THREE.Vector3, position: THREE.Vector3, sheetCols: number, sheetRows: number, sheetFrames: number, spriteService: SpriteService) {
		this.main = main;
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

		this.spriteMaterial = new THREE.SpriteMaterial({ map: this.texture });
		const sprite = new THREE.Sprite(this.spriteMaterial);
		sprite.scale.set(this.scale.x, this.scale.y, this.scale.z);
		sprite.position.set(this.position.x, this.position.y, this.position.z);

		this.texture.repeat.set(1 / this.sheetCols, 1 / this.sheetRows);
	}
}

interface TextSpriteConfig {
	fontSizePx: number,
	fontFamily: string,
	fontColour: string,
	bgColour: string
}