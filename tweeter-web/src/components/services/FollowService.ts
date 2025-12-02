import { AuthToken, User, FakeData } from "tweeter-shared";

export class FollowService {
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
    return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias)
  }

  getFollowers = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias)
  }

  follow = async (
    authToken: AuthToken,
    userAlias: string,
    followeeAlias: string
  ) => {
    await new Promise((f) => setTimeout(f, 2000));
    
  }
  unfollow = async (
    authToken: AuthToken,
    userAlias: string,
    followeeAlias: string
  ) => {
    await new Promise((f) => setTimeout(f, 2000));
    
  }
}
