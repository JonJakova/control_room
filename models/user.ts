export const USER_COLLECTION = "user";

export interface UserCollection {
  _id: string;
  username: string;
  password: string;
  created_at: Date;
  deleted: boolean;
}

export interface UserDto extends UserMinDto {
  password: string;
  created_at: Date;
}

export interface UserMinDto {
  username: string;
  deleted: boolean;
}

export const toUserDto = (user: UserCollection): UserDto => {
  return {
    username: user.username,
    password: user.password,
    created_at: user.created_at,
    deleted: user.deleted,
  };
};

export const toUserMinDto = (user: UserDto): UserMinDto => {
  return {
    username: user.username,
    deleted: user.deleted,
  };
};
