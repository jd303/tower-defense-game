import './style.css';
import './stylePopups.css';
import { Main } from './core/Main';
import { LevelService } from './levels/LevelService';
import { PositionService } from './environment/PositionService';
import { EconomyService } from './game/EconomyService';
import { UIService } from './game/UIService';
import { EventService } from './core/EventService';
import { InteractionService2 } from './game/InteractionService2';
import { FogOfWarService } from './game/FogOfWarService';
import { ParticleService } from './core/ParticleService';
import { PathService } from './game/PathService';
import { LocationService } from './game/LocationService';
import { DebugService } from './core/DebugService';
import { ScreenService } from './core/ScreenService';
import { SplashScreen } from './screens/SplashScreen';
import { LevelScreen } from './screens/LevelScreen';
import { MapScreen } from './screens/MapScreen';
import { HeroesScreen } from './screens/HeroesScreen';
import { PowersScreen } from './screens/PowersScreen';
import { TowersScreen } from './screens/TowersScreen';
import { UpgradesScreen } from './screens/UpgradesScreen';
import { RunEndScreen } from './screens/RunEndScreen';

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
main.registerService('Interaction2', new InteractionService2(main));
main.registerService('Path', new PathService(main));
main.registerService('Location', new LocationService(main));
main.registerService('Level', new LevelService(main));
main.registerService('Position', new PositionService(main));
main.registerService('Economy', new EconomyService(main));
main.registerService('UI', new UIService(main));
main.registerService('Event', new EventService());
main.registerService('FogOfWar', new FogOfWarService(main));
main.registerService('Particle', new ParticleService(main));
main.registerService('Debug', new DebugService(main));
main.registerService('Screen', new ScreenService(main));

// Setup Screens
main.s('Screen').registerScreen({
	hash: 'splash',
	screenType: SplashScreen
});
main.s('Screen').registerScreen({
	hash: 'game',
	screenType: LevelScreen
});
main.s('Screen').registerScreen({
	hash: 'map',
	screenType: MapScreen
});
main.s('Screen').registerScreen({
	hash: 'heroes',
	screenType: HeroesScreen
});
main.s('Screen').registerScreen({
	hash: 'powers',
	screenType: PowersScreen
});
main.s('Screen').registerScreen({
	hash: 'towers',
	screenType: TowersScreen
});
main.s('Screen').registerScreen({
	hash: 'upgrades',
	screenType: UpgradesScreen
});
main.s('Screen').registerScreen({
	hash: 'endRun',
	screenType: RunEndScreen
});
main.s('Screen').loaded();
