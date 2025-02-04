import { Main } from './Main';
import { Service } from './Service';

export class WindowService extends Service {
	main: Main;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super();

		this.main = main;
	}

	/**
	 * Called on resize of the window
	 * */
	resize = function () {
		this.main.sizes.width = window.innerWidth;
		this.main.sizes.height = window.innerHeight;

		// Update camera
		this.main.s('Camera').resizeEvent();

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

export interface SizesInterface {
	width: number;
	height: number;
}
