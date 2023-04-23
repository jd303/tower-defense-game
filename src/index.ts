import './style.css';
import { Main } from './core/Main';
import { LevelService } from './levels/LevelService';
import { InteractionService } from './game/InteractionService';
import { PositionService } from './environment/PositionService';
import { EconomyService } from './game/EconomyService';
import { UIService } from './game/UIService';
import { EventService } from './core/EventService';
import { SplashScreen } from './levels/levels/_SplashScreen';

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
main.registerService('Position', new PositionService(main));
main.registerService('Economy', new EconomyService(main));
main.registerService('UI', new UIService(main));
main.registerService('Event', new EventService());

// Loads the working scene
if (location.hash == '') {
	new SplashScreen(main);
} else {
	main.s('Level').loadLevel('Level_0_MVP');
}

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
