import { control_room_db } from "../../config/mongo_connector.ts";
import { UserCollection, UserDto, USER_COLLECTION } from "../../models/user.ts";
import { hash, compare } from "../../security/encryption.ts";

export const get_users = () => {
  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .find({}, { sort: { created_at: -1 } })
    .toArray();
};

export const get_user = (id: string) => {
  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .findOne({ _id: { $oid: id }, deleted: false });
};

export const get_user_by_username = (username: string) => {
  const users = control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .findOne({ email: username, deleted: false });
  return users;
};

export const save_user = async (user: UserDto) => {
  (await get_user_by_username(user.email)) && Error("User already exists");
  const user_to_save = {
    email: user.email,
    password: await hash(user.password),
    created_at: new Date(),
    deleted: false,
  };
  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .insertOne(user_to_save);
};

export const update_user = async (user: UserDto) => {
  if (!user.id) return Error("Id not sent");
  const user_to_update = await get_user(user.id);
  if (!user_to_update) return Error("User not found");
  user.password && (user_to_update.password = await hash(user.password));
  user.deleted && (user_to_update.deleted = user.deleted);
  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .updateOne({ _id: { $oid: user.id } }, { $set: user_to_update });
};

export const delete_user = (id: string) => {
  return (
    control_room_db
      .collection<UserCollection>(USER_COLLECTION)
      .updateOne({ _id: { $oid: id } }, { $set: { deleted: true } }) ||
    Error("User not found")
  );
};

export const login = async (username: string, password: string) => {
  const user = await get_user_by_username(username);
  if (!user) return Error("User not found");
  return (await compare(password, user.password))
    ? user
    : Error("Wrong password");
};
