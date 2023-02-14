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
    .findOne(
      { username: username, deleted: false },
      { sort: { created_at: -1 } }
    );
  return users;
};

export const save_user = async (user: UserDto) => {
  user.created_at = new Date();
  user.deleted = false;
  user.password = await hash(user.password);
  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .insertOne(user);
};

export const update_user = async (id: string, user: UserDto) => {
  const user_to_update = await get_user(id);
  if (!user_to_update) return Error("User not found");
  user.username && (user_to_update.username = user.username);
  user.deleted && (user_to_update.deleted = user.deleted);
  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .updateOne({ _id: { $oid: id } }, { $set: user_to_update });
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
  if (await compare(password, user.password)) {
    return user;
  } else {
    return Error("Wrong password");
  }
};
