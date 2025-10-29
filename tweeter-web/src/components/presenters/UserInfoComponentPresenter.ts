import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../services/FollowService";

export class UserInfoComponentPresenter {
  followService = new FollowService();
  getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> => {
    return this.followService.getIsFollowerStatus(
      authToken,
      user,
      selectedUser
    );
  };

  getFolloweeCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    return this.followService.getFolloweeCount(authToken, user);
  };

  getFollowerCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return this.followService.getFollowerCount(authToken, user);
  };
}
