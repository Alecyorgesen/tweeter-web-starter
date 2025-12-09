import { UserDto } from "tweeter-shared";

export interface UserDAO {
  getUser: (userAlias: string) => Promise<[UserDto | null, string]>;
  addUser: (
    firstName: string,
    lastName: string,
    alias: string,
    hashedPassword: string,
    imageUrl: string
  ) => Promise<void>;
  incrementFollowerCount: (alias: string) => Promise<void>;
  incrementFolloweeCount: (alias: string) => Promise<void>;
  decrementFollowerCount: (alias: string) => Promise<void>;
  decrementFolloweeCount: (alias: string) => Promise<void>;
  getUserFollowersAmount: (alias: string) => Promise<number>;
  getUserFolloweesAmount: (alias: string) => Promise<number>;
}
