export interface SizesInterface {
  width: number;
  height: number;
}

export interface CameraInterface {
  perspective: boolean;
  fov: number;
  near: number;
  far: number;
  sizes: SizesInterface;
}
