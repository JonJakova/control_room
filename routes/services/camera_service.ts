import { control_room_db } from "../../config/mongo_connector.ts";
import { ObjectId } from "../../dependecies.ts";
import {
  CameraCollection,
  CameraDto,
  CameraState,
  CAMERA_COLLECTION,
} from "../../models/camera.ts";

export const get_cameras = () => {
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .find({}, { sort: { created_at: -1 } })
    .toArray();
};

export const get_camera = (id: string) => {
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .findOne({ _id: new ObjectId(id), deleted: false });
};

export const get_camera_by_owner = (owner: string) => {
  const cameras = control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .find({ owner: owner, deleted: false }, { sort: { created_at: -1 } });
  return cameras.toArray();
};

export const save_camera = (camera: CameraDto) => {
  if (!camera.owner) return Error("Owner not sent");
  const new_camera = {
    alias: camera.alias || camera.owner,
    owner: camera.owner,
    state: camera.state || CameraState.OFFLINE,
    created_at: new Date(),
    deleted: false,
  } 
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .insertOne(new_camera);
};

export const update_camera = async (camera_id: string, camera: CameraDto, user_id: string) => {
  const camera_to_update = await get_camera(camera_id);
  if (!camera_to_update || camera_to_update._id !== user_id) return Error("Camera not found");

  camera.state && (camera_to_update.state = camera.state);
  camera.deleted && (camera_to_update.deleted = camera.deleted);
  
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .updateOne({ _id: { $oid: camera_id } }, { $set: camera_to_update });
};

export const change_delete_camera = (id: string) => {
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .updateOne({ _id: { $oid: id } }, { $set: { deleted: true } })
	|| Error("Camera not found");
};
