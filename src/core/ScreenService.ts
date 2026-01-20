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
		this.hashChange();
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
		const hashParts = hash.split("/");
		this.loadScreen(hashParts[0], hashParts[1]);
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
	loadScreen(screenName: string, screenArgument?: string) {
		if (this.currentScreen) this.currentScreen.dispose();

		const screenType = this.screens.find(screen => screen.hash == screenName);
		if (screenType) {
			const screen = new screenType.screenType(this.main);
			this.currentScreen = screen;
			screen.loadScreen(screenArgument);
		} else {
			if (this.screens[0]) {
				console.error(`Unable to find screen for hash ${screenName}, defaulting to first`);
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