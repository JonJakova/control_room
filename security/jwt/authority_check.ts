import { UserRoles } from "../../models/user.ts";
import { verify_token } from "./token.ts";

const AUTHORIZATION_HEADER = "Authorization";

// Need only token
export const authorize = async (ctx: any, next: any) => {
  const token = ctx.request.headers.get(AUTHORIZATION_HEADER);
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  const user = await verify_token(token);
  if (user instanceof Error) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  ctx.state.user = user;
  await next();
};

// Need token and user or admin role
export const authorize_user_role = async (ctx: any, next: any) => {
  const token = ctx.request.headers.get(AUTHORIZATION_HEADER);
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  const user = await verify_token(token);
  if (user instanceof Error) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  if (user.roles.indexOf(UserRoles.CLIENT) === -1 && user.roles.indexOf(UserRoles.ADMIN) === -1) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  ctx.state.user = user;
  await next();
};

// Need token and admin role
export const authorize_admin_role = async (ctx: any, next: any) => {
  const token = ctx.request.headers.get(AUTHORIZATION_HEADER);
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  const user = await verify_token(token);
  if (user instanceof Error || user.roles.indexOf(UserRoles.ADMIN) === -1) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  ctx.state.user = user;
  await next();
};
