import * as THREE from 'three';
import { Effect } from '../../Effect';
import { Main } from '../../../core/Main';

export class BeamProjectileEffect extends Effect {
	static assetName = 'BeamProjectileEffect';

	linePointsDetail: number = 35;
	lineGeometry: THREE.BufferGeometry;
	lineMaterial: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xED1953, linewidth: 10 });
	line: THREE.Line;

	/**
	 * Constructor
	 * */
	constructor(main: Main) {
		super(main, BeamProjectileEffect.assetName);

		let parent = this.groupModel.parent;
		while (parent) {
			parent = parent.parent;
		}
	}

	/**
	 * Creates our initial line
	 */
	createLine(curve: THREE.LineCurve3) {
		const points = curve.getSpacedPoints(this.linePointsDetail);
		this.lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
		this.groupModel.add(this.line);

		const name = this.line.parent!.parent!.parent!.parent!.name;
		console.log("TEST", name);
		//this.groupMain.add(this.line);
	}
}
