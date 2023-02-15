export const USER_COLLECTION = "user";

export interface UserCollection {
  _id: string;
  email: string;
  password: string;
  created_at: Date;
  deleted: boolean;
  company?: string;
}

export interface UserMinDto {
  email: string;
  deleted: boolean;
}

export interface UserDto extends UserMinDto {
  id?: string;
  password: string;
  created_at: Date;
}

export const toUserDto = (user: UserCollection): UserDto => {
  return {
    id: user._id,
    email: user.email,
    password: user.password,
    created_at: user.created_at,
    deleted: user.deleted,
  };
};

export const toUserMinDto = (user: UserDto): UserMinDto => {
  return {
    email: user.email,
    deleted: user.deleted,
  };
};
