export const CAMERA_COLLECTION = "camera";

export interface CameraCollection {
    _id: string;
    username: string;
    created_at: Date;
    deleted: boolean;
}

export interface CameraDto {
    username: string;
    created_at: Date;
    deleted: boolean;
}