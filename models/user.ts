export const USER_COLLECTION = "user";

export interface UserCollection {
  _id: string;
  email: string;
  password: string;
  created_at: Date;
  deleted: boolean;
  company?: string;
  roles: string[];
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
