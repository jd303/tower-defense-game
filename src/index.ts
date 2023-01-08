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
main.setupWindowSize();

// Load a scene
main.levelManager.loadScene('Level_0_MVP');
