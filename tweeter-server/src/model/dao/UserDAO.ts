import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUser: (userAlias: string) => Promise<[UserDto, string]>;
  addUser: (
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageFileExtension: string
  ) => Promise<[UserDto, string, number]>;
  incrementFollowerCount: (alias: string) => Promise<void>;
  incrementFolloweeCount: (alias: string) => Promise<void>;
  getUserFollowersAmount: (alias: string) => Promise<number>;
  getUserFolloweesAmount: (alias: string) => Promise<number>;
}
