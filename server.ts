import { Application } from "./dependecies.ts";
import { camera_router } from "./routes/camera_routes.ts";
import { user_router } from "./routes/user_routes.ts";
import { auth_router } from "./routes/auth_routes.ts";
import { config } from "./dependecies.ts";

// Create the application and add the routes
const app = new Application();
app.use(camera_router.routes());
app.use(camera_router.allowedMethods());
app.use(user_router.routes());
app.use(user_router.allowedMethods());
app.use(auth_router.routes());
app.use(auth_router.allowedMethods());

// Start the server
const { PORT } = config();
PORT && console.log(`Server running on port ${PORT}`);
await app.listen({ port: +PORT });
