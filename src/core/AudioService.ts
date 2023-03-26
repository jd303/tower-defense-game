import { Main } from './Main';

/**
 * Audio Service that uses the Web Audio API
 * Contexts provide top-level classifications.  Context contain effects and graphs.
 * Effects can affect all graphs in a context, but cannot affect those in other contexts.
 *   e.g. Master volume, across multiple contexts, will need to be created per context and simultaneously updated
 * Effects are nodes like Gain, Pan, etc.
 * Graphs are full track nodes: tracks connected to effects and the context's destination / output.
 * */
export class AudioService {
	main: Main;

	/**
	 * Audio Core
	 * */
	audioContexts: AudioContextObject[] = [];
	audioSources: AudioSource[] = [];

	/**
	 * Audio Graphs
	 * */
	audioGraphs: AudioGraph[] = [];

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		this.main = main;
	}

	/**
	 * Adds an audio context
	 * */
	addContext(name: string) {
		const audioContext: AudioContextObject = {
			name: name,
			context: new AudioContext(),
			effects: [],
			sources: [],
		};

		this.audioContexts.push(audioContext);
		return audioContext;
	}

	/**
	 * Creates an audio source
	 * */
	addSource = function (name: string, filePath: string) {
		const audioSource = {
			name: name,
			filePath: filePath,
		};

		this.audioSources.push(audioSource);
		return audioSource;
	};

	/**
	 * Creates an effect against the given context
	 * */
	addEffectNode(type: AudioEffectTypes, audioContext: AudioContextObject, options: any = {}) {
		let effectNode: any;

		switch (type) {
			// GainNode
			case AudioEffectTypes.gain:
				effectNode = audioContext.context.createGain();
				break;

			// StereoPanner Node
			case AudioEffectTypes.stereopanner:
				effectNode = new StereoPannerNode(audioContext.context, options);
				break;
		}

		audioContext.effects.push(effectNode);
		return effectNode;
	}

	/**
	 * Creates an audio graph
	 * */
	addAudioGraph(audioContext: AudioContextObject, source: any, effects: AudioEffect[] = []) {
		const newAudioGraph = new AudioGraph(audioContext, source, effects);
		this.audioGraphs.push(newAudioGraph);
		return newAudioGraph;
	}
}

/**
 * CLASS: Audio Graph
 * A track, multiple effects, and a destination
 * Controls for playing, pausing and modifying effects
 * */
export class AudioGraph {
	audioContext: AudioContextObject;
	source: any;
	track: any;
	effects: AudioEffect[] = [];

	/**
	 * Constructor
	 * */
	constructor(audioContext: AudioContextObject, source: any, effects: AudioEffect[] = []) {
		this.audioContext = audioContext;
		this.source = source;
		this.effects = effects;

		this.setup();
	}

	/**
	 * Sets this audio graph up
	 * */
	setup() {
		this.track = this.audioContext.context.createMediaElementSource(new Audio(this.source.filePath));

		// If there are effects, connect them in a path
		if (this.effects.length) {
			this.track.connect(this.effects[0]);

			for (let x = 0; x < this.effects.length; x++) {
				if (this.effects[x + 1]) {
					(this.effects[x] as any).connect(this.effects[x + 1]);
				}
			}

			(this.effects[this.effects.length - 1] as any).connect(this.audioContext.context.destination);

			// Otherwise there are no effects
		} else {
			this.track.connect(this.effects[0]).connect(this.audioContext.context.destination);
		}
	}

	/**
	 * Plays the track
	 * */
	play() {
		this.track.mediaElement.play();
	}

	/**
	 * Pauses the track
	 * */
	pause() {
		this.track.mediaElement.pause();
	}
}

export interface AudioContextObject {
	name: string;
	context: AudioContext;
	effects: AudioEffect[];
	sources: AudioSource[];
}

interface AudioEffect {
	name: string;
	effectNode: AudioNode;
}

export interface AudioSource {
	name: string;
	filePath: string;
}

/*export interface AudioSystem {
	name: string;
	inputs: AudioTrack[];
	effects: AudioTrack[];
	destination: any; // Unsure what type for this right now
}*/

export enum AudioEffectTypes {
	gain,
	stereopanner,
}
