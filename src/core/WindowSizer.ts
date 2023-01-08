import { Main } from './Main';

export class WindowSizer {
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Called on resize of the window
	 * */
	resize = function () {
		this.main.sizes.width = window.innerWidth;
		this.main.sizes.height = window.innerHeight;

		// Update camera
		this.main.cameraManager.resizeEvent();

		// Update the renderer
		this.main.renderer.setSize(this.main.sizes.width, this.main.sizes.height);
		this.main.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
	};

	/**
	 * Sets up a listener for window resize
	 * */
	watchResize() {
		window.addEventListener('resize', this.resize.bind(this));
	}
}
