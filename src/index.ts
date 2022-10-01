import './style.css';
import { Main } from './core/Main';

/**
 * Configuration
 * */
const canvas = document.querySelector('#main-canvas') as HTMLCanvasElement;
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};
const debugMode = true;

/**
 * SETUP
 * */
const main = new Main(canvas, sizes, debugMode);
main.createMainCamera({
	perspective: true,
	fov: 50,
	near: 0.1,
	far: 250,
	sizes,
});
main.setupWindowSize();

// Load a scene
main.levelManager.loadScene('Level_0_MVP');
