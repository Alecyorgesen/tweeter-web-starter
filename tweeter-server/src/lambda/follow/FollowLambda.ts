import { DisplayedUserRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: DisplayedUserRequest
): Promise<TweeterResponse> => {
  const followService = new FollowService();
  await followService.follow(
    request.token,
    request.userAlias,
    request.displayedUserAlias
  );
  return {
    success: true,
    message: null,
  }
};