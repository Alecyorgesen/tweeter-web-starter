import { QuantityResponse, TweeterRequest, UserAliasRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: UserAliasRequest
): Promise<QuantityResponse> => {
  const followService = new FollowService();
  const followee_number = await followService.getFolloweeCount(
    request.token,
    request.userAlias,
  );

  return {
    success: true,
    message: null,
    amount: followee_number
  }
};