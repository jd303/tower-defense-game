import { Main } from "./Main";
import { Screen } from '../screens/Screen';
import { Service } from "./Service";

export class ScreenService extends Service {
	main: Main;
	hashListener: any;
	currentScreen: Screen;
	screens: ScreenDefinition[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();
		this.main = main;

		this.listenForHashChange();
	}

	/**
	 * Runs on page load
	 */
	loaded() {
		const hash = window.location.hash.replace("#", "");
		this.loadScreen(hash);
	}

	/**
	 * Pick a screen based on hash
	 */
	listenForHashChange() {
		this.hashListener = window.addEventListener('hashchange', this.hashChange.bind(this));
	}

	/**
	 * When hash changes, load a new screen
	 */
	hashChange() {
		const hash = window.location.hash.replace("#", "");
		this.loadScreen(hash);
	}

	/**
	 * Registers a screen
	 */
	registerScreen(screen: ScreenDefinition) {
		this.screens.push(screen);
	}

	/**
	 * Load Screen
	 */
	loadScreen(hash: string) {
		if (this.currentScreen) this.currentScreen.dispose();

		const screenType = this.screens.find(screen => screen.hash == hash);
		if (screenType) {
			const screen = new screenType.screenType(this.main);
			this.currentScreen = screen;
			screen.load();
		} else {
			if (this.screens[0]) {
				console.error(`Unable to find screen for hash ${hash}, defaulting to first`);
				this.loadScreen(this.screens[0].hash);
			} else {
				console.error(`Critical Error: Screens not setup properly`);
			}
		}
	}
}

interface ScreenDefinition {
	hash: string;
	screenType: typeof Screen;
}