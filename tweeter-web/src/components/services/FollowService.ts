import {
  AuthToken,
  User,
  FakeData,
  PagedItemRequest,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../server/ServerFacade";

export class FollowService {
  serverFacade = new ServerFacade();
  getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  getFolloweeCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  getFollowerCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  getFollowees = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null
  ): Promise<[User[], boolean]> => {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollowee ? lastFollowee.dto : null,
    };
    return await this.serverFacade.getMoreFollowees(request);
  };

  getFollowers = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null
  ): Promise<[User[], boolean]> => {
    const request: PagedItemRequest<UserDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollower ? lastFollower.dto : null,
    };
    return await this.serverFacade.getMoreFollowers(request);
  };

  follow = async (
    authToken: AuthToken,
    userAlias: string,
    followeeAlias: string
  ) => {
    await new Promise((f) => setTimeout(f, 2000));
  };
  unfollow = async (
    authToken: AuthToken,
    userAlias: string,
    followeeAlias: string
  ) => {
    await new Promise((f) => setTimeout(f, 2000));
  };
}
