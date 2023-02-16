import { verify_token } from "./token.ts";

export const authorize = async (ctx: any, next: any) => {
  const token = ctx.request.headers.get("Authorization");
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
  await next();
};

export const authorize_user_role = async (ctx: any, next: any) => {
  const token = ctx.request.headers.get("Authorization");
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  const user = await verify_token(token);
  if (user instanceof Error || user.roles.indexOf("user") === -1) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  await next();
};

export const authorize_admin_role = async (ctx: any, next: any) => {
  const token = ctx.request.headers.get("Authorization");
  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  const user = await verify_token(token);
  if (user instanceof Error || user.roles.indexOf("admin") === -1) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
    return;
  }
  await next();
};
