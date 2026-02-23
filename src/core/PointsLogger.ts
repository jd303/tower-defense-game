import * as THREE from 'three';
import { Camera } from './CameraService';
import { PathPoint } from '../dataTypes/PathInterfaces';

/**
 * Prints Points to the console
 * */
export class PointsLogger {
	static log(points: PathPoint[], closed: boolean = true, name: string = "") {
		if (closed) console.groupCollapsed(`>>> PATH >>>> ${name}`);
		else console.group(`>>> PATH >>>> ${name}`);
		console.log(points);
		console.log(points.map((pathPoint) => {
			return `\n{ point: new THREE.Vector3(${pathPoint.point.x}, ${pathPoint.point.y}, ${pathPoint.point.z}) }`
		}).join(', '));
		console.groupEnd();
	}
}
