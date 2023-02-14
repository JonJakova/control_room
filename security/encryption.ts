import { bcrypt } from "../dependecies.ts";

export const hash = async (password: string) => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(password, salt);
};

export const compare = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
