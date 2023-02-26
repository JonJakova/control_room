import { Router } from "../dependecies.ts";
import { UserDto } from "../models/user.ts";
import { generic_promise_adapter } from "../utils/generic_promise_adapter.ts";
import {
  get_users,
  get_user,
  save_user,
  update_user,
} from "./services/user_service.ts";
import { authorize_admin_role, authorize_user_role } from "../security/jwt/authority_check.ts";

const user_router = new Router();
user_router.prefix("/users");

user_router.get("/", authorize_admin_role, async (ctx) => {
  console.log("Getting user list");
  const users = await get_users();
  ctx.response.status = 200;
  ctx.response.body = users.map((user) => {
    return {
      id: user._id,
      email: user.email,
      roles: user.roles,
      deleted: user.deleted,
    };
  });
});

user_router.get("/:id", authorize_admin_role, async (ctx) => {
  console.log("Getting user");
  const user = await get_user(ctx.params.id);
  if (!user) {
    ctx.response.status = 404;
    ctx.response.body = "User not found";
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = {
    id: user._id,
    email: user.email,
    roles: user.roles,
    deleted: user.deleted,
  };
});

user_router.get("/me", authorize_user_role, async (ctx) => {
  console.log("Getting user");
  const user = await get_user(ctx.state.user.id);
  if (!user) {
    ctx.response.status = 404;
    ctx.response.body = "User not found";
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = {
    id: user._id,
    email: user.email,
    roles: user.roles,
    deleted: user.deleted,
  };
});

user_router.post("/", authorize_admin_role, async (ctx) => {
  console.log("Storing user");
  const user = await generic_promise_adapter<UserDto>(ctx.request.body().value);

  if (user instanceof Error) {
    console.log("No body in request");
    ctx.response.status = 400;
    ctx.response.body = "Bad Request";
    return;
  }

  // Store the user in the database
  const new_user_id = await save_user(user);
  console.log("User stored");
  ctx.response.status = 200;
  ctx.response.body = { id: new_user_id };
});

user_router.patch("/", authorize_user_role, async (ctx) => {
  console.log("Updating user");
  const user = await generic_promise_adapter<UserDto>(ctx.request.body().value);

  if (user instanceof Error) {
    console.log("No body in request");
    ctx.response.status = 400;
    ctx.response.body = "Bad Request";
    return;
  }

  const updated_user = await update_user(user);
  if (updated_user instanceof Error) {
    ctx.response.status = 404;
    ctx.response.body = "User not found";
    return;
  }
  console.log("User updated");
  ctx.response.status = 200;
});

export { user_router };
