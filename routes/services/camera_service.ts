import { control_room_db } from "../../config/mongo_connector.ts";
import { ObjectId } from "../../dependecies.ts";
import {
  CameraCollection,
  CameraDto,
  CameraState,
  CAMERA_COLLECTION,
} from "../../models/camera.ts";
import { get_user } from "./user_service.ts";

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

export const get_single_camera_by_owner = (camera_id: string, owner: string) => {
  const cameras = control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .findOne({ _id: new ObjectId(camera_id), owner: owner, deleted: false }, { sort: { created_at: -1 } });
  return cameras;
};

export const save_camera = async (camera: CameraDto) => {
  if (!camera.owner) return Error("Owner not sent");
  if (!camera.index) return Error("Index not sent");
  const user = await get_user(camera.owner);
  if (!user) return Error("User not found");

  const new_camera = {
    alias: camera.alias || camera.owner,
    index: camera.index,
    owner: camera.owner,
    state: camera.state || CameraState.OFFLINE,
    created_at: new Date(),
    deleted: false,
  } 
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .insertOne(new_camera);
};

export const update_camera = async (camera: CameraDto, user_id: string) => {
  if (!camera.id) return Error("Camera id not sent");

  const camera_to_update = await get_single_camera_by_owner(camera.id, user_id);
  if (!camera_to_update) return Error("Camera not found");

  camera.index != null && camera.index != undefined && (camera_to_update.index = camera.index);
  camera.alias && (camera_to_update.alias = camera.alias);
  camera.state && (camera_to_update.state = camera.state);
  camera.deleted && (camera_to_update.deleted = camera.deleted);
  
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .updateOne({ _id: new ObjectId(camera.id) }, { $set: camera_to_update });
};

export const change_delete_camera = (camera_id: string) => {
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .updateOne({  _id: new ObjectId(camera_id) }, { $set: { deleted: true } })
	|| Error("Camera not found");
};

export const change_camera_state = (camera_id: string, state: CameraState) => {
  return control_room_db
    .collection<CameraCollection>(CAMERA_COLLECTION)
    .updateOne({ _id: new ObjectId(camera_id) }, { $set: { state: state } })
  || Error("Camera not found");
}