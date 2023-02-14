import { Router } from "../dependecies.ts";
import { toUserDto, toUserMinDto, UserDto } from "../models/user.ts";
import { generic_promise_adapter } from "../utils/generic_promise_apater.ts";
import { get_users, get_user, save_user } from "./services/user_service.ts";

const user_router = new Router();
user_router.prefix("/users");

user_router.get("/", async (ctx) => {
    console.log("Getting user list");
    const users = await get_users();
    ctx.response.status = 200;
    ctx.response.body = users.map(user => toUserDto(user));
});

user_router.get("/:id", async (ctx) => {
    console.log("Getting user");
    const user = await get_user(ctx.params.id);
    if (!user) {
        ctx.response.status = 404;
        ctx.response.body = "User not found";
        return;
    }
    ctx.response.status = 200;
    ctx.response.body = toUserMinDto(toUserDto(user));
});

user_router.post("/", async (ctx) => {
    console.log("Storing user");
    const req_body = await generic_promise_adapter<UserDto>(ctx.request.body().value);

    if (req_body instanceof Error) {
        console.log("No body in request");
        ctx.response.status = 400;
        ctx.response.body = "Bad Request";
        return;
    }

    // Expect request body in UserModel format
    const user: UserDto = await ctx.request.body().value;
    // Store the user in the database
    const new_user_id = await save_user(user);
    console.log("User stored");
    ctx.response.status = 200;
    ctx.response.body = { _id: new_user_id};
});

export { user_router };