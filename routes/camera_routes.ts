import { Router } from "../dependecies.ts";
import { CameraDto } from "../models/camera.ts";
import { generic_promise_adapter } from "../utils/generic_promise_adapter.ts";
import { get_cameras, save_camera } from "./services/camera_service.ts";

const camera_router = new Router();
camera_router.prefix("/cameras");

camera_router.get("/", async (ctx) => {
  console.log("Getting camera list");
  const cameras = await get_cameras();
  ctx.response.status = 200;
  ctx.response.body = cameras;
});

camera_router.post("/", async (ctx) => {
  console.log("Storing camera");
  const req_body = await generic_promise_adapter<CameraDto>(ctx.request.body().value);

  if (req_body instanceof Error) {
    console.log("No body in request");
    ctx.response.status = 400;
    ctx.response.body = "Bad Request";
    return;
  }
  
  // Expect request body in CameraModel format
  const camera: CameraDto = await ctx.request.body().value;
  // Store the camera in the database
  const new_camera_id = await save_camera(camera);
  console.log("Camera stored");
  ctx.response.status = 200;
  ctx.response.body = { _id: new_camera_id};
});

export { camera_router };