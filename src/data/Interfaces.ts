export interface SizesInterface {
	width: number;
	height: number;
}

export interface CameraInterface {
	fov?: number;
	near: number;
	far: number;
	sizes: SizesInterface;
}
