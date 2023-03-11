import { CameraSettings } from '../core/CameraService';

export const perspectiveCameraDefaults: CameraSettings = {
	fov: 25,
	near: 0.1,
	far: 350,
	zoom: 0.5,
	x: 0,
	y: 40,
	z: 50,
};

export const orthographicCameraDefaults: CameraSettings = {
	near: 0.01,
	far: 1000,
	zoom: 0.65,
	x: 0,
	y: 75,
	z: 120,
	minPolarAngle: Math.PI * 0.2,
	maxPolarAngle: Math.PI * 0.4,
	minAzimuthAngle: Math.PI * -0.1,
	maxAzimuthAngle: Math.PI * 0.1,
	minZoom: 0.65,
	maxZoom: 1.3,
};
