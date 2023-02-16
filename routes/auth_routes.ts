import { Router } from "../dependecies.ts";
import { login } from "./services/user_service.ts";
import { generate_token } from "../security/jwt/token.ts";

const auth_router = new Router();
auth_router.prefix("/auth");

auth_router.post("/login", async (ctx) => {
  const req_body = await ctx.request.body().value;
  const user = await login(req_body.username, req_body.password);
  if (user instanceof Error) {
    ctx.response.status = 401;
    ctx.response.body = user.message;
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = {
    id: user._id,
    email: user.email,
    roles: user.roles,
    token: await generate_token({
      id: user._id,
      email: user.email,
      roles: user.roles,
    }),
  };
});

export { auth_router };
