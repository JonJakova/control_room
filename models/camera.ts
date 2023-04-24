export const CAMERA_COLLECTION = "camera";

export interface CameraCollection {
  _id: string;
  alias: string;
  index: number;
  owner: string;
  state: CameraState;
  created_at: Date;
  deleted: boolean;
}

export interface CameraDto {
  id?: string;
  alias?: string;
  index?: number;
  owner: string;
  state: CameraState;
  created_at: Date;
  deleted: boolean;
}

export enum CameraState {
  OFFLINE = "offline",
  ONLINE = "online",
  ERROR = "error",
}
