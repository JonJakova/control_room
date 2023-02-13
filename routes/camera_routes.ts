// import { router } from "../config/setup.ts";
import { Router } from "../dependecies.ts";
import { CameraModel } from "../models/camera.ts";

const camera_router = new Router();

camera_router.get("/list", async (ctx) => {
    // Get all cameras from the database
    // ...
    ctx.response.status = 200;
    ctx.response.body = "List of cameras";
});

camera_router.post("/store", async (ctx) => {
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        ctx.response.body = "Bad Request";
        return;
    }
    // Expect request body in CameraModel format
    const body = await ctx.request.body();
    const camera: CameraModel = body.value;
    // Store the camera in the database
    // ...
    ctx.response.status = 200;
    ctx.response.body = "Stored";
});

export { camera_router };