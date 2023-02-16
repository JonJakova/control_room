import { UserJWT } from "../../models/user.ts";
import { jwt } from "../../dependecies.ts";
import { get_key } from "../../utils/secret_generator.ts";

// Generate a token from user id, email and password
export const generate_token = async (payload: UserJWT) => {
  const header: jwt.Header = {
    alg: "HS512",
    typ: "JWT",
  };
  return await jwt.create(header, { ...payload }, await get_key());
};

// Verify token
export const verify_token = async (token: string) => {
  token = token.replace("Bearer ", "");
  try {
    const { id, email, roles } = await jwt.verify(token, await get_key());
    if (!id || !email || !roles) return Error("Invalid token");
    if (
      typeof id !== "string" ||
      typeof email !== "string" ||
      !Array.isArray(roles)
    ) {
      return Error("Invalid token");
    }
    return { id, email, roles } as UserJWT;
  } catch (error) {
    return Error("Invalid token: ", error);
  }
};

// Decode token
// deno-lint-ignore require-await
export const decode_token = async (token: string) => {
  const [header, payload, signature] = jwt.decode(token);
  return { header, payload, signature };
};

