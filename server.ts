import { Application } from "./dependecies.ts";
import { camera_router } from "./routes/camera_routes.ts";

const app = new Application();

// app.use(ctx => {
//     ctx.response.body = "Hello World!";
// });

app.use(camera_router.routes());
app.use(camera_router.allowedMethods());

// Start the server
console.log("Server running on port 8000");
await app.listen({ port: 8000 });
