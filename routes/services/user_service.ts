import { control_room_db } from "../../config/mongo_connector.ts";
import { ObjectId } from "../../dependecies.ts";
import { UserCollection, UserDto, USER_COLLECTION, role_from_str } from "../../models/user.ts";
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
    .findOne({ _id: new ObjectId(id), deleted: false });
};

export const get_user_by_username = (username: string) => {
  const users = control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .findOne({ email: username, deleted: false });
  return users;
};

export const save_user = async (user: UserDto) => {
  (await get_user_by_username(user.email)) && Error("User already exists");
  const user_to_save: any = {
    email: user.email,
    password: await hash(user.password),
    roles: user.roles.map(r => role_from_str(r)) || [],
    created_at: new Date(),
    deleted: false,
  };
  if (user.first_name) user_to_save.first_name = user.first_name;
  if (user.last_name) user_to_save.last_name = user.last_name;
  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .insertOne(user_to_save);
};

export const update_user = async (user: UserDto) => {
  if (!user.id) return Error("Id not sent");

  const user_to_update = await get_user(user.id);
  if (!user_to_update) return Error("User not found");

  user.password && (user_to_update.password = await hash(user.password));
  user.roles && (user_to_update.roles = user.roles.map(r => role_from_str(r)));
  user.deleted && (user_to_update.deleted = user.deleted);

  return control_room_db
    .collection<UserCollection>(USER_COLLECTION)
    .updateOne({ _id: new ObjectId(user.id) }, { $set: user_to_update });
};

export const delete_user = (user_id: string) => {
  return (
    control_room_db
      .collection<UserCollection>(USER_COLLECTION)
      .updateOne({ _id: new ObjectId(user_id)  }, { $set: { deleted: true } }) ||
    Error("User not found")
  );
};

export const login = async (username: string, password: string) => {
  console.log("User: " + username + " is trying to login...");
  const user = await get_user_by_username(username);
  if (!user) return Error("User not found");
  console.log("User found: " + user.email);
  return (await compare(password, user.password))
    ? user
    : Error("Wrong password");
};
