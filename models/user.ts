export const USER_COLLECTION = "user";

export interface UserCollection {
  _id: string;
  email: string;
  password: string;
  created_at: Date;
  deleted: boolean;
  company?: string;
  roles: UserRoles[];
}

export interface UserDto {
  id?: string;
  email: string;
  password: string;
  roles: string[];
  deleted?: boolean;
  created_at?: Date;
}

export interface UserJWT {
  id: string;
  email: string;
  roles: string[];
}

export enum UserRoles {
  ADMIN = "admin",
  CLIENT = "client",
}

export const role_from_str = (role: string) => {
  if (role === UserRoles.ADMIN) return UserRoles.ADMIN;
  if (role === UserRoles.CLIENT) return UserRoles.CLIENT;
  throw Error("Invalid role");
}