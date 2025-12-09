import { UserDto } from "tweeter-shared";
import { FollowEntry } from "./FollowEntry";
import { DataPage } from "./DataPage";

export interface FollowDAO {
  putFollowEntry: (followEntry: FollowEntry) => Promise<void>;
  deleteFollowEntry: (followEntry: FollowEntry) => Promise<void>;
  getPageOfFollowers: (
    userAlias: string,
    pageSize: number,
    lastItem: FollowEntry | null
  ) => Promise<DataPage<FollowEntry>>;
  getPageOfFollowees: (
    userAlias: string,
    pageSize: number,
    lastItem: FollowEntry | null
  ) => Promise<DataPage<FollowEntry>>;
  getFollowerCount: (userAlias: string) => Promise<number>;
  getFolloweeCount: (userAlias: string) => Promise<number>;
  getFollowEntry: (
    userAlias: string,
    followee: string
  ) => Promise<FollowEntry | null>;
}
