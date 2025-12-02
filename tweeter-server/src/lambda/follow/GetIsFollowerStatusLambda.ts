import { IsFollowerResponse, DisplayedUserRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: DisplayedUserRequest
): Promise<IsFollowerResponse> => {
  const followService = new FollowService();
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.userAlias,
    request.displayedUserAlias,
  );

  return {
    success: true,
    message: null,
    isFollower: isFollower
  }
};