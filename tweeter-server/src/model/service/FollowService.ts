import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";

export class FollowService {
  getIsFollowerStatus = async (
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  getFolloweeCount = async (token: string, userAlias: string): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(userAlias);
  };

  getFollowerCount = async (token: string, userAlias: string): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(userAlias);
  };

  getFollowees = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    return this.getFakeData(lastItem, pageSize, userAlias);
  };

  getFollowers = async (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> => {
    return this.getFakeData(lastItem, pageSize, userAlias);
  };

  follow = async (
    token: string,
    userAlias: string,
    followeeAlias: string
  ) => {
    await new Promise((f) => setTimeout(f, 2000));
    
  }
  unfollow = async (
    token: string,
    userAlias: string,
    followeeAlias: string
  ) => {
    await new Promise((f) => setTimeout(f, 2000));
    
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }

}
