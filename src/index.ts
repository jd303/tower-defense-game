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

// Create a Perspective Camera
/*main.createPerspectiveMainCamera({
	fov: 150,
	near: 0.1,
	far: 250,
	sizes,
});*/

// Create an orthographic camera
/*main.createOrthographicMainCamera({
	near: 0.01,
	far: 1000,
	sizes,
});*/
main.createPerspectiveMainCamera({
	near: 0.01,
	far: 1000,
	sizes,
});
main.setupWindowSize();

// Load a scene
main.levelManager.loadScene('Level_0_MVP');
