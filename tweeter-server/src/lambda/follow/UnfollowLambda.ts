import { DisplayedUserRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FollowDAOFactoryDynamoDB } from "../../model/factories/FollowDAOFactoryDynamoDB";
import { UserDAOFactoryDynamoDB } from "../../model/factories/UserDAOFactoryDynamoDB";
import { AuthDAOFactoryDynamoDB } from "../../model/factories/AuthDAOFactoryDynamoDB";
import { AuthService } from "../../model/service/AuthService";
import { TIME_VALID } from "../AuthTokenValidTime";

const authService = new AuthService(new AuthDAOFactoryDynamoDB());
const followService = new FollowService(
  new FollowDAOFactoryDynamoDB(),
  new UserDAOFactoryDynamoDB()
);
export const handler = async (
  request: DisplayedUserRequest
): Promise<TweeterResponse> => {
  await authService.isTokenValid(request.token, TIME_VALID);

  await followService.unfollow(request.userAlias, request.displayedUserAlias);
  return {
    success: true,
    message: null,
    errorMessage: null,
  };
};
