import './style.css';
import { Main } from './core/Main';
import { LevelService } from './levels/LevelService';
import { InteractionService } from './InteractionService';
import { PositionService } from './environment/PositionService';

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

// Create services
main.registerService('Level', new LevelService(main));
main.registerService('Interaction', new InteractionService(main));
main.registerService('PositionService', new PositionService(main));

// Loads the working scene
main.s('Level').loadScene('Level_0_MVP');

// Load an alternate debug scene
/*main.s('Camera').createPerspectiveCamera(true);
main.s('Tick').tick();
main.s('Camera').setupOrbitControls();
main.s('Debug').createDebugSphere();
const ambientLight = main.s('Lighting').addAmbientLight();
const directionalLight = main.s('Lighting').addDirectionalLight(true);
main.s('Debug').debugLight(directionalLight, 'Directional Light');
main.s('Debug').debugLight(ambientLight, 'Ambient Light');
*/
