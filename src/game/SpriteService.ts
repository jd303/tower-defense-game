import THREE from "three";
import { Main } from "../core/Main"

export class SpriteService {
	/**
	 * Core
	 * */
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
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

interface TextSpriteConfig {
	fontSizePx: number,
	fontFamily: string,
	fontColour: string,
	bgColour: string
}