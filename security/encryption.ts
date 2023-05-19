import { bcrypt } from "../dependecies.ts";

export const hash = async (password: string) => await bcryp_hash_sync(password);
export const compare = async (password: string, hash: string) => bcryp_compare_sync(password, hash);

// Bcrypt async implementation
const bcryp_hash_async = async (password: string) => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(password, salt);
};
const bcryp_compare_async = async (password: string, hash: string) => await bcrypt.compare(password, hash);

// Bcrypt sync implementation
const bcryp_hash_sync = async (password: string) => {
  const salt = await bcrypt.genSalt(8);
  return bcrypt.hashSync(password, salt);
};
const bcryp_compare_sync = (password: string, hash: string) => bcrypt.compareSync(password, hash);
