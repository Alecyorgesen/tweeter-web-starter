import {
  AuthToken,
  User,
  PagedItemRequest,
  UserDto,
  DisplayedUserRequest,
  UserAliasRequest,
} from "tweeter-shared";
import { ServerFacade } from "../server/ServerFacade";

export class FollowService {
  serverFacade = new ServerFacade();
  getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> => {
    const request: DisplayedUserRequest = {
      token: authToken.token,
      userAlias: user.alias,
      displayedUserAlias: selectedUser.alias,
    };
    return await this.serverFacade.getIsFollowerStatus(request);
  };

  getFolloweeCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    const request: UserAliasRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };
    return await this.serverFacade.getFolloweeCount(request);
  };

  getFollowerCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    const request: UserAliasRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };
    return await this.serverFacade.getFollowerCount(request);
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
    displayedUserAlias: string
  ) => {
    const request: DisplayedUserRequest = {
      token: authToken.token,
      userAlias: userAlias,
      displayedUserAlias: displayedUserAlias,
    };
    await this.serverFacade.follow(request);
  };
  unfollow = async (
    authToken: AuthToken,
    userAlias: string,
    displayedUserAlias: string
  ) => {
    const request: DisplayedUserRequest = {
      token: authToken.token,
      userAlias: userAlias,
      displayedUserAlias: displayedUserAlias,
    };
    await this.serverFacade.unfollow(request);
  };
}
