import { UserDto } from "tweeter-shared";
import { FollowEntry } from "./FollowEntry";

export interface FollowDAO {
  putFollowEntry: (
    userAlias: string,
    followeeAlias: string
  ) => Promise<void>;
  deleteFollower: (
    userAlias: string,
    followeeAlias: string
  ) => Promise<void>;
  getPageOfFollowers: (
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ) => Promise<[UserDto, boolean]>;
  getPageOfFollowees: (
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ) => Promise<[UserDto, boolean]>;
  getFollowerCount: (token: string, userAlias: string) => Promise<number>;
  getFolloweeCount: (token: string, userAlias: string) => Promise<number>;
  getFollowEntry: (token: string, userAlias: string) => Promise<FollowEntry>;
}
