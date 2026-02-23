import { CameraSettings } from '../core/CameraService';

export const perspectiveCameraDefaults: CameraSettings = {
	name: 'default-persp',
	fov: 25,
	near: 0.1,
	far: 1000,
	zoom: 0.65,
	x: 0,
	y: 40,
	z: 50,
	minPolarAngle: Math.PI * 0.15,
	maxPolarAngle: Math.PI * 0.4,
};

export const orthographicCameraDefaults: CameraSettings = {
	name: 'default-ortho',
	near: 0.01,
	far: 1000,
	zoom: 0.65,
	x: 0,
	y: 75,
	z: 150,
	minPolarAngle: Math.PI * 0.4,
	maxPolarAngle: Math.PI * 0.4,
	minAzimuthAngle: Math.PI * -0.1,
	maxAzimuthAngle: Math.PI * 0.1,
	minZoom: 0.4,
	maxZoom: 1.3,
};
