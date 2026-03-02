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
			console.log(parent);
			parent = parent.parent;
		}
	}

	/**
	 * Creates our initial line
	 */
	createLine(curve: THREE.LineCurve3) {
		console.log(curve.getSpacedPoints(2));
		const points = curve.getSpacedPoints(this.linePointsDetail);
		this.lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
		this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
		this.groupMain.add(this.line);
		console.log(this.groupMain);
		//this.main.scene.add(this.line);
	}
}
