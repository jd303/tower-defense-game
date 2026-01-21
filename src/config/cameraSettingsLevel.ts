import { CameraSettings } from '../core/CameraService';

export const perspectiveCameraLevel: CameraSettings = {
	name: 'cam-level-persp',
	fov: 25,
	near: 0.1,
	far: 350,
	zoom: 1,
	x: 0,
	y: 40,
	z: 50,
	clampingEnabled: false
};

export const orthographicCameraLevel: CameraSettings = {
	name: 'cam-level-ortho',
	near: 0.01,
	far: 1000,
	zoom: 0.7,
	x: 0,
	y: 75,
	z: 150,
	minPolarAngle: Math.PI * 0.23, //0.2 for better results
	maxPolarAngle: Math.PI * 0.23, // Was 0.4, the lower the less range
	minAzimuthAngle: 0,
	maxAzimuthAngle: 0,
	minZoom: 0.6,
	maxZoom: 1.2,
	clampingEnabled: true
};
