import { Router } from "../dependecies.ts";
import { CameraDto, ChangeCameraStateDto } from "../models/camera.ts";
import { generic_promise_adapter } from "../utils/generic_promise_adapter.ts";
import { authorize_admin_role, authorize_user_role } from "../security/jwt/authority_check.ts";
import {
  get_camera,
  get_cameras,
  get_camera_by_owner,
  save_camera,
  update_camera,
change_camera_state,
get_single_camera_by_owner,
} from "./services/camera_service.ts";

const camera_router = new Router();
camera_router.prefix("/cameras");

camera_router.get("/", authorize_admin_role, async (ctx) => {
  console.log("Getting camera list");
  const cameras = await get_cameras();
  ctx.response.status = 200;
  ctx.response.body = cameras;
});

camera_router.get("/:id", authorize_admin_role, async (ctx) => {
  console.log("Getting camera");
  const camera_id = ctx.params.id;
  const camera = await get_camera(camera_id);
  if (!camera) {
    console.log("Camera not found");
    ctx.response.status = 404;
    ctx.response.body = "Camera not found";
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = {
    id: camera_id,
    index: camera.index,
    alias: camera.alias,
    owner: camera.owner,
    state: camera.state,
  };
});

camera_router.get("/owner/:owner", authorize_user_role, async (ctx) => {
  console.log("Getting camera list by owner: ", ctx.state.user.email);
  const owner = ctx.params.owner;
  const cameras = await get_camera_by_owner(owner);
  ctx.response.status = 200;
  ctx.response.body = cameras.map((camera) => {
    return {
      id: camera._id,
      index: camera.index,
      alias: camera.alias,
      owner: camera.owner,
      state: camera.state,
    };
  });
});

camera_router.post("/", authorize_user_role, async (ctx) => {
  console.log("Storing camera");
  const camera = await generic_promise_adapter<CameraDto>(
    ctx.request.body().value
  );

  if (camera instanceof Error) {
    console.log("No body in request");
    ctx.response.status = 400;
    ctx.response.body = "Bad Request";
    return;
  }

  // Store the camera in the database
  const new_camera_id = await save_camera(camera);
  if (new_camera_id instanceof Error) {
    console.log("Error storing camera");
    ctx.response.status = 400;
    ctx.response.body = new_camera_id.message;
    return;
  }

  console.log("Camera stored");
  ctx.response.status = 200;
  ctx.response.body = { id: new_camera_id };
});

camera_router.patch("/", authorize_user_role, async (ctx) => {
  console.log("Updating camera");
  const camera = await generic_promise_adapter<CameraDto>(
    ctx.request.body().value
  );

  if (camera instanceof Error || !camera.id) {
    console.log("Missing or invalid body in request");
    ctx.response.status = 400;
    ctx.response.body = "Bad Request";
    return;
  }

  // Store the camera in the database
  const updated_camera = await update_camera(camera, ctx.state.user.id);
  if (updated_camera instanceof Error) {
    console.log("Camera not found");
    ctx.response.status = 404;
    ctx.response.body = "Camera not found";
    return;
  }

  console.log("Camera updated");
  ctx.response.status = 200;
});

camera_router.patch("/change-state", authorize_user_role, async (ctx) => {
  console.log("Changing camera state");
  const camera = await generic_promise_adapter<ChangeCameraStateDto>(
    ctx.request.body().value
  );

  if (camera instanceof Error || !camera.id || !camera.state) {
    console.log("Missing or invalid body in request");
    ctx.response.status = 400;
    ctx.response.body = "Bad Request";
    return;
  }

  // Store the camera in the database
  if (!await get_single_camera_by_owner(camera.id, ctx.state.user.id)) {
    console.log("Camera not found");
    ctx.response.status = 404;
    ctx.response.body = "Camera not found";
    return;
  }

  const updated_camera = await change_camera_state(camera.id, camera.state);
  if (updated_camera instanceof Error) {
    console.log("Camera not found");
    ctx.response.status = 404;
    ctx.response.body = "Camera not found";
    return;
  }

  console.log("Camera state updated");
  ctx.response.status = 200;
})

export { camera_router };
