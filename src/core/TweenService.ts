import TWEEN, { Tween } from '@tweenjs/tween.js';
import { TickCallback, TickService, TickTimeTypes } from './TickService';
import { Main } from './Main';

export class TweenService {
	/**
	 * Core
	 */
	main: Main;
	tweens: TweenDefinition[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;

		const sTick: TickService = this.main.s('Tick');
		sTick.registerCallback(new TickCallback('tweens', this.updateTweens.bind(this)), true, TickTimeTypes.frame);
	}

	/**
	 * Creates a tween
	 */
	createTween({ name, targetObject, modifiedPropertyObject, durationMS, easing, delayMS, onComplete, onUpdate, startNow = true }: TweenRegistration) {
		const tween = new TWEEN.Tween(targetObject).to(modifiedPropertyObject, durationMS);

		if (easing) tween.easing(easing);
		if (delayMS) tween.delay(delayMS);
		if (onUpdate) tween.onUpdate((_, elapsedTime) => onUpdate(_, elapsedTime));
		tween.onComplete(() => {
			this.deregisterTween(name);
			if (onComplete) onComplete();
		});

		this.registerTween(name, durationMS, tween);

		if (startNow) {
			this.startTween(name);
		}
	}

	/**
	 * Registers a tween
	 */
	registerTween(name: string, durationMS: number, tween: Tween) {
		this.tweens.push({
			name: name,
			durationMS: durationMS,
			tween: tween,
		});

		const sTick: TickService = this.main.s('Tick');
		sTick.registerCallback(new TickCallback(`Pause_tweens`, this.pauseTweens.bind(this)), true, TickTimeTypes.pause);
		sTick.registerCallback(new TickCallback(`Pause_tweens`, this.resumeTweens.bind(this)), true, TickTimeTypes.resume);
	}

	/**
	 * Starts a Tween
	 */
	startTween(name: string) {
		const tweenDefinition = this.tweens.find(tweenDef => tweenDef.name == name);
		if (tweenDefinition) {
			tweenDefinition.startTime = new Date().getTime();
			tweenDefinition.tween.start();
		}
	}

	/**
	 * Stops a Tween
	 */
	stopTween(name: string, dregister: boolean = false) {
		const tweenDefinition = this.tweens.find(tweenDef => tweenDef.name == name);
		if (tweenDefinition) {
			tweenDefinition.tween.stop();
			if (dregister) this.deregisterTween(name);
		}
	}

	/**
	 * Updates Tweens on Tick
	 */
	updateTweens() {
		this.tweens.forEach(tweenDef => {
			tweenDef.tween.update();
		});
	}

	/**
	 * Pauses all started tweens
	 */
	pauseTweens() {
		this.tweens.forEach(tweenDef => tweenDef.tween.pause());
	}

	/**
	 * Resumes all started tweens
	 */
	resumeTweens() {
		this.tweens.forEach(tweenDef => tweenDef.tween.resume());
	}

	/**
	 * Removed completed tween by name
	 * @param name Name of the tween
	 */
	deregisterTween(name: string) {
		this.tweens = this.tweens.filter(tweenDef => tweenDef.name != name);
	}
}

export interface TweenDefinition {
	name: string,
	durationMS: number;
	tween: Tween,

	// Future properties
	startTime?: number,
	pauseTime?: number
}

export interface TweenRegistration {
	name: string;
	targetObject: object;
	modifiedPropertyObject: object;
	durationMS: number;
	easing: any; // Unable to properly tpe as EasingFunction or similar
	delayMS?: number;
	onComplete?: Function;
	onUpdate?: Function;
	startNow?: boolean;
}